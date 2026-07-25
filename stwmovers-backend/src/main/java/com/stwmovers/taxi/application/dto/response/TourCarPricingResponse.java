package com.stwmovers.taxi.application.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class TourCarPricingResponse {
    UUID id;
    UUID tourId;
    UUID carId;
    String carName;
    BigDecimal price;
    Boolean active;
}
