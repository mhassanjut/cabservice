package com.stwmovers.taxi.application.dto.response;

import java.util.UUID;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class PickupCityResponse {

    UUID id;
    String name;
    Boolean active;
}
