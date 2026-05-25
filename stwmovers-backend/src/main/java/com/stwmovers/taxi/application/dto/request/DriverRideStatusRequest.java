package com.stwmovers.taxi.application.dto.request;

import com.stwmovers.taxi.domain.enums.RideStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DriverRideStatusRequest {

    @NotNull
    private RideStatus rideStatus;
}
