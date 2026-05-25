package com.stwmovers.taxi.domain.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stwmovers.taxi.domain.entity.CityRoutePricing;
import com.stwmovers.taxi.domain.enums.CarType;

public interface CityRoutePricingRepository extends JpaRepository<CityRoutePricing, UUID> {

    Optional<CityRoutePricing> findByFromCityIgnoreCaseAndToCityIgnoreCaseAndCarTypeAndActiveTrue(
            String fromCity, String toCity, CarType carType);
}
