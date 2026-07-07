package com.stwmovers.taxi.application.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.stwmovers.taxi.domain.enums.PaymentStatus;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AdminBookingDetailResponse {

    BookingResponse booking;
    String customerName;
    String customerEmail;
    String customerPhone;
    String driverName;
    PaymentStatus paymentStatus;
    String stripeSessionId;
    String stripePaymentIntentId;
    BigDecimal paymentAmount;
    List<String> allowedNextStatuses;
}
