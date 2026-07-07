package com.stwmovers.taxi.application.port;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class FareCalculationContext {

    BigDecimal distanceKm;
    String pickupCity;
    String destinationCity;
}
