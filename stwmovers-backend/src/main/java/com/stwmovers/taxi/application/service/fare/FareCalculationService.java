package com.stwmovers.taxi.application.service.fare;

import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.stwmovers.taxi.application.port.FareCalculationContext;
import com.stwmovers.taxi.application.port.FareCalculationStrategy;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.enums.RideType;

@Service
public class FareCalculationService {

    private final Map<RideType, FareCalculationStrategy> strategies;

    public FareCalculationService(List<FareCalculationStrategy> strategyList) {
        this.strategies = new EnumMap<>(RideType.class);
        for (FareCalculationStrategy strategy : strategyList) {
            strategies.put(strategy.supportedRideType(), strategy);
        }
    }

    public BigDecimal calculateFare(Car car, RideType rideType, FareCalculationContext context) {
        FareCalculationStrategy strategy = strategies.get(rideType);
        if (strategy == null) {
            throw new IllegalStateException("No fare strategy registered for ride type: " + rideType);
        }
        return strategy.calculateFare(car, context);
    }
}
