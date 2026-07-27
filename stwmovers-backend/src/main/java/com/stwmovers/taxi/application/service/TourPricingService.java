package com.stwmovers.taxi.application.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.request.CarRoutePriceRequest;
import com.stwmovers.taxi.application.dto.request.TourPricingBatchRequest;
import com.stwmovers.taxi.application.dto.request.CarFilterRequest;
import com.stwmovers.taxi.application.dto.request.TourCarsRequest;
import com.stwmovers.taxi.application.dto.response.CarWithFareResponse;
import com.stwmovers.taxi.application.dto.response.PagedResponse;
import com.stwmovers.taxi.application.dto.response.TourCarPricingResponse;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.entity.Tour;
import com.stwmovers.taxi.domain.entity.TourCarPricing;
import com.stwmovers.taxi.domain.enums.CarCategory;
import com.stwmovers.taxi.domain.repository.CarRepository;
import com.stwmovers.taxi.domain.repository.TourCarPricingRepository;
import com.stwmovers.taxi.domain.repository.TourRepository;
import com.stwmovers.taxi.exception.BadRequestException;
import com.stwmovers.taxi.exception.ResourceNotFoundException;
import com.stwmovers.taxi.util.EntityMapper;

@Service
public class TourPricingService {

    private final TourRepository tourRepository;
    private final CarRepository carRepository;
    private final TourCarPricingRepository tourCarPricingRepository;

    public TourPricingService(
            TourRepository tourRepository,
            CarRepository carRepository,
            TourCarPricingRepository tourCarPricingRepository) {
        this.tourRepository = tourRepository;
        this.carRepository = carRepository;
        this.tourCarPricingRepository = tourCarPricingRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<CarWithFareResponse> listCarsWithFare(UUID tourId, TourCarsRequest request) {
        requireActiveTour(tourId);
        CarFilterRequest filters = request != null ? request.getFilters() : null;
        int page = request != null && request.getPage() != null ? request.getPage() : 0;
        int size = request != null && request.getSize() != null ? request.getSize() : 20;

        List<CarWithFareResponse> matches = new ArrayList<>();
        for (TourCarPricing pricing : tourCarPricingRepository.findByTourIdWithCar(tourId)) {
            if (!Boolean.TRUE.equals(pricing.getActive())) {
                continue;
            }
            Car car = pricing.getCar();
            if (!Boolean.TRUE.equals(car.getActive()) || !Boolean.TRUE.equals(car.getAvailable())) {
                continue;
            }
            if (!matchesCarFilters(car, pricing.getPrice(), filters)) {
                continue;
            }
            matches.add(EntityMapper.toCarWithFare(car, pricing.getPrice()));
        }

        int total = matches.size();
        int from = Math.min(page * size, total);
        int to = Math.min(from + size, total);
        List<CarWithFareResponse> pageContent = matches.subList(from, to);
        int totalPages = size > 0 ? (int) Math.ceil((double) total / size) : 0;

        return PagedResponse.<CarWithFareResponse>builder()
                .content(pageContent)
                .page(page)
                .size(size)
                .totalElements(total)
                .totalPages(totalPages)
                .build();
    }

    private boolean matchesCarFilters(Car car, BigDecimal tourPrice, CarFilterRequest filters) {
        if (filters == null) {
            return true;
        }
        if (filters.getPassengerCapacity() != null
                && car.getPassengerCapacity() < filters.getPassengerCapacity()) {
            return false;
        }
        if (filters.getCarType() != null && car.getCarType() != filters.getCarType()) {
            return false;
        }
        if (filters.getBodyType() != null && car.getBodyType() != filters.getBodyType()) {
            return false;
        }
        if (filters.getCategory() != null && car.getCategory() != filters.getCategory()) {
            return false;
        }
        if (filters.getElectric() != null && !filters.getElectric().equals(car.getElectric())) {
            return false;
        }
        if (Boolean.TRUE.equals(filters.getLuxury()) && car.getCategory() != CarCategory.LUXURY) {
            return false;
        }
        if (filters.getMinPrice() != null && tourPrice.compareTo(filters.getMinPrice()) < 0) {
            return false;
        }
        if (filters.getMaxPrice() != null && tourPrice.compareTo(filters.getMaxPrice()) > 0) {
            return false;
        }
        return true;
    }

    private Tour requireActiveTour(UUID tourId) {
        return tourRepository.findById(tourId)
                .filter(Tour::getActive)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found: " + tourId));
    }

    @Transactional(readOnly = true)
    public List<TourCarPricingResponse> listForTour(UUID tourId) {
        requireTour(tourId);
        return tourCarPricingRepository.findByTourIdWithCar(tourId).stream()
                .map(EntityMapper::toTourCarPricingResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BigDecimal findStartingPrice(UUID tourId) {
        return tourCarPricingRepository.findMinimumActivePriceByTourId(tourId).orElse(null);
    }

    @Transactional(readOnly = true)
    public Map<UUID, BigDecimal> findStartingPrices(Collection<UUID> tourIds) {
        if (tourIds == null || tourIds.isEmpty()) {
            return Map.of();
        }
        Map<UUID, BigDecimal> prices = new HashMap<>();
        for (Object[] row : tourCarPricingRepository.findMinimumActivePricesByTourIds(tourIds)) {
            prices.put((UUID) row[0], (BigDecimal) row[1]);
        }
        return prices;
    }

    @Transactional
    public List<TourCarPricingResponse> saveBatch(UUID tourId, TourPricingBatchRequest request) {
        Tour tour = requireTour(tourId);
        boolean active = request.getActive() == null || request.getActive();

        List<Car> requiredCars = carRepository.findAll().stream()
                .filter(car -> Boolean.TRUE.equals(car.getActive()))
                .toList();
        if (requiredCars.isEmpty()) {
            throw new BadRequestException("No active vehicles are configured");
        }

        Map<UUID, BigDecimal> pricesByCarId = request.getCarPrices().stream()
                .collect(Collectors.toMap(
                        CarRoutePriceRequest::getCarId,
                        CarRoutePriceRequest::getPrice,
                        (a, b) -> b));

        for (Car car : requiredCars) {
            BigDecimal price = pricesByCarId.get(car.getId());
            if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Price is required for " + car.getName());
            }
        }

        tourCarPricingRepository.deleteByTourId(tourId);

        List<TourCarPricingResponse> saved = new ArrayList<>();
        for (Car car : requiredCars) {
            Car managedCar = carRepository.findById(car.getId()).orElseThrow();
            TourCarPricing pricing = TourCarPricing.builder()
                    .tour(tour)
                    .car(managedCar)
                    .price(pricesByCarId.get(car.getId()).setScale(2, RoundingMode.HALF_UP))
                    .active(active)
                    .build();
            saved.add(EntityMapper.toTourCarPricingResponse(tourCarPricingRepository.save(pricing)));
        }
        return saved;
    }

    private Tour requireTour(UUID tourId) {
        return tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found: " + tourId));
    }
}
