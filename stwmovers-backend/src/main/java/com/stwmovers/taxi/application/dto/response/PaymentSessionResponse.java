package com.stwmovers.taxi.application.dto.response;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class PaymentSessionResponse {

    String sessionId;
    String checkoutUrl;
    String bookingReference;
}
