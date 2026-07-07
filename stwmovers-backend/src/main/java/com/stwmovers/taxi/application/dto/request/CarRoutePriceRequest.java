package com.stwmovers.taxi.application.dto.request;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarRoutePriceRequest {

    @NotNull
    private UUID carId;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;
}
