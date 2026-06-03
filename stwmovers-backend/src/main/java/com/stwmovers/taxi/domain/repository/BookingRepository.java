package com.stwmovers.taxi.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.enums.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Optional<Booking> findByBookingReference(String bookingReference);

    Page<Booking> findByUserId(UUID userId, Pageable pageable);

    Page<Booking> findByDriverId(UUID driverId, Pageable pageable);

    List<Booking> findByDriverIdAndStatusIn(UUID driverId, List<BookingStatus> statuses);

    long countByStatus(BookingStatus status);

    long countByCustomRequestTrueAndStatus(BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status IN :statuses")
    long countByStatusIn(@Param("statuses") List<BookingStatus> statuses);

    @Query("SELECT COALESCE(SUM(b.calculatedFare), 0) FROM Booking b WHERE b.status = com.stwmovers.taxi.domain.enums.BookingStatus.COMPLETED")
    java.math.BigDecimal sumCompletedRevenue();
}
