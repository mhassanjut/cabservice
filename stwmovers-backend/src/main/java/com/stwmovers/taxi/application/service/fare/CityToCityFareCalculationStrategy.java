package com.stwmovers.taxi.application.service.fare;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Component;

import com.stwmovers.taxi.application.port.FareCalculationContext;
import com.stwmovers.taxi.application.port.FareCalculationStrategy;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.entity.CityRoutePricing;
import com.stwmovers.taxi.domain.enums.RideType;
import com.stwmovers.taxi.domain.repository.CityRoutePricingRepository;
import com.stwmovers.taxi.exception.ResourceNotFoundException;

@Component
public class CityToCityFareCalculationStrategy implements FareCalculationStrategy {

    private static final String BARCELONA = "Barcelona";

    private final CityRoutePricingRepository cityRoutePricingRepository;

    public CityToCityFareCalculationStrategy(CityRoutePricingRepository cityRoutePricingRepository) {
        this.cityRoutePricingRepository = cityRoutePricingRepository;
    }

    @Override
    public RideType supportedRideType() {
        return RideType.CITY_TO_CITY;
    }

    @Override
    public BigDecimal calculateFare(Car car, FareCalculationContext context) {
        String destination = context.getDestinationCity();
        if (destination == null || destination.isBlank()) {
            throw new IllegalArgumentException("destinationCity is required for city-to-city fare calculation");
        }

        CityRoutePricing pricing = cityRoutePricingRepository
                .findByFromCityIgnoreCaseAndToCityIgnoreCaseAndCarTypeAndActiveTrue(
                        BARCELONA, destination.trim(), car.getCarType())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No route pricing found from Barcelona to " + destination + " for " + car.getCarType()));

        return pricing.getPrice().setScale(2, RoundingMode.HALF_UP);
    }
}
