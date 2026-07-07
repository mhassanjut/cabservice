package com.stwmovers.taxi.application.service;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.request.CreatePaymentSessionRequest;
import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.application.dto.response.PaymentResponse;
import com.stwmovers.taxi.application.dto.response.PaymentSessionResponse;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.entity.Payment;
import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.enums.PaymentStatus;
import com.stwmovers.taxi.domain.repository.BookingRepository;
import com.stwmovers.taxi.domain.repository.PaymentRepository;
import com.stwmovers.taxi.exception.BadRequestException;
import com.stwmovers.taxi.exception.BusinessException;
import com.stwmovers.taxi.exception.ResourceNotFoundException;
import com.stwmovers.taxi.infrastructure.payment.StripePaymentGateway;
import com.stwmovers.taxi.util.EntityMapper;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final StripePaymentGateway stripePaymentGateway;
    private final BookingService bookingService;
    private final NotificationService notificationService;

    public PaymentService(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository,
            StripePaymentGateway stripePaymentGateway,
            @Lazy BookingService bookingService,
            NotificationService notificationService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.stripePaymentGateway = stripePaymentGateway;
        this.bookingService = bookingService;
        this.notificationService = notificationService;
    }

    @Transactional
    public PaymentSessionResponse createCheckoutSession(CreatePaymentSessionRequest request) {
        ensureStripeConfigured();
        Booking booking = bookingRepository.findByBookingReference(request.getBookingReference())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PAYMENT_PENDING && booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BadRequestException("Booking is not ready for payment");
        }
        requireContactPhone(booking);
        if (Boolean.TRUE.equals(booking.getCustomRequest()) || booking.getCalculatedFare() == null) {
            throw new BadRequestException("Custom request bookings cannot be paid online automatically");
        }

        Payment payment = paymentRepository.findByBookingId(booking.getId()).orElseGet(() -> {
            Payment p = Payment.builder()
                    .booking(booking)
                    .amount(booking.getCalculatedFare())
                    .currency("eur")
                    .status(PaymentStatus.PENDING)
                    .build();
            return paymentRepository.save(p);
        });

        Session session = stripePaymentGateway.createCheckoutSession(booking, payment);
        payment.setStripeSessionId(session.getId());
        paymentRepository.save(payment);

        return PaymentSessionResponse.builder()
                .sessionId(session.getId())
                .checkoutUrl(session.getUrl())
                .bookingReference(booking.getBookingReference())
                .build();
    }

    @Transactional
    public void handleWebhookEvent(Event event) {
        if (!"checkout.session.completed".equals(event.getType())) {
            return;
        }
        Session session = (Session) event.getDataObjectDeserializer()
                .getObject()
                .orElseThrow(() -> new BadRequestException("Unable to deserialize Stripe session"));
        markSessionPaid(session);
    }

    @Transactional
    public BookingResponse confirmCheckoutSession(String sessionId) {
        ensureStripeConfigured();
        Session session;
        try {
            session = Session.retrieve(sessionId);
        } catch (StripeException e) {
            throw new BadRequestException("Invalid payment session");
        }
        if (!"paid".equals(session.getPaymentStatus())) {
            throw new BadRequestException("Payment has not been completed");
        }
        markSessionPaid(session);
        Payment payment = paymentRepository.findByStripeSessionId(session.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for session"));
        return bookingService.getByReference(payment.getBooking().getBookingReference());
    }

    private void markSessionPaid(Session session) {
        Payment payment = paymentRepository.findByStripeSessionId(session.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for session"));

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return;
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setStripePaymentIntentId(session.getPaymentIntent());
        paymentRepository.save(payment);

        Booking booking = payment.getBooking();
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            bookingService.confirmPayment(booking.getBookingReference());
            notificationService.sendPaymentSuccess(booking);
        }
    }

    private void ensureStripeConfigured() {
        if (stripePaymentGateway.isConfigured()) {
            return;
        }
        throw new BusinessException("Stripe is not configured. Set STRIPE_API_KEY on the server.");
    }

    private void requireContactPhone(Booking booking) {
        String phone = booking.getGuestPhone();
        if (phone == null || phone.isBlank()) {
            User user = booking.getUser();
            if (user != null && user.getPhone() != null && !user.getPhone().isBlank()) {
                phone = user.getPhone();
            }
        }
        if (phone == null || phone.isBlank()) {
            throw new BadRequestException("A contact phone number is required before payment.");
        }
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByBookingReference(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        Payment payment = paymentRepository.findByBookingId(booking.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return EntityMapper.toPaymentResponse(payment);
    }
}
