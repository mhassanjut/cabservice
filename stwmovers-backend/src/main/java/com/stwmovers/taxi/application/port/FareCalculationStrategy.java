package com.stwmovers.taxi.application.port;

import java.math.BigDecimal;

import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.enums.RideType;

public interface FareCalculationStrategy {

    RideType supportedRideType();

    BigDecimal calculateFare(Car car, FareCalculationContext context);
}
