package com.stwmovers.taxi.application.service.fare;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Component;

import com.stwmovers.taxi.application.port.FareCalculationContext;
import com.stwmovers.taxi.application.port.FareCalculationStrategy;
import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.enums.RideType;

@Component
public class InCityFareCalculationStrategy implements FareCalculationStrategy {

    private final AppProperties appProperties;

    public InCityFareCalculationStrategy(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Override
    public RideType supportedRideType() {
        return RideType.IN_CITY;
    }

    @Override
    public BigDecimal calculateFare(Car car, FareCalculationContext context) {
        BigDecimal baseFare = car.getBaseFare();
        BigDecimal distanceKm = context.getDistanceKm();
        if (distanceKm == null) {
            return baseFare;
        }

        int baseKm = appProperties.getFare().getInCityBaseKm();
        int extraBlockKm = appProperties.getFare().getInCityExtraKmBlock();
        BigDecimal extraPerBlock = appProperties.getFare().getInCityExtraEurPerBlock();

        if (distanceKm.compareTo(BigDecimal.valueOf(baseKm)) <= 0) {
            return baseFare.setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal extraKm = distanceKm.subtract(BigDecimal.valueOf(baseKm));
        int blocks = extraKm.divide(BigDecimal.valueOf(extraBlockKm), 0, RoundingMode.CEILING).intValue();
        BigDecimal extraCharge = extraPerBlock.multiply(BigDecimal.valueOf(blocks));
        return baseFare.add(extraCharge).setScale(2, RoundingMode.HALF_UP);
    }
}
