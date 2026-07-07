package com.stwmovers.taxi.application.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.stwmovers.taxi.domain.enums.PaymentStatus;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class DashboardStatsResponse {

    long totalRides;
    long activeRides;
    BigDecimal totalRevenue;
    BigDecimal revenueToday;
    BigDecimal revenueThisMonth;
    long activeDrivers;
    long activeBookings;
    long failedPayments;
    long pendingCustomRequests;
    List<BookingResponse> recentBookings;
}
