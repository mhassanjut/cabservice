package com.stwmovers.taxi.application.service.fare;

import org.springframework.stereotype.Service;

import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.enums.RideType;

@Service
public class RideTypeService {

    private final AppProperties appProperties;

    public RideTypeService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public boolean isWithinBarcelona(double lat, double lng) {
        AppProperties.BarcelonaBounds bounds = appProperties.getBarcelona();
        return lat >= bounds.getMinLat()
                && lat <= bounds.getMaxLat()
                && lng >= bounds.getMinLng()
                && lng <= bounds.getMaxLng();
    }

    public RideType determineRideType(double pickupLat, double pickupLng, double dropoffLat, double dropoffLng) {
        boolean pickupInBarcelona = isWithinBarcelona(pickupLat, pickupLng);
        boolean dropoffInBarcelona = isWithinBarcelona(dropoffLat, dropoffLng);
        if (pickupInBarcelona && dropoffInBarcelona) {
            return RideType.IN_CITY;
        }
        return RideType.CITY_TO_CITY;
    }

    public RideType resolveRideType(
            RideType requested,
            double pickupLat,
            double pickupLng,
            double dropoffLat,
            double dropoffLng) {
        RideType computed = determineRideType(pickupLat, pickupLng, dropoffLat, dropoffLng);
        if (requested == null) {
            return computed;
        }
        return computed;
    }
}
