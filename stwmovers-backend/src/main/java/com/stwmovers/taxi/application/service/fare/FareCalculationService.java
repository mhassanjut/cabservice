package com.stwmovers.taxi.application.service.fare;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;

import com.stwmovers.taxi.application.port.FareCalculationContext;
import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.entity.CityRoutePricing;
import com.stwmovers.taxi.domain.repository.CityRoutePricingRepository;
import com.stwmovers.taxi.exception.BadRequestException;
import com.stwmovers.taxi.util.CityNameUtils;

@Service
public class FareCalculationService {

    private final CityRoutePricingRepository cityRoutePricingRepository;
    private final AppProperties appProperties;

    public FareCalculationService(
            CityRoutePricingRepository cityRoutePricingRepository,
            AppProperties appProperties) {
        this.cityRoutePricingRepository = cityRoutePricingRepository;
        this.appProperties = appProperties;
    }

    public BigDecimal calculateFare(Car car, FareCalculationContext context) {
        BigDecimal distanceKm = requireDistance(context.getDistanceKm());

        String pickupCity = CityNameUtils.normalize(context.getPickupCity());
        String destinationCity = CityNameUtils.normalize(context.getDestinationCity());

        if (pickupCity != null && destinationCity != null) {
            var routePrice = cityRoutePricingRepository
                    .findActiveByRouteAndCarId(pickupCity, destinationCity, car.getId());
            if (routePrice.isPresent()) {
                return routePrice.get().getPrice().setScale(2, RoundingMode.HALF_UP);
            }
        }

        return calculateDistanceFare(car, distanceKm);
    }

    private BigDecimal calculateDistanceFare(Car car, BigDecimal distanceKm) {
        BigDecimal baseFare = car.getBaseFare();
        int baseKm = appProperties.getFare().getInCityBaseKm();
        BigDecimal extraEurPerKm = appProperties.getFare().getInCityExtraEurPerKm();

        if (distanceKm.compareTo(BigDecimal.valueOf(baseKm)) <= 0) {
            return baseFare.setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal extraKm = distanceKm.subtract(BigDecimal.valueOf(baseKm));
        BigDecimal extraCharge = extraKm.multiply(extraEurPerKm);
        return baseFare.add(extraCharge).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal requireDistance(BigDecimal distanceKm) {
        if (distanceKm == null || distanceKm.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("distanceKm must be greater than zero");
        }
        return distanceKm;
    }
}
