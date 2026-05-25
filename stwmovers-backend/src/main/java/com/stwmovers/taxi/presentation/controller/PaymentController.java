package com.stwmovers.taxi.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.model.Event;
import com.stwmovers.taxi.application.dto.request.CreatePaymentSessionRequest;
import com.stwmovers.taxi.application.dto.response.PaymentResponse;
import com.stwmovers.taxi.application.dto.response.PaymentSessionResponse;
import com.stwmovers.taxi.application.service.PaymentService;
import com.stwmovers.taxi.config.ApiResponse;
import com.stwmovers.taxi.infrastructure.payment.StripePaymentGateway;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final StripePaymentGateway stripePaymentGateway;

    public PaymentController(PaymentService paymentService, StripePaymentGateway stripePaymentGateway) {
        this.paymentService = paymentService;
        this.stripePaymentGateway = stripePaymentGateway;
    }

    @PostMapping("/session")
    public ResponseEntity<ApiResponse<PaymentSessionResponse>> createSession(
            @Valid @RequestBody CreatePaymentSessionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.createCheckoutSession(request)));
    }

    @GetMapping("/{bookingReference}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPayment(@PathVariable String bookingReference) {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.getPaymentByBookingReference(bookingReference)));
    }

    @PostMapping("/webhook")
    public ResponseEntity<ApiResponse<Void>> webhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {
        Event event = stripePaymentGateway.constructWebhookEvent(payload, signature);
        paymentService.handleWebhookEvent(event);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
