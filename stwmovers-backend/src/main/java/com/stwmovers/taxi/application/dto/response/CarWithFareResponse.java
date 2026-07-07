package com.stwmovers.taxi.application.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

import com.stwmovers.taxi.domain.enums.BodyType;
import com.stwmovers.taxi.domain.enums.CarCategory;
import com.stwmovers.taxi.domain.enums.CarType;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CarWithFareResponse {

    UUID id;
    String name;
    CarType carType;
    BodyType bodyType;
    CarCategory category;
    Integer passengerCapacity;
    BigDecimal baseFare;
    BigDecimal calculatedFare;
    Boolean electric;
    Boolean available;
    String imageUrl;
    String description;
}
