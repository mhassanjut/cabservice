package com.stwmovers.taxi.util;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.springframework.web.util.HtmlUtils;

import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.entity.Tour;
import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.enums.RideType;

public final class BookingEmailSupport {

    private static final ZoneId SERVICE_ZONE = ZoneId.of("Europe/Madrid");
    private static final DateTimeFormatter SCHEDULED_FORMAT =
            DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy 'at' HH:mm", Locale.UK)
                    .withZone(SERVICE_ZONE);
    private static final DateTimeFormatter SHORT_DATE_FORMAT =
            DateTimeFormatter.ofPattern("d MMM yyyy", Locale.UK)
                    .withZone(SERVICE_ZONE);

    private BookingEmailSupport() {}

    public static String escape(String value) {
        return value == null ? "" : HtmlUtils.htmlEscape(value);
    }

    public static String receiptFilename(String bookingReference) {
        return bookingReference + "-Receipt.pdf";
    }

    public static String confirmUrl(String publicSiteUrl, String bookingReference) {
        String base = publicSiteUrl.endsWith("/")
                ? publicSiteUrl.substring(0, publicSiteUrl.length() - 1)
                : publicSiteUrl;
        return base + "/confirm?ref=" + bookingReference;
    }

    public static String guestFirstName(Booking booking) {
        String name = resolveGuestName(booking);
        if (name == null || name.isBlank()) {
            return "there";
        }
        String trimmed = name.trim();
        int space = trimmed.indexOf(' ');
        return space > 0 ? trimmed.substring(0, space) : trimmed;
    }

    public static String resolveGuestName(Booking booking) {
        if (booking.getGuestName() != null && !booking.getGuestName().isBlank()) {
            return booking.getGuestName().trim();
        }
        User user = booking.getUser();
        if (user != null && user.getFullName() != null && !user.getFullName().isBlank()) {
            return user.getFullName().trim();
        }
        return null;
    }

    public static String resolveGuestEmail(Booking booking) {
        if (booking.getGuestEmail() != null && !booking.getGuestEmail().isBlank()) {
            return booking.getGuestEmail().trim();
        }
        User user = booking.getUser();
        return user != null ? user.getEmail() : null;
    }

    public static String resolveGuestPhone(Booking booking) {
        if (booking.getGuestPhone() != null && !booking.getGuestPhone().isBlank()) {
            return booking.getGuestPhone().trim();
        }
        User user = booking.getUser();
        return user != null && user.getPhone() != null ? user.getPhone().trim() : "—";
    }

    public static String formatScheduledAt(Instant scheduledAt) {
        if (scheduledAt == null) {
            return "—";
        }
        return SCHEDULED_FORMAT.format(scheduledAt) + " (CEST/CET)";
    }

    public static String formatIssuedDate(Instant instant) {
        if (instant == null) {
            instant = Instant.now();
        }
        return SHORT_DATE_FORMAT.format(instant);
    }

    public static String formatFare(BigDecimal fare) {
        if (fare == null) {
            return "Custom request";
        }
        return String.format(Locale.UK, "€%.2f", fare);
    }

    public static String formatDistance(BigDecimal distanceKm) {
        if (distanceKm == null) {
            return "—";
        }
        return String.format(Locale.UK, "%.1f km", distanceKm);
    }

    public static String rideTypeLabel(RideType rideType) {
        if (rideType == null) {
            return "Chauffeur transfer";
        }
        return switch (rideType) {
            case STANDARD -> "Point-to-point transfer";
            case IN_CITY -> "In-city transfer";
            case CITY_TO_CITY -> "Inter-city transfer";
            case TOUR -> "Private tour";
        };
    }

    public static String vehicleLabel(Booking booking) {
        Tour tour = booking.getTour();
        if (tour != null && tour.getTitle() != null && !tour.getTitle().isBlank()) {
            return tour.getTitle().trim();
        }
        Car car = booking.getCar();
        if (car != null && car.getName() != null && !car.getName().isBlank()) {
            return car.getName().trim();
        }
        if (Boolean.TRUE.equals(booking.getCustomRequest())) {
            return "Custom vehicle request";
        }
        return "—";
    }

    public static String whatsappUrl(String whatsappNumber) {
        return "https://wa.me/" + whatsappNumber;
    }
}
