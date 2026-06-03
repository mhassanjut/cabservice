package com.stwmovers.taxi.application.service;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.request.CreateBookingRequest;
import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.application.dto.response.PagedResponse;
import com.stwmovers.taxi.application.port.FareCalculationContext;
import com.stwmovers.taxi.application.service.fare.FareCalculationService;
import com.stwmovers.taxi.application.service.fare.RideTypeService;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.entity.Driver;
import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.enums.RideType;
import com.stwmovers.taxi.domain.repository.BookingRepository;
import com.stwmovers.taxi.domain.repository.CarRepository;
import com.stwmovers.taxi.domain.repository.DriverRepository;
import com.stwmovers.taxi.domain.repository.UserRepository;
import com.stwmovers.taxi.exception.BadRequestException;
import com.stwmovers.taxi.exception.ResourceNotFoundException;
import com.stwmovers.taxi.infrastructure.security.UserPrincipal;
import com.stwmovers.taxi.util.BookingReferenceGenerator;
import com.stwmovers.taxi.util.EntityMapper;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final FareCalculationService fareCalculationService;
    private final RideTypeService rideTypeService;
    private final BookingReferenceGenerator bookingReferenceGenerator;

    public BookingService(
            BookingRepository bookingRepository,
            CarRepository carRepository,
            UserRepository userRepository,
            DriverRepository driverRepository,
            FareCalculationService fareCalculationService,
            RideTypeService rideTypeService,
            BookingReferenceGenerator bookingReferenceGenerator) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.fareCalculationService = fareCalculationService;
        this.rideTypeService = rideTypeService;
        this.bookingReferenceGenerator = bookingReferenceGenerator;
    }

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        boolean otherCar = Boolean.TRUE.equals(request.getOtherCar());
        if (!otherCar && request.getCarId() == null) {
            throw new BadRequestException("carId is required unless otherCar is true");
        }
        if (otherCar && request.getCarId() != null) {
            throw new BadRequestException("carId must be null when otherCar is true");
        }

        RideType rideType = rideTypeService.resolveRideType(
                request.getRideType(),
                request.getPickupLat(),
                request.getPickupLng(),
                request.getDropoffLat(),
                request.getDropoffLng());

        User currentUser = resolveCurrentUser();
        boolean isGuest = currentUser == null;

        if (isGuest) {
            if (request.getGuestEmail() == null || request.getGuestEmail().isBlank()) {
                throw new BadRequestException("guestEmail is required for guest bookings");
            }
            if (request.getGuestName() == null || request.getGuestName().isBlank()) {
                throw new BadRequestException("guestName is required for guest bookings");
            }
        }

        Car car = null;
        BigDecimal calculatedFare = null;
        boolean customRequest = otherCar;

        if (!otherCar) {
            car = carRepository.findById(request.getCarId())
                    .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
            FareCalculationContext context = FareCalculationContext.builder()
                    .distanceKm(request.getDistanceKm())
                    .destinationCity(request.getDestinationCity())
                    .build();
            calculatedFare = fareCalculationService.calculateFare(car, rideType, context);
        }

        BookingStatus initialStatus = isGuest ? BookingStatus.OTP_PENDING : BookingStatus.PAYMENT_PENDING;

        Booking booking = Booking.builder()
                .bookingReference(bookingReferenceGenerator.generate())
                .user(currentUser)
                .guestName(request.getGuestName())
                .guestEmail(request.getGuestEmail())
                .guestPhone(request.getGuestPhone())
                .car(car)
                .customRequest(customRequest)
                .status(initialStatus)
                .rideType(rideType)
                .pickupAddress(request.getPickupAddress())
                .dropoffAddress(request.getDropoffAddress())
                .pickupLat(request.getPickupLat())
                .pickupLng(request.getPickupLng())
                .dropoffLat(request.getDropoffLat())
                .dropoffLng(request.getDropoffLng())
                .distanceKm(request.getDistanceKm())
                .passengerCount(request.getPassengerCount())
                .scheduledAt(request.getScheduledAt())
                .calculatedFare(calculatedFare)
                .destinationCity(request.getDestinationCity())
                .build();

        return EntityMapper.toBookingResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public BookingResponse getByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + reference));
        return EntityMapper.toBookingResponse(booking);
    }

    @Transactional(readOnly = true)
    public PagedResponse<BookingResponse> listBookings(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Booking> bookings = bookingRepository.findAll(pageable);
        return toPaged(bookings);
    }

    @Transactional(readOnly = true)
    public PagedResponse<BookingResponse> listMyBookings(int page, int size) {
        UserPrincipal principal = currentPrincipal();
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Booking> bookings = bookingRepository.findByUserId(principal.getId(), pageable);
        return toPaged(bookings);
    }

    @Transactional
    public BookingResponse assignDriver(UUID bookingId, UUID driverId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        booking.setDriver(driver);
        booking.setStatus(BookingStatus.DRIVER_ASSIGNED);
        return EntityMapper.toBookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse markOtpVerified(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (booking.getStatus() != BookingStatus.OTP_PENDING) {
            throw new BadRequestException("Booking is not awaiting OTP verification");
        }
        booking.setStatus(BookingStatus.PAYMENT_PENDING);
        return EntityMapper.toBookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse confirmPayment(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.CONFIRMED);
        return EntityMapper.toBookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse cancelBooking(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.CANCELLED);
        return EntityMapper.toBookingResponse(bookingRepository.save(booking));
    }

    private User resolveCurrentUser() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return null;
        }
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal userPrincipal) {
            return userRepository.findById(userPrincipal.getId()).orElse(null);
        }
        return null;
    }

    private UserPrincipal currentPrincipal() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal userPrincipal) {
            return userPrincipal;
        }
        throw new BadRequestException("Authentication required");
    }

    private PagedResponse<BookingResponse> toPaged(Page<Booking> page) {
        return PagedResponse.<BookingResponse>builder()
                .content(page.getContent().stream().map(EntityMapper::toBookingResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }
}
