package com.stwmovers.taxi.application.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.stwmovers.taxi.domain.enums.PaymentStatus;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class PaymentResponse {

    UUID id;
    UUID bookingId;
    String bookingReference;
    BigDecimal amount;
    String currency;
    PaymentStatus status;
    String stripeSessionId;
    String stripePaymentIntentId;
    Instant createdAt;
}
