package com.stwmovers.taxi.application.dto.response;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class TourItineraryItemResponse {
    Integer dayNumber;
    String time;
    String activity;
}
