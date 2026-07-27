package com.stwmovers.taxi.application.dto.request;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBookingRequest {

    private UUID carId;

    @NotNull
    private Boolean otherCar;

    @NotBlank
    private String pickupAddress;

    @NotBlank
    private String dropoffAddress;

    @NotNull
    private Double pickupLat;

    @NotNull
    private Double pickupLng;

    @NotNull
    private Double dropoffLat;

    @NotNull
    private Double dropoffLng;

    @NotNull
    @DecimalMin("0")
    private BigDecimal distanceKm;

    @NotBlank
    private String pickupCity;

    private String destinationCity;

    private Integer passengerCount;

    @NotNull
    private Instant scheduledAt;

    private String guestName;

    @Email
    private String guestEmail;

    private String guestPhone;

    private String notes;

    private UUID tourId;
}
