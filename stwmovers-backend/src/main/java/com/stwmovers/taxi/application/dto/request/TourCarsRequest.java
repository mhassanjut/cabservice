package com.stwmovers.taxi.application.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TourCarsRequest {

    private CarFilterRequest filters;
    private Integer page;
    private Integer size;
}
