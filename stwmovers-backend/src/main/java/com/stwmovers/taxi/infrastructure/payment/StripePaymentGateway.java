package com.stwmovers.taxi.infrastructure.payment;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.entity.Payment;
import com.stwmovers.taxi.exception.BusinessException;

import jakarta.annotation.PostConstruct;

@Component
public class StripePaymentGateway {

    private final AppProperties appProperties;

    public StripePaymentGateway(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @PostConstruct
    void init() {
        if (appProperties.getStripe().getApiKey() != null && !appProperties.getStripe().getApiKey().isBlank()) {
            Stripe.apiKey = appProperties.getStripe().getApiKey();
        }
    }

    public Session createCheckoutSession(Booking booking, Payment payment) {
        try {
            long amountCents = payment.getAmount().movePointRight(2).longValue();

            Map<String, String> metadata = new HashMap<>();
            metadata.put("bookingReference", booking.getBookingReference());
            metadata.put("bookingId", booking.getId().toString());

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(appProperties.getStripe().getSuccessUrl()
                            + "?session_id={CHECKOUT_SESSION_ID}&ref=" + booking.getBookingReference())
                    .setCancelUrl(appProperties.getStripe().getCancelUrl())
                    .putMetadata("bookingReference", booking.getBookingReference())
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency(payment.getCurrency())
                                    .setUnitAmount(amountCents)
                                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName("STW Movers ride " + booking.getBookingReference())
                                            .build())
                                    .build())
                            .build())
                    .build();

            return Session.create(params);
        } catch (StripeException e) {
            throw new BusinessException("Failed to create Stripe checkout session: " + e.getMessage());
        }
    }

    public com.stripe.model.Event constructWebhookEvent(String payload, String sigHeader) {
        try {
            return com.stripe.net.Webhook.constructEvent(
                    payload,
                    sigHeader,
                    appProperties.getStripe().getWebhookSecret());
        } catch (Exception e) {
            throw new BusinessException("Invalid Stripe webhook signature");
        }
    }
}
