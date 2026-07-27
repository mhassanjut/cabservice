package com.stwmovers.taxi.domain.enums;

/**
 * STANDARD is used for all new bookings.
 * IN_CITY and CITY_TO_CITY are preserved for legacy records only.
 */
public enum RideType {
    STANDARD,
    IN_CITY,
    CITY_TO_CITY,
    TOUR
}
