package com.stwmovers.taxi.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddDestinationCityRequest {

    @NotBlank
    private String name;
}
