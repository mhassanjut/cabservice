package com.stwmovers.taxi.application.dto.request;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CityRoutePricingRequest {

    @NotBlank
    private String fromCity;

    @NotBlank
    private String toCity;

    @NotNull
    private UUID carId;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;

    private Boolean active;
}
