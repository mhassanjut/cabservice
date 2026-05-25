package com.stwmovers.taxi.application.dto.request;

import java.math.BigDecimal;

import com.stwmovers.taxi.domain.enums.BodyType;
import com.stwmovers.taxi.domain.enums.CarCategory;
import com.stwmovers.taxi.domain.enums.CarType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminCarRequest {

    @NotBlank
    private String name;

    @NotNull
    private CarType carType;

    @NotNull
    private BodyType bodyType;

    @NotNull
    private CarCategory category;

    @NotNull
    @Min(1)
    private Integer passengerCapacity;

    @NotNull
    private BigDecimal baseFare;

    private Boolean electric;

    private Boolean available;

    private Boolean active;

    private Boolean supportsInCity;

    private Boolean supportsCityToCity;

    private String imageUrl;

    private String description;

    private Integer displayPriority;
}
