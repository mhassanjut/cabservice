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
import com.stwmovers.taxi.application.dto.response.TourCarPricingResponse;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.entity.Tour;
import com.stwmovers.taxi.domain.entity.TourCarPricing;
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
