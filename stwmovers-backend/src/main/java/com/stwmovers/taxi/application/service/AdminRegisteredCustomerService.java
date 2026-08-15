package com.stwmovers.taxi.application.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.response.PagedResponse;
import com.stwmovers.taxi.application.dto.response.RegisteredCustomerAdminResponse;
import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.enums.Role;
import com.stwmovers.taxi.domain.repository.BookingRepository;
import com.stwmovers.taxi.domain.repository.UserRepository;

@Service
public class AdminRegisteredCustomerService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public AdminRegisteredCustomerService(UserRepository userRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<RegisteredCustomerAdminResponse> listGoogleCustomers(String search, int page, int size) {
        String normalizedSearch = normalizeSearch(search);
        Page<User> users = userRepository.findGoogleCustomers(
                Role.CUSTOMER,
                normalizedSearch,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        List<UUID> userIds = users.getContent().stream().map(User::getId).toList();
        Map<UUID, Long> bookingCounts = loadBookingCounts(userIds);

        List<RegisteredCustomerAdminResponse> content = users.getContent().stream()
                .map(user -> RegisteredCustomerAdminResponse.builder()
                        .userId(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .profilePictureUrl(user.getProfilePictureUrl())
                        .createdAt(user.getCreatedAt())
                        .bookingCount(bookingCounts.getOrDefault(user.getId(), 0L))
                        .build())
                .toList();

        return PagedResponse.<RegisteredCustomerAdminResponse>builder()
                .content(content)
                .page(users.getNumber())
                .size(users.getSize())
                .totalElements(users.getTotalElements())
                .totalPages(users.getTotalPages())
                .build();
    }

    private Map<UUID, Long> loadBookingCounts(List<UUID> userIds) {
        if (userIds.isEmpty()) {
            return Map.of();
        }
        return bookingRepository.countBookingsGroupedByUserId(userIds).stream()
                .collect(Collectors.toMap(row -> (UUID) row[0], row -> ((Number) row[1]).longValue()));
    }

    private static String normalizeSearch(String search) {
        if (search == null || search.isBlank()) {
            return "";
        }
        return search.trim();
    }
}
