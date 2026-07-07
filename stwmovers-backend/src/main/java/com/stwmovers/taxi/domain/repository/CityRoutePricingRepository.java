package com.stwmovers.taxi.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stwmovers.taxi.domain.entity.CityRoutePricing;

public interface CityRoutePricingRepository extends JpaRepository<CityRoutePricing, UUID> {

    @Query("SELECT p FROM CityRoutePricing p JOIN FETCH p.car ORDER BY p.fromCity, p.toCity, p.car.name")
    List<CityRoutePricing> findAllWithCar();

    @Query("""
            SELECT p FROM CityRoutePricing p JOIN FETCH p.car
            WHERE lower(trim(p.fromCity)) = lower(trim(:fromCity))
              AND lower(trim(p.toCity)) = lower(trim(:toCity))
            """)
    List<CityRoutePricing> findByRouteIgnoreCase(
            @Param("fromCity") String fromCity, @Param("toCity") String toCity);

    @Query("""
            SELECT p FROM CityRoutePricing p
            WHERE lower(trim(p.fromCity)) = lower(trim(:fromCity))
              AND lower(trim(p.toCity)) = lower(trim(:toCity))
              AND p.car.id = :carId
              AND p.active = true
            """)
    Optional<CityRoutePricing> findActiveByRouteAndCarId(
            @Param("fromCity") String fromCity,
            @Param("toCity") String toCity,
            @Param("carId") UUID carId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            DELETE FROM CityRoutePricing p
            WHERE lower(trim(p.fromCity)) = lower(trim(:fromCity))
              AND lower(trim(p.toCity)) = lower(trim(:toCity))
            """)
    void deleteByRouteIgnoreCase(@Param("fromCity") String fromCity, @Param("toCity") String toCity);
}
