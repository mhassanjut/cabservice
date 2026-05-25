package com.stwmovers.taxi.application.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.request.AdminDriverRequest;
import com.stwmovers.taxi.application.dto.request.CityRoutePricingRequest;
import com.stwmovers.taxi.application.dto.request.CreateDriverUserRequest;
import com.stwmovers.taxi.application.dto.response.CityRoutePricingResponse;
import com.stwmovers.taxi.application.dto.response.DashboardStatsResponse;
import com.stwmovers.taxi.application.dto.response.DriverResponse;
import com.stwmovers.taxi.domain.entity.CityRoutePricing;
import com.stwmovers.taxi.domain.entity.Driver;
import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.enums.PaymentStatus;
import com.stwmovers.taxi.domain.enums.Role;
import com.stwmovers.taxi.domain.repository.BookingRepository;
import com.stwmovers.taxi.domain.repository.CityRoutePricingRepository;
import com.stwmovers.taxi.domain.repository.DriverRepository;
import com.stwmovers.taxi.domain.repository.PaymentRepository;
import com.stwmovers.taxi.domain.repository.UserRepository;
import com.stwmovers.taxi.exception.BadRequestException;
import com.stwmovers.taxi.exception.ResourceNotFoundException;
import com.stwmovers.taxi.util.EntityMapper;

@Service
public class AdminDashboardService {

    private final BookingRepository bookingRepository;
    private final DriverRepository driverRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CityRoutePricingRepository cityRoutePricingRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminDashboardService(
            BookingRepository bookingRepository,
            DriverRepository driverRepository,
            PaymentRepository paymentRepository,
            UserRepository userRepository,
            CityRoutePricingRepository cityRoutePricingRepository,
            PasswordEncoder passwordEncoder) {
        this.bookingRepository = bookingRepository;
        this.driverRepository = driverRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.cityRoutePricingRepository = cityRoutePricingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        List<BookingStatus> activeStatuses = List.of(
                BookingStatus.CONFIRMED,
                BookingStatus.DRIVER_ASSIGNED,
                BookingStatus.DRIVER_ACCEPTED,
                BookingStatus.IN_PROGRESS,
                BookingStatus.PAYMENT_PENDING);

        BigDecimal revenue = bookingRepository.sumCompletedRevenue();
        if (revenue == null) {
            revenue = BigDecimal.ZERO;
        }

        return DashboardStatsResponse.builder()
                .totalRides(bookingRepository.countByStatus(BookingStatus.COMPLETED))
                .totalRevenue(revenue)
                .activeDrivers(driverRepository.countActiveDrivers())
                .activeBookings(bookingRepository.countByStatusIn(activeStatuses))
                .failedPayments(paymentRepository.countByStatus(PaymentStatus.FAILED))
                .pendingCustomRequests(
                        bookingRepository.countByCustomRequestTrueAndStatus(BookingStatus.PAYMENT_PENDING))
                .build();
    }

    @Transactional(readOnly = true)
    public List<DriverResponse> listDrivers() {
        return driverRepository.findAll().stream()
                .map(EntityMapper::toDriverResponse)
                .toList();
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
        return EntityMapper.toDriverResponse(driverRepository.save(driver));
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
        return EntityMapper.toDriverResponse(driverRepository.save(driver));
    }

    @Transactional
    public CityRoutePricingResponse createRoutePricing(CityRoutePricingRequest request) {
        CityRoutePricing pricing = CityRoutePricing.builder()
                .fromCity(request.getFromCity())
                .toCity(request.getToCity())
                .carType(request.getCarType())
                .price(request.getPrice())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();
        return EntityMapper.toCityRoutePricingResponse(cityRoutePricingRepository.save(pricing));
    }

    @Transactional(readOnly = true)
    public List<CityRoutePricingResponse> listRoutePricing() {
        return cityRoutePricingRepository.findAll().stream()
                .map(EntityMapper::toCityRoutePricingResponse)
                .toList();
    }
}
