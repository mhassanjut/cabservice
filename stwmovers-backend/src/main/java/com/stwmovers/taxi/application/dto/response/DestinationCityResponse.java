package com.stwmovers.taxi.application.dto.response;

import java.util.List;
import java.util.UUID;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class DestinationCityResponse {

    UUID id;
    String name;
    Boolean active;
}
