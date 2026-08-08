package com.stwmovers.taxi.application.service;

import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.stwmovers.taxi.application.port.EmailAttachment;
import com.stwmovers.taxi.application.port.EmailSender;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.infrastructure.email.BookingConfirmationEmailBuilder;
import com.stwmovers.taxi.infrastructure.email.BookingReceiptPdfGenerator;
import com.stwmovers.taxi.infrastructure.email.BrandLogoProvider;
import com.stwmovers.taxi.infrastructure.email.FleetBookingAlertEmailBuilder;
import com.stwmovers.taxi.util.BookingEmailSupport;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final EmailSender emailSender;
    private final BookingConfirmationEmailBuilder confirmationEmailBuilder;
    private final FleetBookingAlertEmailBuilder fleetBookingAlertEmailBuilder;
    private final BookingReceiptPdfGenerator receiptPdfGenerator;
    private final BrandLogoProvider brandLogoProvider;

    public NotificationService(
            EmailSender emailSender,
            BookingConfirmationEmailBuilder confirmationEmailBuilder,
            FleetBookingAlertEmailBuilder fleetBookingAlertEmailBuilder,
            BookingReceiptPdfGenerator receiptPdfGenerator,
            BrandLogoProvider brandLogoProvider) {
        this.emailSender = emailSender;
        this.confirmationEmailBuilder = confirmationEmailBuilder;
        this.fleetBookingAlertEmailBuilder = fleetBookingAlertEmailBuilder;
        this.receiptPdfGenerator = receiptPdfGenerator;
        this.brandLogoProvider = brandLogoProvider;
    }

    public void sendOtpEmail(String email, String otp, String bookingReference) {
        String subject = "STW Movers — Verify your booking";
        String body = """
                Hello,

                Your verification code for booking %s is: %s

                This code expires in 10 minutes.

                Thank you,
                STW Movers Barcelona
                """.formatted(bookingReference, otp);
        emailSender.send(email, subject, body);
    }

    public void sendBookingConfirmation(Booking booking) {
        String email = BookingEmailSupport.resolveGuestEmail(booking);
        if (email == null) {
            return;
        }

        byte[] receiptPdf = receiptPdfGenerator.generate(booking);
        EmailAttachment attachment = new EmailAttachment(
                BookingEmailSupport.receiptFilename(booking.getBookingReference()),
                receiptPdf,
                "application/pdf");

        emailSender.sendHtml(
                email,
                confirmationEmailBuilder.subject(booking),
                confirmationEmailBuilder.buildHtml(booking),
                confirmationEmailBuilder.buildText(booking),
                List.of(attachment),
                List.of(brandLogoProvider.emailInlineImage()));
    }

    public void sendPaymentSuccess(Booking booking) {
        sendBookingConfirmation(booking);
        sendFleetBookingAlert(booking);
    }

    private void sendFleetBookingAlert(Booking booking) {
        String fleetEmail = fleetBookingAlertEmailBuilder.fleetAlertEmail();
        if (fleetEmail == null || fleetEmail.isBlank()) {
            return;
        }

        try {
            emailSender.sendHtml(
                    fleetEmail,
                    fleetBookingAlertEmailBuilder.subject(booking),
                    fleetBookingAlertEmailBuilder.buildHtml(booking),
                    fleetBookingAlertEmailBuilder.buildText(booking),
                    Collections.emptyList(),
                    Collections.emptyList());
        } catch (Exception e) {
            log.error(
                    "Failed to send fleet booking alert for {} to {}",
                    booking.getBookingReference(),
                    fleetEmail,
                    e);
        }
    }
}
