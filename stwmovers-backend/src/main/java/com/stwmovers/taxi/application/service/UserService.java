package com.stwmovers.taxi.application.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.request.UpdateUserProfileRequest;
import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.application.dto.response.CustomerStatsResponse;
import com.stwmovers.taxi.application.dto.response.UserProfileResponse;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.repository.BookingRepository;
import com.stwmovers.taxi.domain.repository.UserRepository;
import com.stwmovers.taxi.exception.ResourceNotFoundException;
import com.stwmovers.taxi.infrastructure.security.UserPrincipal;
import com.stwmovers.taxi.util.EntityMapper;

@Service
public class UserService {

    private static final List<BookingStatus> UPCOMING_STATUSES = List.of(
            BookingStatus.PAYMENT_PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.DRIVER_ASSIGNED,
            BookingStatus.DRIVER_ACCEPTED);

    private static final List<BookingStatus> ACTIVE_RIDE_STATUSES = List.of(BookingStatus.IN_PROGRESS);

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public UserService(UserRepository userRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    public UserProfileResponse getProfile(UserPrincipal principal) {
        User user = requireUser(principal.getId());
        return toProfile(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(UserPrincipal principal, UpdateUserProfileRequest request) {
        User user = requireUser(principal.getId());
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        userRepository.save(user);
        return toProfile(user);
    }

    @Transactional(readOnly = true)
    public CustomerStatsResponse getStats(UserPrincipal principal) {
        UUID userId = principal.getId();
        long totalRides = bookingRepository.countByUser_IdAndStatus(userId, BookingStatus.COMPLETED);
        BigDecimal totalSpent = bookingRepository.sumCompletedFareByUserId(userId);

        BookingResponse upcoming = bookingRepository
                .findFirstByUser_IdAndStatusInOrderByScheduledAtAsc(userId, UPCOMING_STATUSES)
                .map(EntityMapper::toBookingResponse)
                .orElse(null);

        BookingResponse activeRide = bookingRepository
                .findFirstByUser_IdAndStatusInOrderByUpdatedAtDesc(userId, ACTIVE_RIDE_STATUSES)
                .map(EntityMapper::toBookingResponse)
                .orElse(null);

        return CustomerStatsResponse.builder()
                .totalRides(totalRides)
                .totalSpent(totalSpent)
                .upcomingBooking(upcoming)
                .activeRide(activeRide)
                .build();
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserProfileResponse toProfile(User user) {
        return UserProfileResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .googleId(user.getGoogleId())
                .profilePictureUrl(user.getProfilePictureUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
