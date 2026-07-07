package com.stwmovers.taxi.application.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class SetCustomFareRequest {

    @NotNull
    @Positive
    private BigDecimal fare;
}
