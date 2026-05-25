package com.stwmovers.taxi.application.dto.request;

import java.math.BigDecimal;

import com.stwmovers.taxi.domain.enums.BodyType;
import com.stwmovers.taxi.domain.enums.CarCategory;
import com.stwmovers.taxi.domain.enums.CarType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarFilterRequest {

    private Integer passengerCapacity;
    private CarType carType;
    private BodyType bodyType;
    private CarCategory category;
    private Boolean electric;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean luxury;
}
