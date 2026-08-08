package com.stwmovers.taxi.application.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.request.AddDestinationCityRequest;
import com.stwmovers.taxi.application.dto.request.AdminDriverRequest;
import com.stwmovers.taxi.application.dto.request.CarRoutePriceRequest;
import com.stwmovers.taxi.application.dto.request.CityRoutePricingRequest;
import com.stwmovers.taxi.application.dto.request.CreateDriverUserRequest;
import com.stwmovers.taxi.application.dto.request.RoutePricingBatchRequest;
import com.stwmovers.taxi.application.dto.request.UpdateDriverRequest;
import com.stwmovers.taxi.application.dto.request.UpdateFareSettingsRequest;
import com.stwmovers.taxi.application.dto.response.AdminSettingsResponse;
import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.application.dto.response.CityListResponse;
import com.stwmovers.taxi.application.dto.response.CityRoutePricingResponse;
import com.stwmovers.taxi.application.dto.response.DashboardStatsResponse;
import com.stwmovers.taxi.application.dto.response.DestinationCityResponse;
import com.stwmovers.taxi.application.dto.response.DriverResponse;
import com.stwmovers.taxi.application.dto.response.PickupCityResponse;
import com.stwmovers.taxi.application.dto.response.PagedResponse;
import com.stwmovers.taxi.application.dto.response.PaymentResponse;

import java.util.Map;
import java.util.stream.Collectors;

import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.entity.CityRoutePricing;
import com.stwmovers.taxi.domain.entity.DestinationCity;
import com.stwmovers.taxi.domain.entity.Driver;
import com.stwmovers.taxi.domain.entity.PickupCity;
import com.stwmovers.taxi.domain.entity.Payment;
import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.enums.PaymentStatus;
import com.stwmovers.taxi.domain.enums.Role;
import com.stwmovers.taxi.domain.repository.BookingRepository;
import com.stwmovers.taxi.domain.repository.CarRepository;
import com.stwmovers.taxi.domain.repository.CityRoutePricingRepository;
import com.stwmovers.taxi.domain.repository.DestinationCityRepository;
import com.stwmovers.taxi.domain.repository.PickupCityRepository;
import com.stwmovers.taxi.domain.repository.DriverRepository;
import com.stwmovers.taxi.domain.repository.PaymentRepository;
import com.stwmovers.taxi.domain.repository.UserRepository;
import com.stwmovers.taxi.exception.BadRequestException;
import com.stwmovers.taxi.exception.ResourceNotFoundException;
import com.stwmovers.taxi.util.CityNameUtils;
import com.stwmovers.taxi.util.EntityMapper;

@Service
public class AdminDashboardService {

    private static final List<BookingStatus> ACTIVE_BOOKING_STATUSES = List.of(
            BookingStatus.CONFIRMED,
            BookingStatus.DRIVER_ASSIGNED,
            BookingStatus.DRIVER_ACCEPTED,
            BookingStatus.IN_PROGRESS,
            BookingStatus.PAYMENT_PENDING);

    private static final List<BookingStatus> DRIVER_BUSY_STATUSES = List.of(
            BookingStatus.DRIVER_ASSIGNED,
            BookingStatus.DRIVER_ACCEPTED,
            BookingStatus.IN_PROGRESS);

    private final BookingRepository bookingRepository;
    private final DriverRepository driverRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CityRoutePricingRepository cityRoutePricingRepository;
    private final DestinationCityRepository destinationCityRepository;
    private final PickupCityRepository pickupCityRepository;
    private final CarRepository carRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppProperties appProperties;
    private final FareSettingsService fareSettingsService;

    public AdminDashboardService(
            BookingRepository bookingRepository,
            DriverRepository driverRepository,
            PaymentRepository paymentRepository,
            UserRepository userRepository,
            CityRoutePricingRepository cityRoutePricingRepository,
            DestinationCityRepository destinationCityRepository,
            PickupCityRepository pickupCityRepository,
            CarRepository carRepository,
            PasswordEncoder passwordEncoder,
            AppProperties appProperties,
            FareSettingsService fareSettingsService) {
        this.bookingRepository = bookingRepository;
        this.driverRepository = driverRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.cityRoutePricingRepository = cityRoutePricingRepository;
        this.destinationCityRepository = destinationCityRepository;
        this.pickupCityRepository = pickupCityRepository;
        this.carRepository = carRepository;
        this.passwordEncoder = passwordEncoder;
        this.appProperties = appProperties;
        this.fareSettingsService = fareSettingsService;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        ZonedDateTime now = ZonedDateTime.now(ZoneOffset.UTC);
        Instant startOfDay = now.toLocalDate().atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant startOfMonth = now.withDayOfMonth(1).toLocalDate().atStartOfDay(ZoneOffset.UTC).toInstant();

        BigDecimal revenue = bookingRepository.sumCompletedRevenue();
        if (revenue == null) {
            revenue = BigDecimal.ZERO;
        }
        BigDecimal revenueToday = bookingRepository.sumCompletedRevenueSince(startOfDay);
        if (revenueToday == null) {
            revenueToday = BigDecimal.ZERO;
        }
        BigDecimal revenueMonth = bookingRepository.sumCompletedRevenueSince(startOfMonth);
        if (revenueMonth == null) {
            revenueMonth = BigDecimal.ZERO;
        }

        List<BookingResponse> recent = bookingRepository
                .findAll(PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent()
                .stream()
                .map(EntityMapper::toBookingResponse)
                .toList();

        return DashboardStatsResponse.builder()
                .totalRides(bookingRepository.countByStatus(BookingStatus.COMPLETED))
                .activeRides(bookingRepository.countInProgressRides())
                .totalRevenue(revenue)
                .revenueToday(revenueToday)
                .revenueThisMonth(revenueMonth)
                .activeDrivers(driverRepository.countActiveDrivers())
                .activeBookings(bookingRepository.countByStatusIn(ACTIVE_BOOKING_STATUSES))
                .failedPayments(paymentRepository.countByStatus(PaymentStatus.FAILED))
                .pendingCustomRequests(
                        bookingRepository.countByCustomRequestTrueAndStatus(BookingStatus.PAYMENT_PENDING))
                .recentBookings(recent)
                .build();
    }

    @Transactional(readOnly = true)
    public List<DriverResponse> listDrivers() {
        return driverRepository.findAll().stream()
                .map(this::toDriverResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DriverResponse getDriver(UUID id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        return toDriverResponse(driver);
    }

    @Transactional
    public DriverResponse createDriver(CreateDriverUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email already exists");
        }
        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(Role.DRIVER)
                .active(true)
                .build();
        userRepository.save(user);

        Driver driver = Driver.builder()
                .user(user)
                .licenseNumber(request.getLicenseNumber())
                .active(true)
                .build();
        return toDriverResponse(driverRepository.save(driver));
    }

    @Transactional
    public DriverResponse updateDriver(UUID id, UpdateDriverRequest request) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        User user = driver.getUser();
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        userRepository.save(user);
        driver.setLicenseNumber(request.getLicenseNumber());
        if (request.getActive() != null) {
            driver.setActive(request.getActive());
        }
        return toDriverResponse(driverRepository.save(driver));
    }

    @Transactional
    public DriverResponse linkDriver(AdminDriverRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(Role.DRIVER);
        userRepository.save(user);

        Driver driver = driverRepository.findByUserId(user.getId()).orElseGet(() -> Driver.builder()
                .user(user)
                .licenseNumber(request.getLicenseNumber())
                .build());
        driver.setLicenseNumber(request.getLicenseNumber());
        if (request.getActive() != null) {
            driver.setActive(request.getActive());
        }
        return toDriverResponse(driverRepository.save(driver));
    }

    @Transactional
    public List<CityRoutePricingResponse> saveRoutePricingBatch(RoutePricingBatchRequest request) {
        String fromCity = requireActivePickupCity(request.getFromCity());
        String toCity = requireDestinationCity(request.getToCity());
        boolean active = request.getActive() == null || request.getActive();

        List<Car> requiredCars = carRepository.findAll().stream()
                .filter(car -> Boolean.TRUE.equals(car.getActive()))
                .toList();
        if (requiredCars.isEmpty()) {
            throw new BadRequestException("No active vehicles are configured");
        }

        Map<UUID, BigDecimal> pricesByCarId = request.getCarPrices().stream()
                .collect(Collectors.toMap(CarRoutePriceRequest::getCarId, CarRoutePriceRequest::getPrice, (a, b) -> b));

        for (Car car : requiredCars) {
            BigDecimal price = pricesByCarId.get(car.getId());
            if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Price is required for " + car.getName());
            }
        }

        cityRoutePricingRepository.deleteByRouteIgnoreCase(fromCity, toCity);

        List<CityRoutePricingResponse> saved = new ArrayList<>();
        for (Car car : requiredCars) {
            Car managedCar = carRepository.findById(car.getId()).orElseThrow();
            CityRoutePricing pricing = CityRoutePricing.builder()
                    .fromCity(fromCity)
                    .toCity(toCity)
                    .car(managedCar)
                    .price(pricesByCarId.get(car.getId()).setScale(2, RoundingMode.HALF_UP))
                    .active(active)
                    .build();
            saved.add(EntityMapper.toCityRoutePricingResponse(cityRoutePricingRepository.save(pricing)));
        }
        return saved;
    }

    @Transactional
    public CityRoutePricingResponse createRoutePricing(CityRoutePricingRequest request) {
        String fromCity = requireActivePickupCity(request.getFromCity());
        String toCity = requireDestinationCity(request.getToCity());
        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        CityRoutePricing pricing = CityRoutePricing.builder()
                .fromCity(fromCity)
                .toCity(toCity)
                .car(car)
                .price(request.getPrice())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();
        return EntityMapper.toCityRoutePricingResponse(cityRoutePricingRepository.save(pricing));
    }

    @Transactional
    public CityRoutePricingResponse updateRoutePricing(UUID id, CityRoutePricingRequest request) {
        CityRoutePricing pricing = cityRoutePricingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route pricing not found"));
        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        pricing.setFromCity(requireActivePickupCity(request.getFromCity()));
        pricing.setToCity(requireDestinationCity(request.getToCity()));
        pricing.setCar(car);
        pricing.setPrice(request.getPrice());
        if (request.getActive() != null) {
            pricing.setActive(request.getActive());
        }
        return EntityMapper.toCityRoutePricingResponse(cityRoutePricingRepository.save(pricing));
    }

    @Transactional
    public void deleteRoutePricing(UUID id) {
        CityRoutePricing pricing = cityRoutePricingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route pricing not found"));
        cityRoutePricingRepository.delete(pricing);
    }

    @Transactional
    public void deleteRoutePricingByRoute(String fromCity, String toCity) {
        cityRoutePricingRepository.deleteByRouteIgnoreCase(fromCity.trim(), toCity.trim());
    }

    @Transactional(readOnly = true)
    public List<CityRoutePricingResponse> listRoutePricing() {
        return cityRoutePricingRepository.findAllWithCar().stream()
                .map(EntityMapper::toCityRoutePricingResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CityRoutePricingResponse> listRoutePricingForRoute(String fromCity, String toCity) {
        return cityRoutePricingRepository
                .findByRouteIgnoreCase(fromCity.trim(), toCity.trim())
                .stream()
                .map(EntityMapper::toCityRoutePricingResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PickupCityResponse> listPickupCities() {
        return pickupCityRepository.findAllByActiveTrueOrderByNameAsc().stream()
                .map(this::toPickupCityResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PickupCityResponse> listAllPickupCities() {
        return pickupCityRepository.findAllByOrderByNameAsc().stream()
                .map(this::toPickupCityResponse)
                .toList();
    }

    @Transactional
    public PickupCityResponse addPickupCity(AddDestinationCityRequest request) {
        String name = CityNameUtils.normalize(request.getName());
        if (name == null || name.isBlank()) {
            throw new BadRequestException("City name is required");
        }
        if (pickupCityRepository.findByNameIgnoreCase(name).isPresent()) {
            throw new BadRequestException("Pickup city already exists");
        }
        PickupCity saved = pickupCityRepository.save(PickupCity.builder()
                .name(name)
                .active(false)
                .build());
        return toPickupCityResponse(saved);
    }

    @Transactional
    public PickupCityResponse updatePickupCity(UUID id, boolean active) {
        PickupCity city = pickupCityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup city not found"));
        city.setActive(active);
        return toPickupCityResponse(pickupCityRepository.save(city));
    }

    @Transactional
    public void deletePickupCity(UUID id) {
        PickupCity city = pickupCityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup city not found"));
        pickupCityRepository.delete(city);
    }

    @Transactional(readOnly = true)
    public List<DestinationCityResponse> listDestinationCities() {
        return destinationCityRepository.findAllByOrderByNameAsc().stream()
                .map(this::toDestinationCityResponse)
                .toList();
    }

    @Transactional
    public DestinationCityResponse addDestinationCity(AddDestinationCityRequest request) {
        String name = CityNameUtils.normalize(request.getName());
        if (name == null || name.isBlank()) {
            throw new BadRequestException("City name is required");
        }
        var existing = destinationCityRepository.findByNameIgnoreCase(name);
        if (existing.isPresent()) {
            DestinationCity city = existing.get();
            if (Boolean.TRUE.equals(city.getActive())) {
                throw new BadRequestException("Destination city already exists");
            }
            city.setActive(true);
            return toDestinationCityResponse(destinationCityRepository.save(city));
        }

        DestinationCity saved = destinationCityRepository.save(DestinationCity.builder()
                .name(name)
                .active(true)
                .build());
        return toDestinationCityResponse(saved);
    }

    @Transactional
    public void deleteDestinationCity(UUID id) {
        DestinationCity city = destinationCityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination city not found"));
        destinationCityRepository.delete(city);
    }

    @Transactional(readOnly = true)
    public CityListResponse listCities() {
        Set<String> cities = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        cities.addAll(pickupCityRepository.findAllByActiveTrueOrderByNameAsc().stream().map(PickupCity::getName).toList());
        destinationCityRepository.findAllByActiveTrueOrderByNameAsc()
                .forEach(city -> cities.add(city.getName()));
        for (CityRoutePricing pricing : cityRoutePricingRepository.findAll()) {
            cities.add(pricing.getFromCity());
            cities.add(pricing.getToCity());
        }
        return CityListResponse.builder().cities(new ArrayList<>(cities)).build();
    }

    private String requireActivePickupCity(String city) {
        String normalized = CityNameUtils.normalize(city);
        if (normalized == null) {
            throw new BadRequestException("fromCity is required");
        }
        PickupCity pickupCity = pickupCityRepository.findByNameIgnoreCaseAndActiveTrue(normalized)
                .orElseThrow(() -> new BadRequestException("Pickup city is not active: " + normalized));
        return pickupCity.getName();
    }

    private PickupCityResponse toPickupCityResponse(PickupCity city) {
        return PickupCityResponse.builder()
                .id(city.getId())
                .name(city.getName())
                .active(city.getActive())
                .build();
    }

    private DestinationCityResponse toDestinationCityResponse(DestinationCity city) {
        return DestinationCityResponse.builder()
                .id(city.getId())
                .name(city.getName())
                .active(city.getActive())
                .build();
    }

    private String requireDestinationCity(String city) {
        String normalized = CityNameUtils.normalize(city);
        if (normalized == null || normalized.isBlank()) {
            throw new BadRequestException("toCity is required");
        }
        DestinationCity destination = destinationCityRepository.findByNameIgnoreCase(normalized)
                .filter(dest -> Boolean.TRUE.equals(dest.getActive()))
                .orElseThrow(() -> new BadRequestException("Unknown destination city: " + normalized));
        return destination.getName();
    }

    @Transactional(readOnly = true)
    public PagedResponse<PaymentResponse> listPayments(PaymentStatus status, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        var paymentPage = status != null
                ? paymentRepository.findByStatus(status, pageable)
                : paymentRepository.findAll(pageable);
        return PagedResponse.<PaymentResponse>builder()
                .content(paymentPage.getContent().stream().map(EntityMapper::toPaymentResponse).toList())
                .page(paymentPage.getNumber())
                .size(paymentPage.getSize())
                .totalElements(paymentPage.getTotalElements())
                .totalPages(paymentPage.getTotalPages())
                .build();
    }

    @Transactional
    public PaymentResponse refundPayment(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new BadRequestException("Only successful payments can be refunded");
        }
        payment.setStatus(PaymentStatus.REFUNDED);
        paymentRepository.save(payment);
        var booking = payment.getBooking();
        booking.setStatus(BookingStatus.REFUNDED);
        bookingRepository.save(booking);
        return EntityMapper.toPaymentResponse(payment);
    }

    @Transactional(readOnly = true)
    public AdminSettingsResponse getSettings() {
        return AdminSettingsResponse.builder()
                .inCityBaseKm(fareSettingsService.getInCityBaseKm())
                .inCityExtraEurPerKm(fareSettingsService.getInCityExtraEurPerKm())
                .adminEmail(appProperties.getAdmin().getEmail())
                .build();
    }

    @Transactional
    public AdminSettingsResponse updateFareSettings(UpdateFareSettingsRequest request) {
        fareSettingsService.updateSettings(request);
        return getSettings();
    }

    public boolean isDriverBusy(UUID driverId) {
        return driverRepository.countActiveBookingsByDriverId(driverId, DRIVER_BUSY_STATUSES) > 0;
    }

    private DriverResponse toDriverResponse(Driver driver) {
        long activeCount = driverRepository.countActiveBookingsByDriverId(driver.getId(), DRIVER_BUSY_STATUSES);
        return DriverResponse.builder()
                .id(driver.getId())
                .userId(driver.getUser().getId())
                .email(driver.getUser().getEmail())
                .fullName(driver.getUser().getFullName())
                .phone(driver.getUser().getPhone())
                .licenseNumber(driver.getLicenseNumber())
                .active(driver.getActive())
                .activeRidesCount(activeCount)
                .onRide(activeCount > 0)
                .createdAt(driver.getCreatedAt())
                .build();
    }
}
