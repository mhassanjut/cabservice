package com.stwmovers.taxi.infrastructure.email;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.Instant;

import org.junit.jupiter.api.Test;

import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.enums.RideType;

class FleetBookingAlertEmailBuilderTest {

    @Test
    void includesAllBookingDetailsInTextAndHtml() {
        AppProperties appProperties = new AppProperties();
        FleetBookingAlertEmailBuilder builder = new FleetBookingAlertEmailBuilder(appProperties);

        Booking booking = Booking.builder()
                .bookingReference("STW-20260808-A7Z7")
                .guestName("Muhammad Ali")
                .guestEmail("guest@example.com")
                .guestPhone("+34627408522")
                .status(BookingStatus.CONFIRMED)
                .rideType(RideType.STANDARD)
                .pickupAddress("Barcelona, Spain")
                .dropoffAddress("08820 El Prat de Llobregat, Barcelona, Spain")
                .pickupLat(41.3874)
                .pickupLng(2.1686)
                .dropoffLat(41.3275)
                .dropoffLng(2.0951)
                .destinationCity("Barcelona")
                .distanceKm(new BigDecimal("27.5"))
                .passengerCount(2)
                .scheduledAt(Instant.parse("2026-08-12T10:07:00Z"))
                .createdAt(Instant.parse("2026-08-08T09:15:00Z"))
                .calculatedFare(new BigDecimal("55.00"))
                .notes("Flight arrives at T1")
                .customRequest(false)
                .build();

        assertThat(builder.fleetAlertEmail()).isEqualTo("fleetvtc2025@gmail.com");
        assertThat(builder.subject(booking)).isEqualTo("New paid booking — STW-20260808-A7Z7");

        String text = builder.buildText(booking);
        assertThat(text)
                .contains("STW-20260808-A7Z7")
                .contains("Confirmed")
                .contains("Paid online (Stripe)")
                .contains("Muhammad Ali")
                .contains("guest@example.com")
                .contains("+34627408522")
                .contains("Barcelona, Spain")
                .contains("08820 El Prat de Llobregat, Barcelona, Spain")
                .contains("41.387400, 2.168600")
                .contains("27.5 km")
                .contains("€55.00")
                .contains("Flight arrives at T1");

        String html = builder.buildHtml(booking);
        assertThat(html)
                .contains("STW-20260808-A7Z7")
                .contains("Muhammad Ali")
                .contains("Point-to-point transfer")
                .contains("Flight arrives at T1");
    }
}
