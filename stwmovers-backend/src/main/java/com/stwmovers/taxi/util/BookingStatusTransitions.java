package com.stwmovers.taxi.util;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.exception.BadRequestException;

public final class BookingStatusTransitions {

    /** Operational statuses admins may set once a booking is confirmed (or when reactivating). */
    private static final List<BookingStatus> ADMIN_POST_CONFIRMATION = List.of(
            BookingStatus.CONFIRMED,
            BookingStatus.DRIVER_ASSIGNED,
            BookingStatus.DRIVER_ACCEPTED,
            BookingStatus.IN_PROGRESS,
            BookingStatus.COMPLETED,
            BookingStatus.REFUNDED,
            BookingStatus.CANCELLED);

    private static final Map<BookingStatus, Set<BookingStatus>> ALLOWED = Map.ofEntries(
            Map.entry(BookingStatus.CREATED, EnumSet.of(BookingStatus.OTP_PENDING, BookingStatus.CANCELLED)),
            Map.entry(BookingStatus.OTP_PENDING, EnumSet.of(BookingStatus.PAYMENT_PENDING, BookingStatus.CANCELLED)),
            Map.entry(
                    BookingStatus.PAYMENT_PENDING,
                    EnumSet.of(BookingStatus.CONFIRMED, BookingStatus.CANCELLED)),
            Map.entry(
                    BookingStatus.CONFIRMED,
                    EnumSet.of(BookingStatus.DRIVER_ASSIGNED, BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED)),
            Map.entry(
                    BookingStatus.DRIVER_ASSIGNED,
                    EnumSet.of(BookingStatus.DRIVER_ACCEPTED, BookingStatus.CONFIRMED, BookingStatus.CANCELLED)),
            Map.entry(
                    BookingStatus.DRIVER_ACCEPTED,
                    EnumSet.of(BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED)),
            Map.entry(BookingStatus.IN_PROGRESS, EnumSet.of(BookingStatus.COMPLETED, BookingStatus.CANCELLED)),
            Map.entry(BookingStatus.COMPLETED, EnumSet.of(BookingStatus.REFUNDED)),
            Map.entry(BookingStatus.CANCELLED, EnumSet.noneOf(BookingStatus.class)),
            Map.entry(BookingStatus.REFUNDED, EnumSet.noneOf(BookingStatus.class)));

    private BookingStatusTransitions() {}

    public static Set<BookingStatus> nextStatuses(BookingStatus current) {
        return ALLOWED.getOrDefault(current, EnumSet.noneOf(BookingStatus.class));
    }

    public static void assertTransition(BookingStatus current, BookingStatus next) {
        if (!nextStatuses(current).contains(next)) {
            throw new BadRequestException("Cannot change booking status from " + current + " to " + next);
        }
    }

    /** Statuses an admin may select in the booking panel (broader than customer flow). */
    public static List<BookingStatus> adminTargetStatuses(BookingStatus current) {
        List<BookingStatus> targets = new ArrayList<>();

        if (current == BookingStatus.CANCELLED || current == BookingStatus.REFUNDED) {
            for (BookingStatus status : ADMIN_POST_CONFIRMATION) {
                if (status != current && status != BookingStatus.CANCELLED) {
                    targets.add(status);
                }
            }
            return sortAdminTargets(targets);
        }

        if (ADMIN_POST_CONFIRMATION.contains(current)) {
            for (BookingStatus status : ADMIN_POST_CONFIRMATION) {
                if (status != current) {
                    targets.add(status);
                }
            }
            return sortAdminTargets(targets);
        }

        Set<BookingStatus> preConfirm = EnumSet.copyOf(nextStatuses(current));
        preConfirm.add(BookingStatus.CONFIRMED);
        preConfirm.remove(current);
        targets.addAll(preConfirm);
        return sortAdminTargets(targets);
    }

    public static void assertAdminTransition(BookingStatus current, BookingStatus next) {
        if (!adminTargetStatuses(current).contains(next)) {
            throw new BadRequestException("Admin cannot change booking status from " + current + " to " + next);
        }
    }

    private static List<BookingStatus> sortAdminTargets(List<BookingStatus> targets) {
        targets.sort(Comparator.comparingInt(BookingStatusTransitions::adminSortOrder));
        return targets;
    }

    private static int adminSortOrder(BookingStatus status) {
        int idx = ADMIN_POST_CONFIRMATION.indexOf(status);
        return idx >= 0 ? idx : 100 + status.ordinal();
    }
}
