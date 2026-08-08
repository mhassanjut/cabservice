package com.stwmovers.taxi.application.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.stwmovers.taxi.application.port.EmailAttachment;
import com.stwmovers.taxi.application.port.EmailInlineImage;
import com.stwmovers.taxi.application.port.EmailSender;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.enums.RideType;
import com.stwmovers.taxi.infrastructure.email.BookingConfirmationEmailBuilder;
import com.stwmovers.taxi.infrastructure.email.BookingReceiptPdfGenerator;
import com.stwmovers.taxi.infrastructure.email.BrandLogoProvider;
import com.stwmovers.taxi.infrastructure.email.FleetBookingAlertEmailBuilder;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private EmailSender emailSender;

    @Mock
    private BookingConfirmationEmailBuilder confirmationEmailBuilder;

    @Mock
    private FleetBookingAlertEmailBuilder fleetBookingAlertEmailBuilder;

    @Mock
    private BookingReceiptPdfGenerator receiptPdfGenerator;

    @Mock
    private BrandLogoProvider brandLogoProvider;

    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        notificationService = new NotificationService(
                emailSender,
                confirmationEmailBuilder,
                fleetBookingAlertEmailBuilder,
                receiptPdfGenerator,
                brandLogoProvider);
    }

    @Test
    void sendPaymentSuccess_sendsCustomerAndFleetEmails() {
        Booking booking = sampleBooking();
        EmailInlineImage logo = new EmailInlineImage("brand-logo", "logo-white.png", new byte[] {1}, "image/png");

        when(confirmationEmailBuilder.subject(booking)).thenReturn("Customer subject");
        when(confirmationEmailBuilder.buildHtml(booking)).thenReturn("<p>Customer html</p>");
        when(confirmationEmailBuilder.buildText(booking)).thenReturn("Customer text");
        when(receiptPdfGenerator.generate(booking)).thenReturn(new byte[] {37, 80, 68, 70});
        when(brandLogoProvider.emailInlineImage()).thenReturn(logo);
        when(fleetBookingAlertEmailBuilder.fleetAlertEmail()).thenReturn("fleetvtc2025@gmail.com");
        when(fleetBookingAlertEmailBuilder.subject(booking)).thenReturn("Fleet subject");
        when(fleetBookingAlertEmailBuilder.buildHtml(booking)).thenReturn("<p>Fleet html</p>");
        when(fleetBookingAlertEmailBuilder.buildText(booking)).thenReturn("Fleet text");

        notificationService.sendPaymentSuccess(booking);

        verify(emailSender).sendHtml(
                eq("guest@example.com"),
                eq("Customer subject"),
                eq("<p>Customer html</p>"),
                eq("Customer text"),
                org.mockito.ArgumentMatchers.<List<EmailAttachment>>any(),
                eq(List.of(logo)));

        verify(emailSender).sendHtml(
                eq("fleetvtc2025@gmail.com"),
                eq("Fleet subject"),
                eq("<p>Fleet html</p>"),
                eq("Fleet text"),
                eq(Collections.emptyList()),
                eq(Collections.emptyList()));
    }

    @Test
    void sendPaymentSuccess_stillCompletesWhenFleetEmailFails() {
        Booking booking = sampleBooking();
        EmailInlineImage logo = new EmailInlineImage("brand-logo", "logo-white.png", new byte[] {1}, "image/png");

        when(confirmationEmailBuilder.subject(booking)).thenReturn("Customer subject");
        when(confirmationEmailBuilder.buildHtml(booking)).thenReturn("<p>Customer html</p>");
        when(confirmationEmailBuilder.buildText(booking)).thenReturn("Customer text");
        when(receiptPdfGenerator.generate(booking)).thenReturn(new byte[] {37, 80, 68, 70});
        when(brandLogoProvider.emailInlineImage()).thenReturn(logo);
        when(fleetBookingAlertEmailBuilder.fleetAlertEmail()).thenReturn("fleetvtc2025@gmail.com");
        when(fleetBookingAlertEmailBuilder.subject(booking)).thenReturn("Fleet subject");
        when(fleetBookingAlertEmailBuilder.buildHtml(booking)).thenReturn("<p>Fleet html</p>");
        when(fleetBookingAlertEmailBuilder.buildText(booking)).thenReturn("Fleet text");
        doAnswer(invocation -> {
            if ("fleetvtc2025@gmail.com".equals(invocation.getArgument(0, String.class))) {
                throw new IllegalStateException("SMTP down");
            }
            return null;
        }).when(emailSender).sendHtml(anyString(), anyString(), anyString(), anyString(), any(), any());

        notificationService.sendPaymentSuccess(booking);

        verify(emailSender).sendHtml(
                eq("guest@example.com"),
                eq("Customer subject"),
                eq("<p>Customer html</p>"),
                eq("Customer text"),
                org.mockito.ArgumentMatchers.<List<EmailAttachment>>any(),
                eq(List.of(logo)));
    }

    private static Booking sampleBooking() {
        return Booking.builder()
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
                .distanceKm(new BigDecimal("27.5"))
                .scheduledAt(Instant.parse("2026-08-12T10:07:00Z"))
                .createdAt(Instant.parse("2026-08-08T09:15:00Z"))
                .calculatedFare(new BigDecimal("55.00"))
                .build();
    }
}
