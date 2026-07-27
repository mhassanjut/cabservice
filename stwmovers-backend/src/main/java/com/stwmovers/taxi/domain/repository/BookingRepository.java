package com.stwmovers.taxi.domain.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.enums.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, UUID>, JpaSpecificationExecutor<Booking> {

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

    long countByUser_IdAndStatus(UUID userId, BookingStatus status);

    Optional<Booking> findFirstByUser_IdAndStatusInOrderByScheduledAtAsc(UUID userId, List<BookingStatus> statuses);

    Optional<Booking> findFirstByUser_IdAndStatusInOrderByUpdatedAtDesc(UUID userId, List<BookingStatus> statuses);

    @Query("SELECT COALESCE(SUM(b.calculatedFare), 0) FROM Booking b WHERE b.user.id = :userId AND b.status = com.stwmovers.taxi.domain.enums.BookingStatus.COMPLETED")
    java.math.BigDecimal sumCompletedFareByUserId(@Param("userId") UUID userId);

    @Query("SELECT COALESCE(SUM(b.calculatedFare), 0) FROM Booking b WHERE b.status = com.stwmovers.taxi.domain.enums.BookingStatus.COMPLETED AND b.updatedAt >= :since")
    java.math.BigDecimal sumCompletedRevenueSince(@Param("since") Instant since);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = com.stwmovers.taxi.domain.enums.BookingStatus.IN_PROGRESS")
    long countInProgressRides();

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Booking b SET b.tour = null WHERE b.tour.id = :tourId")
    void clearTourReference(@Param("tourId") UUID tourId);
}
