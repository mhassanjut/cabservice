package com.stwmovers.taxi.application.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoutePricingBatchRequest {

    @NotBlank
    private String fromCity;

    @NotBlank
    private String toCity;

    private Boolean active;

    @NotEmpty
    @Valid
    private List<CarRoutePriceRequest> carPrices;
}
