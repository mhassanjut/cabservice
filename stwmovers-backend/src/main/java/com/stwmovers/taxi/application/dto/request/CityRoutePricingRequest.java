package com.stwmovers.taxi.application.dto.request;

import java.math.BigDecimal;

import com.stwmovers.taxi.domain.enums.CarType;

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
    private CarType carType;

    @NotNull
    private BigDecimal price;

    private Boolean active;
}
