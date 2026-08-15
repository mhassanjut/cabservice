package com.stwmovers.taxi.application.dto.response;

import java.time.Instant;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class GuestContactAdminResponse {

    String email;
    String guestName;
    String guestPhone;
    long bookingCount;
    Instant lastBookingAt;
}
