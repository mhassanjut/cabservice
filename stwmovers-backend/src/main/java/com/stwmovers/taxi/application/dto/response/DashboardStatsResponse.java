package com.stwmovers.taxi.application.dto.response;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class DashboardStatsResponse {

    long totalRides;
    BigDecimal totalRevenue;
    long activeDrivers;
    long activeBookings;
    long failedPayments;
    long pendingCustomRequests;
}
