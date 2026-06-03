package com.stwmovers.taxi.application.service;

import org.springframework.stereotype.Service;

import com.stwmovers.taxi.application.port.EmailSender;
import com.stwmovers.taxi.domain.entity.Booking;

@Service
public class NotificationService {

    private final EmailSender emailSender;

    public NotificationService(EmailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendOtpEmail(String email, String otp, String bookingReference) {
        String subject = "STW Movers - Verify your booking";
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
        String email = booking.getGuestEmail() != null
                ? booking.getGuestEmail()
                : (booking.getUser() != null ? booking.getUser().getEmail() : null);
        if (email == null) {
            return;
        }
        String subject = "STW Movers - Booking confirmed " + booking.getBookingReference();
        String body = """
                Your booking %s has been confirmed.

                Pickup: %s
                Dropoff: %s
                Scheduled: %s
                Fare: %s EUR

                Thank you for choosing STW Movers.
                """.formatted(
                booking.getBookingReference(),
                booking.getPickupAddress(),
                booking.getDropoffAddress(),
                booking.getScheduledAt(),
                booking.getCalculatedFare() != null ? booking.getCalculatedFare() : "Custom request");
        emailSender.send(email, subject, body);
    }

    public void sendPaymentSuccess(Booking booking) {
        sendBookingConfirmation(booking);
    }
}
