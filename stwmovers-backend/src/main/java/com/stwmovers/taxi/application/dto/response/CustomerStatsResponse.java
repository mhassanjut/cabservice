package com.stwmovers.taxi.application.dto.response;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CustomerStatsResponse {

    long totalRides;
    BigDecimal totalSpent;
    BookingResponse upcomingBooking;
    BookingResponse activeRide;
}
