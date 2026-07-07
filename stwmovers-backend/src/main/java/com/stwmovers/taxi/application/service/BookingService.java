package com.stwmovers.taxi.application.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.stwmovers.taxi.application.dto.request.CreateBookingRequest;
import com.stwmovers.taxi.application.dto.response.AdminBookingDetailResponse;
import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.application.dto.response.PagedResponse;
import com.stwmovers.taxi.application.port.FareCalculationContext;
import com.stwmovers.taxi.application.service.fare.FareCalculationService;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.entity.Driver;
import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.entity.Payment;
import com.stwmovers.taxi.domain.enums.PaymentStatus;
import com.stwmovers.taxi.domain.repository.BookingRepository;
import com.stwmovers.taxi.domain.repository.CarRepository;
import com.stwmovers.taxi.domain.repository.DriverRepository;
import com.stwmovers.taxi.domain.enums.RideType;
import com.stwmovers.taxi.domain.repository.PaymentRepository;
import com.stwmovers.taxi.domain.repository.UserRepository;
import com.stwmovers.taxi.exception.BadRequestException;
import com.stwmovers.taxi.exception.ResourceNotFoundException;
import com.stwmovers.taxi.exception.UnauthorizedException;
import com.stwmovers.taxi.infrastructure.security.UserPrincipal;
import com.stwmovers.taxi.presentation.specification.BookingSpecification;
import com.stwmovers.taxi.util.BookingReferenceGenerator;
import com.stwmovers.taxi.util.BookingStatusTransitions;
import com.stwmovers.taxi.util.CityNameUtils;
import com.stwmovers.taxi.util.EntityMapper;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final FareCalculationService fareCalculationService;
    private final BookingReferenceGenerator bookingReferenceGenerator;
    private final PaymentRepository paymentRepository;

    public BookingService(
            BookingRepository bookingRepository,
            CarRepository carRepository,
            UserRepository userRepository,
            DriverRepository driverRepository,
            FareCalculationService fareCalculationService,
            BookingReferenceGenerator bookingReferenceGenerator,
            PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.fareCalculationService = fareCalculationService;
        this.bookingReferenceGenerator = bookingReferenceGenerator;
        this.paymentRepository = paymentRepository;
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

        if (!CityNameUtils.isValidPickupCity(
                request.getPickupCity(), request.getPickupLat(), request.getPickupLng())) {
            throw new BadRequestException(
                    "Pickup is only available from Barcelona (including El Prat Airport), Tarragona, or Girona");
        }

        String pickupCity = CityNameUtils.resolvePickupCity(
                request.getPickupCity(), request.getPickupLat(), request.getPickupLng());
        RideType rideType = RideType.STANDARD;

        User currentUser = resolveCurrentUser();
        boolean isGuest = currentUser == null;

        if (isGuest && authorizationHeaderPresent()) {
            throw new UnauthorizedException("Invalid or expired session. Please sign in again.");
        }

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
                    .pickupCity(pickupCity)
                    .destinationCity(request.getDestinationCity())
                    .build();
            calculatedFare = fareCalculationService.calculateFare(car, context);
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
        return assignDriver(bookingId, driverId, false);
    }

    @Transactional
    public BookingResponse assignDriver(UUID bookingId, UUID driverId, boolean force) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        if (!Boolean.TRUE.equals(driver.getActive())) {
            throw new BadRequestException("Driver is inactive");
        }
        long activeForDriver = driverRepository.countActiveBookingsByDriverId(
                driverId,
                List.of(
                        BookingStatus.DRIVER_ASSIGNED,
                        BookingStatus.DRIVER_ACCEPTED,
                        BookingStatus.IN_PROGRESS));
        if (activeForDriver > 0 && !force) {
            throw new BadRequestException(
                    "Driver is already assigned to an active ride. Confirm to proceed anyway.");
        }
        booking.setDriver(driver);
        booking.setStatus(BookingStatus.DRIVER_ASSIGNED);
        return EntityMapper.toBookingResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public PagedResponse<BookingResponse> listAdminBookings(
            BookingStatus status,
            RideType rideType,
            Boolean customRequest,
            String search,
            Instant fromDate,
            Instant toDate,
            String sortBy,
            String sortDir,
            int page,
            int size) {
        PageRequest pageable = PageRequest.of(page, size, resolveAdminBookingSort(sortBy, sortDir));
        Specification<Booking> spec = BookingSpecification.adminFilter(
                status, rideType, customRequest, search, fromDate, toDate);
        Page<Booking> bookings = bookingRepository.findAll(spec, pageable);
        return toPaged(bookings);
    }

    private Sort resolveAdminBookingSort(String sortBy, String sortDir) {
        String property = switch (sortBy != null ? sortBy.trim().toLowerCase() : "") {
            case "scheduledat", "scheduled_at", "date" -> "scheduledAt";
            case "fare", "calculatedfare" -> "calculatedFare";
            case "status" -> "status";
            case "reference", "bookingreference" -> "bookingReference";
            default -> "createdAt";
        };
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return Sort.by(direction, property);
    }

    @Transactional(readOnly = true)
    public AdminBookingDetailResponse getAdminBookingDetail(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        BookingResponse bookingResponse = EntityMapper.toBookingResponse(booking);

        String customerName = booking.getGuestName();
        String customerEmail = booking.getGuestEmail();
        String customerPhone = booking.getGuestPhone();
        if (booking.getUser() != null) {
            if (customerName == null || customerName.isBlank()) {
                customerName = booking.getUser().getFullName();
            }
            if (customerEmail == null || customerEmail.isBlank()) {
                customerEmail = booking.getUser().getEmail();
            }
            if (customerPhone == null || customerPhone.isBlank()) {
                customerPhone = booking.getUser().getPhone();
            }
        }

        String driverName = null;
        if (booking.getDriver() != null) {
            driverName = booking.getDriver().getUser().getFullName();
        }

        PaymentStatus paymentStatus = null;
        String stripeSessionId = null;
        String stripePaymentIntentId = null;
        BigDecimal paymentAmount = null;
        var paymentOpt = paymentRepository.findByBookingId(booking.getId());
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            paymentStatus = payment.getStatus();
            stripeSessionId = payment.getStripeSessionId();
            stripePaymentIntentId = payment.getStripePaymentIntentId();
            paymentAmount = payment.getAmount();
        }

        List<String> allowedNext = BookingStatusTransitions.adminTargetStatuses(booking.getStatus()).stream()
                .map(Enum::name)
                .toList();

        return AdminBookingDetailResponse.builder()
                .booking(bookingResponse)
                .customerName(customerName)
                .customerEmail(customerEmail)
                .customerPhone(customerPhone)
                .driverName(driverName)
                .paymentStatus(paymentStatus)
                .stripeSessionId(stripeSessionId)
                .stripePaymentIntentId(stripePaymentIntentId)
                .paymentAmount(paymentAmount)
                .allowedNextStatuses(allowedNext)
                .build();
    }

    @Transactional
    public BookingResponse updateBookingStatus(UUID bookingId, BookingStatus nextStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        BookingStatusTransitions.assertAdminTransition(booking.getStatus(), nextStatus);
        booking.setStatus(nextStatus);
        return EntityMapper.toBookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse adminCancelBooking(UUID bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.REFUNDED) {
            throw new BadRequestException("Completed or refunded bookings cannot be cancelled");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return EntityMapper.toBookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse setCustomFare(UUID bookingId, BigDecimal fare) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!Boolean.TRUE.equals(booking.getCustomRequest())) {
            throw new BadRequestException("Fare can only be set on custom request bookings");
        }
        booking.setCalculatedFare(fare);
        if (booking.getStatus() == BookingStatus.PAYMENT_PENDING) {
            booking.setStatus(BookingStatus.CONFIRMED);
        }
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

    private boolean authorizationHeaderPresent() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return false;
        }
        String header = attrs.getRequest().getHeader(HttpHeaders.AUTHORIZATION);
        return header != null && header.startsWith("Bearer ");
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
