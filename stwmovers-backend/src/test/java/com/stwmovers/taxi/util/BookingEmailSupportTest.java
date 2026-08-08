package com.stwmovers.taxi.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.time.Instant;

import org.junit.jupiter.api.Test;

import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.enums.RideType;

class BookingEmailSupportTest {

    @Test
    void receiptFilenameUsesReferenceFirst() {
        assertEquals("STW-20260808-R28F-Receipt.pdf", BookingEmailSupport.receiptFilename("STW-20260808-R28F"));
    }

    @Test
    void confirmUrlBuildsFromPublicSiteUrl() {
        assertEquals(
                "https://stwmovers.com/confirm?ref=STW-20260808-R28F",
                BookingEmailSupport.confirmUrl("https://stwmovers.com", "STW-20260808-R28F"));
        assertEquals(
                "http://localhost:3000/confirm?ref=STW-20260808-R28F",
                BookingEmailSupport.confirmUrl("http://localhost:3000/", "STW-20260808-R28F"));
    }

    @Test
    void guestFirstNameUsesFirstToken() {
        Booking booking = Booking.builder().guestName("Hassan Ali").build();
        assertEquals("Hassan", BookingEmailSupport.guestFirstName(booking));
    }

    @Test
    void formatFareUsesEuroSymbol() {
        assertEquals("€55.00", BookingEmailSupport.formatFare(new BigDecimal("55")));
    }

    @Test
    void formatScheduledAtUsesMadridTimezoneLabel() {
        String formatted = BookingEmailSupport.formatScheduledAt(Instant.parse("2026-08-12T10:07:00Z"));
        assertTrue(formatted.contains("August 2026"));
        assertTrue(formatted.contains("(CEST/CET)"));
    }

    @Test
    void rideTypeLabelMapsStandardTransfer() {
        assertEquals("Point-to-point transfer", BookingEmailSupport.rideTypeLabel(RideType.STANDARD));
    }
}
