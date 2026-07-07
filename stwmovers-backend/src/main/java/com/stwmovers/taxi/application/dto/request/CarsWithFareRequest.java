package com.stwmovers.taxi.application.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarsWithFareRequest {

    @NotNull
    private Double pickupLat;

    @NotNull
    private Double pickupLng;

    @NotNull
    private Double dropoffLat;

    @NotNull
    private Double dropoffLng;

    @NotNull
    @DecimalMin(value = "0.1", message = "distanceKm must be positive")
    private BigDecimal distanceKm;

    @NotBlank
    private String pickupCity;

    private String destinationCity;

    private CarFilterRequest filters;

    private Integer page = 0;

    private Integer size = 20;
}
