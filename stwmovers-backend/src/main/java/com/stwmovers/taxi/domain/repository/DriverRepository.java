package com.stwmovers.taxi.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stwmovers.taxi.domain.entity.Driver;
import com.stwmovers.taxi.domain.enums.BookingStatus;

public interface DriverRepository extends JpaRepository<Driver, UUID> {

    Optional<Driver> findByUserId(UUID userId);

    List<Driver> findByActiveTrue();

    @Query("SELECT COUNT(d) FROM Driver d WHERE d.active = true")
    long countActiveDrivers();

    @Query(
            """
            SELECT COUNT(b) FROM Booking b
            WHERE b.driver.id = :driverId
              AND b.status IN :statuses
            """)
    long countActiveBookingsByDriverId(
            @Param("driverId") UUID driverId, @Param("statuses") List<BookingStatus> statuses);
}
