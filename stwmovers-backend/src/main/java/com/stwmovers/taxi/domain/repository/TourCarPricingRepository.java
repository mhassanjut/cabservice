package com.stwmovers.taxi.domain.repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stwmovers.taxi.domain.entity.TourCarPricing;

public interface TourCarPricingRepository extends JpaRepository<TourCarPricing, UUID> {

    @Query("SELECT p FROM TourCarPricing p JOIN FETCH p.car WHERE p.tour.id = :tourId ORDER BY p.car.displayPriority, p.car.name")
    List<TourCarPricing> findByTourIdWithCar(@Param("tourId") UUID tourId);

    @Query("""
            SELECT p FROM TourCarPricing p
            WHERE p.tour.id = :tourId
              AND p.car.id = :carId
              AND p.active = true
            """)
    Optional<TourCarPricing> findActiveByTourAndCarId(
            @Param("tourId") UUID tourId, @Param("carId") UUID carId);

    @Query("""
            SELECT MIN(p.price) FROM TourCarPricing p
            WHERE p.tour.id = :tourId AND p.active = true
            """)
    Optional<BigDecimal> findMinimumActivePriceByTourId(@Param("tourId") UUID tourId);

    @Query(value = """
            SELECT tcp.tour_id, MIN(tcp.price)
            FROM tour_car_pricing tcp
            WHERE tcp.tour_id IN (:tourIds) AND tcp.active = TRUE
            GROUP BY tcp.tour_id
            """, nativeQuery = true)
    List<Object[]> findMinimumActivePricesByTourIds(@Param("tourIds") Collection<UUID> tourIds);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM TourCarPricing p WHERE p.tour.id = :tourId")
    void deleteByTourId(@Param("tourId") UUID tourId);
}
