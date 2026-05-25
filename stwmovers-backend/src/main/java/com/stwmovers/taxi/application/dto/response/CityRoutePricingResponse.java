package com.stwmovers.taxi.application.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

import com.stwmovers.taxi.domain.enums.CarType;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CityRoutePricingResponse {

    UUID id;
    String fromCity;
    String toCity;
    CarType carType;
    BigDecimal price;
    Boolean active;
}
