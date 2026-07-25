package com.stwmovers.taxi.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TourItineraryItemRequest {

    @NotNull
    private Integer dayNumber;

    private String time;

    @NotBlank
    private String activity;
}
