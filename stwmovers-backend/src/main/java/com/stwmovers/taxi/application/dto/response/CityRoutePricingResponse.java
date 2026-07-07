package com.stwmovers.taxi.application.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CityRoutePricingResponse {

    UUID id;
    String fromCity;
    String toCity;
    UUID carId;
    String carName;
    BigDecimal price;
    Boolean active;
}
