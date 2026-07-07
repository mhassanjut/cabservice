package com.stwmovers.taxi.presentation.specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.enums.RideType;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public final class BookingSpecification {

    private BookingSpecification() {}

    public static Specification<Booking> adminFilter(
            BookingStatus status,
            RideType rideType,
            Boolean customRequest,
            String search,
            Instant fromDate,
            Instant toDate) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (rideType != null) {
                predicates.add(cb.equal(root.get("rideType"), rideType));
            }
            if (customRequest != null) {
                predicates.add(cb.equal(root.get("customRequest"), customRequest));
            }
            if (fromDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("scheduledAt"), fromDate));
            }
            if (toDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("scheduledAt"), toDate));
            }
            if (search != null && !search.isBlank()) {
                var userJoin = root.join("user", JoinType.LEFT);
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("bookingReference")), pattern),
                        cb.like(cb.lower(root.get("guestName")), pattern),
                        cb.like(cb.lower(root.get("guestEmail")), pattern),
                        cb.like(cb.lower(userJoin.get("fullName")), pattern)));
            }

            query.distinct(true);
            if (predicates.isEmpty()) {
                return cb.conjunction();
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
