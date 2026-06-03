package com.stwmovers.taxi.application.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignDriverRequest {

    @NotNull
    private UUID driverId;
}
