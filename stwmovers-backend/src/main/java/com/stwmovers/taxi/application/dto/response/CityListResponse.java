package com.stwmovers.taxi.application.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CityListResponse {

    List<String> cities;
}
