package com.stwmovers.taxi.application.service;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.request.GuestOtpRequest;
import com.stwmovers.taxi.application.dto.request.VerifyOtpRequest;
import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.application.dto.response.OtpSentResponse;
import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.repository.BookingRepository;
import com.stwmovers.taxi.exception.BadRequestException;
import com.stwmovers.taxi.exception.ResourceNotFoundException;

@Service
public class GuestBookingService {

    private final BookingRepository bookingRepository;
    private final OtpService otpService;
    private final NotificationService notificationService;
    private final BookingService bookingService;
    private final AppProperties appProperties;

    public GuestBookingService(
            BookingRepository bookingRepository,
            OtpService otpService,
            NotificationService notificationService,
            @Lazy BookingService bookingService,
            AppProperties appProperties) {
        this.bookingRepository = bookingRepository;
        this.otpService = otpService;
        this.notificationService = notificationService;
        this.bookingService = bookingService;
        this.appProperties = appProperties;
    }

    @Transactional(readOnly = true)
    public OtpSentResponse sendOtp(GuestOtpRequest request) {
        Booking booking = validateGuestBooking(request.getBookingReference(), request.getEmail());
        String otp = otpService.generateAndStore(request.getEmail());
        notificationService.sendOtpEmail(request.getEmail(), otp, booking.getBookingReference());
        return OtpSentResponse.builder()
                .email(request.getEmail())
                .bookingReference(booking.getBookingReference())
                .ttlSeconds(appProperties.getOtp().getTtlSeconds())
                .build();
    }

    @Transactional
    public BookingResponse verifyOtp(VerifyOtpRequest request) {
        validateGuestBooking(request.getBookingReference(), request.getEmail());
        if (!otpService.verify(request.getEmail(), request.getOtp())) {
            throw new BadRequestException("Invalid OTP");
        }
        return bookingService.markOtpVerified(request.getBookingReference());
    }

    private Booking validateGuestBooking(String reference, String email) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (booking.getGuestEmail() == null
                || !booking.getGuestEmail().equalsIgnoreCase(email.trim())) {
            throw new BadRequestException("Email does not match booking");
        }
        return booking;
    }
}
