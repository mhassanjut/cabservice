package com.stwmovers.taxi.application.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.stwmovers.taxi.application.dto.request.AdminTourRequest;
import com.stwmovers.taxi.application.dto.request.TourItineraryItemRequest;
import com.stwmovers.taxi.application.dto.response.TourCarPricingResponse;
import com.stwmovers.taxi.application.dto.response.TourResponse;
import com.stwmovers.taxi.domain.entity.Tour;
import com.stwmovers.taxi.domain.entity.TourItineraryItem;
import com.stwmovers.taxi.domain.repository.BookingRepository;
import com.stwmovers.taxi.domain.repository.TourCarPricingRepository;
import com.stwmovers.taxi.domain.repository.TourRepository;
import com.stwmovers.taxi.exception.ResourceNotFoundException;
import com.stwmovers.taxi.util.EntityMapper;

@Service
public class TourCatalogService {

    private final TourRepository tourRepository;
    private final TourImageStorageService tourImageStorageService;
    private final TourPricingService tourPricingService;
    private final BookingRepository bookingRepository;
    private final TourCarPricingRepository tourCarPricingRepository;

    public TourCatalogService(
            TourRepository tourRepository,
            TourImageStorageService tourImageStorageService,
            TourPricingService tourPricingService,
            BookingRepository bookingRepository,
            TourCarPricingRepository tourCarPricingRepository) {
        this.tourRepository = tourRepository;
        this.tourImageStorageService = tourImageStorageService;
        this.tourPricingService = tourPricingService;
        this.bookingRepository = bookingRepository;
        this.tourCarPricingRepository = tourCarPricingRepository;
    }

    @Transactional(readOnly = true)
    public List<TourResponse> listAllTours() {
        List<Tour> tours = tourRepository.findAll(Sort.by(Sort.Direction.ASC, "displayPriority"));
        if (tours.isEmpty()) {
            return List.of();
        }
        Map<UUID, BigDecimal> startingPrices = tourPricingService.findStartingPrices(
                tours.stream().map(Tour::getId).collect(Collectors.toSet()));
        List<TourResponse> responses = new ArrayList<>();
        for (Tour tour : tours) {
            initializeTourCollections(tour);
            responses.add(EntityMapper.toTourResponse(tour, startingPrices.get(tour.getId()), null));
        }
        return responses;
    }

    @Transactional(readOnly = true)
    public TourResponse getTour(UUID id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found: " + id));
        return toEnrichedResponse(tour, true);
    }

    /** Public catalogue: only tours marked active, ordered the same way as the admin display priority. */
    @Transactional(readOnly = true)
    public List<TourResponse> listActiveTours() {
        List<Tour> tours = tourRepository.findByActiveTrueOrderByDisplayPriorityAsc();
        if (tours.isEmpty()) {
            return List.of();
        }
        Map<UUID, BigDecimal> startingPrices = tourPricingService.findStartingPrices(
                tours.stream().map(Tour::getId).collect(Collectors.toSet()));
        List<TourResponse> responses = new ArrayList<>();
        for (Tour tour : tours) {
            initializeTourCollections(tour);
            responses.add(EntityMapper.toTourResponse(tour, startingPrices.get(tour.getId()), null));
        }
        return responses;
    }

    /** Public detail view: 404s if the tour is missing or has been deactivated. */
    @Transactional(readOnly = true)
    public TourResponse getPublicTour(UUID id) {
        Tour tour = tourRepository.findById(id)
                .filter(Tour::getActive)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found: " + id));
        return toEnrichedResponse(tour, false);
    }

    @Transactional
    public TourResponse createTour(AdminTourRequest request) {
        Tour tour = Tour.builder()
                .title(request.getTitle())
                .location(request.getLocation())
                .durationLabel(request.getDurationLabel())
                .durationHours(request.getDurationHours())
                .guestMin(request.getGuestMin())
                .guestMax(request.getGuestMax())
                .category(request.getCategory())
                .shortDescription(request.getShortDescription())
                .aboutDescription(request.getAboutDescription())
                .imageUrl(request.getImageUrl())
                .active(request.getActive() != null ? request.getActive() : true)
                .displayPriority(request.getDisplayPriority() != null ? request.getDisplayPriority() : 0)
                .highlights(toStringList(request.getHighlights()))
                .included(toStringList(request.getIncluded()))
                .excluded(toStringList(request.getExcluded()))
                .itinerary(toItineraryItems(request.getItinerary()))
                .build();
        return toEnrichedResponse(tourRepository.save(tour), true);
    }

    @Transactional
    public TourResponse updateTour(UUID id, AdminTourRequest request) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found: " + id));
        tour.setTitle(request.getTitle());
        tour.setLocation(request.getLocation());
        tour.setDurationLabel(request.getDurationLabel());
        tour.setDurationHours(request.getDurationHours());
        tour.setGuestMin(request.getGuestMin());
        tour.setGuestMax(request.getGuestMax());
        tour.setCategory(request.getCategory());
        tour.setShortDescription(request.getShortDescription());
        tour.setAboutDescription(request.getAboutDescription());
        tour.setImageUrl(request.getImageUrl());
        if (request.getActive() != null) {
            tour.setActive(request.getActive());
        }
        if (request.getDisplayPriority() != null) {
            tour.setDisplayPriority(request.getDisplayPriority());
        }
        tour.getHighlights().clear();
        tour.getHighlights().addAll(toStringList(request.getHighlights()));
        tour.getIncluded().clear();
        tour.getIncluded().addAll(toStringList(request.getIncluded()));
        tour.getExcluded().clear();
        tour.getExcluded().addAll(toStringList(request.getExcluded()));
        tour.getItinerary().clear();
        tour.getItinerary().addAll(toItineraryItems(request.getItinerary()));
        return toEnrichedResponse(tourRepository.save(tour), true);
    }

    @Transactional
    public TourResponse updateTourImage(UUID id, MultipartFile file) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found: " + id));
        String previousUrl = tour.getImageUrl();
        String imageUrl = tourImageStorageService.store(file);
        tour.setImageUrl(imageUrl);
        Tour saved = tourRepository.save(tour);
        tourImageStorageService.deleteIfStored(previousUrl);
        return toEnrichedResponse(saved, true);
    }

    @Transactional
    public void deleteTour(UUID id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found: " + id));
        bookingRepository.clearTourReference(id);
        tourCarPricingRepository.deleteByTourId(id);
        tourImageStorageService.deleteIfStored(tour.getImageUrl());
        tourRepository.delete(tour);
    }

    private TourResponse toEnrichedResponse(Tour tour, boolean includeCarPrices) {
        initializeTourCollections(tour);
        BigDecimal startingPrice = tourPricingService.findStartingPrice(tour.getId());
        List<TourCarPricingResponse> carPrices = includeCarPrices
                ? tourPricingService.listForTour(tour.getId())
                : null;
        return EntityMapper.toTourResponse(tour, startingPrice, carPrices);
    }

    private static void initializeTourCollections(Tour tour) {
        Hibernate.initialize(tour.getHighlights());
        Hibernate.initialize(tour.getIncluded());
        Hibernate.initialize(tour.getExcluded());
        Hibernate.initialize(tour.getItinerary());
    }

    private static List<String> toStringList(List<String> values) {
        if (values == null) {
            return new ArrayList<>();
        }
        List<String> cleaned = new ArrayList<>();
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                cleaned.add(value.trim());
            }
        }
        return cleaned;
    }

    private static List<TourItineraryItem> toItineraryItems(List<TourItineraryItemRequest> items) {
        List<TourItineraryItem> result = new ArrayList<>();
        if (items == null) {
            return result;
        }
        for (TourItineraryItemRequest item : items) {
            if (item == null || item.getActivity() == null || item.getActivity().isBlank()) {
                continue;
            }
            result.add(TourItineraryItem.builder()
                    .dayNumber(item.getDayNumber() != null ? item.getDayNumber() : 1)
                    .time(item.getTime())
                    .activity(item.getActivity().trim())
                    .build());
        }
        return result;
    }
}
