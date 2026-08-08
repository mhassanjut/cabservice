package com.stwmovers.taxi.infrastructure.email;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.time.Instant;

import org.junit.jupiter.api.Test;

import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.enums.RideType;

class BookingReceiptPdfGeneratorTest {

    @Test
    void generatesNonEmptyPdfBytes() {
        AppProperties appProperties = new AppProperties();
        BrandLogoProvider brandLogoProvider = new BrandLogoProvider();
        BookingReceiptHtmlBuilder htmlBuilder = new BookingReceiptHtmlBuilder(appProperties, brandLogoProvider);
        BookingReceiptPdfGenerator generator = new BookingReceiptPdfGenerator(htmlBuilder);

        Booking booking = Booking.builder()
                .bookingReference("STW-20260808-R28F")
                .guestName("Hassan Ali")
                .guestEmail("guest@example.com")
                .guestPhone("+34627408522")
                .status(BookingStatus.CONFIRMED)
                .rideType(RideType.STANDARD)
                .pickupAddress("Barcelona, Spain")
                .dropoffAddress("08820 El Prat de Llobregat, Barcelona, Spain")
                .distanceKm(new BigDecimal("27.5"))
                .scheduledAt(Instant.parse("2026-08-12T10:07:00Z"))
                .calculatedFare(new BigDecimal("55.00"))
                .build();

        byte[] pdf = generator.generate(booking);

        assertNotNull(pdf);
        assertTrue(pdf.length > 1000);
        assertTrue(pdf[0] == '%' && pdf[1] == 'P' && pdf[2] == 'D' && pdf[3] == 'F');
    }
}
