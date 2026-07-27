package com.stwmovers.taxi.application.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.enums.RideStatus;
import com.stwmovers.taxi.domain.enums.RideType;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class BookingResponse {

    UUID id;
    String bookingReference;
    UUID userId;
    String guestName;
    String guestEmail;
    String guestPhone;
    UUID carId;
    String carName;
    Boolean customRequest;
    BookingStatus status;
    RideType rideType;
    String pickupAddress;
    String dropoffAddress;
    Double pickupLat;
    Double pickupLng;
    Double dropoffLat;
    Double dropoffLng;
    BigDecimal distanceKm;
    Integer passengerCount;
    Instant scheduledAt;
    BigDecimal calculatedFare;
    String destinationCity;
    String notes;
    UUID tourId;
    String tourTitle;
    UUID driverId;
    RideStatus rideStatus;
    Instant createdAt;
    Instant updatedAt;
}
