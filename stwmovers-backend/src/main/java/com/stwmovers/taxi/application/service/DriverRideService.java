package com.stwmovers.taxi.application.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.request.DriverRideStatusRequest;
import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.entity.Driver;
import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.enums.RideStatus;
import com.stwmovers.taxi.domain.repository.BookingRepository;
import com.stwmovers.taxi.domain.repository.DriverRepository;
import com.stwmovers.taxi.exception.BadRequestException;
import com.stwmovers.taxi.exception.ResourceNotFoundException;
import com.stwmovers.taxi.infrastructure.security.UserPrincipal;
import com.stwmovers.taxi.util.EntityMapper;

@Service
public class DriverRideService {

    private final BookingRepository bookingRepository;
    private final DriverRepository driverRepository;

    public DriverRideService(BookingRepository bookingRepository, DriverRepository driverRepository) {
        this.bookingRepository = bookingRepository;
        this.driverRepository = driverRepository;
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> listAssignedRides() {
        Driver driver = currentDriver();
        List<BookingStatus> statuses = List.of(
                BookingStatus.DRIVER_ASSIGNED,
                BookingStatus.DRIVER_ACCEPTED,
                BookingStatus.IN_PROGRESS);
        return bookingRepository.findByDriverIdAndStatusIn(driver.getId(), statuses).stream()
                .map(EntityMapper::toBookingResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> listCompletedRides() {
        Driver driver = currentDriver();
        return bookingRepository.findByDriverId(driver.getId(),
                        org.springframework.data.domain.PageRequest.of(0, 100))
                .getContent().stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(EntityMapper::toBookingResponse)
                .toList();
    }

    @Transactional
    public BookingResponse updateRideStatus(UUID bookingId, DriverRideStatusRequest request) {
        Driver driver = currentDriver();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getDriver() == null || !booking.getDriver().getId().equals(driver.getId())) {
            throw new BadRequestException("Booking is not assigned to this driver");
        }

        RideStatus newStatus = request.getRideStatus();
        booking.setRideStatus(newStatus);

        switch (newStatus) {
            case ACCEPTED -> booking.setStatus(BookingStatus.DRIVER_ACCEPTED);
            case DRIVER_EN_ROUTE, DRIVER_ARRIVED, RIDE_STARTED -> booking.setStatus(BookingStatus.IN_PROGRESS);
            case RIDE_COMPLETED -> booking.setStatus(BookingStatus.COMPLETED);
            case CANCELLED -> booking.setStatus(BookingStatus.CANCELLED);
            default -> {
            }
        }

        return EntityMapper.toBookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse acceptRide(UUID bookingId) {
        DriverRideStatusRequest request = new DriverRideStatusRequest();
        request.setRideStatus(RideStatus.ACCEPTED);
        return updateRideStatus(bookingId, request);
    }

    @Transactional
    public BookingResponse rejectRide(UUID bookingId) {
        Driver driver = currentDriver();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (booking.getDriver() == null || !booking.getDriver().getId().equals(driver.getId())) {
            throw new BadRequestException("Booking is not assigned to this driver");
        }
        booking.setDriver(null);
        booking.setRideStatus(RideStatus.CANCELLED);
        booking.setStatus(BookingStatus.CONFIRMED);
        return EntityMapper.toBookingResponse(bookingRepository.save(booking));
    }

    private Driver currentDriver() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return driverRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new BadRequestException("Driver profile not found"));
    }
}
