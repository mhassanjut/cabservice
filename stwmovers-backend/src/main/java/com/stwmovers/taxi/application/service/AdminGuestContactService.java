package com.stwmovers.taxi.application.service;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.response.GuestContactAdminResponse;
import com.stwmovers.taxi.application.dto.response.PagedResponse;
import com.stwmovers.taxi.domain.repository.BookingRepository;

@Service
public class AdminGuestContactService {

    private final BookingRepository bookingRepository;

    public AdminGuestContactService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<GuestContactAdminResponse> listGuestContacts(String search, int page, int size) {
        Page<Object[]> rows = bookingRepository.findDistinctGuestContacts(
                normalizeSearch(search), PageRequest.of(page, size));

        return PagedResponse.<GuestContactAdminResponse>builder()
                .content(rows.getContent().stream().map(this::toResponse).toList())
                .page(rows.getNumber())
                .size(rows.getSize())
                .totalElements(rows.getTotalElements())
                .totalPages(rows.getTotalPages())
                .build();
    }

    private GuestContactAdminResponse toResponse(Object[] row) {
        return GuestContactAdminResponse.builder()
                .email(row[0] != null ? row[0].toString() : null)
                .guestName(row[1] != null ? row[1].toString() : null)
                .guestPhone(row[2] != null ? row[2].toString() : null)
                .bookingCount(row[3] != null ? ((Number) row[3]).longValue() : 0L)
                .lastBookingAt(toInstant(row[4]))
                .build();
    }

    private static Instant toInstant(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Instant instant) {
            return instant;
        }
        if (value instanceof java.sql.Timestamp timestamp) {
            return timestamp.toInstant();
        }
        return null;
    }

    private static String normalizeSearch(String search) {
        if (search == null || search.isBlank()) {
            return "";
        }
        return search.trim();
    }
}
