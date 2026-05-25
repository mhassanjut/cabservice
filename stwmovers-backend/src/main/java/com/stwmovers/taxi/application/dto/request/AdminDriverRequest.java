package com.stwmovers.taxi.application.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminDriverRequest {

    @NotNull
    private UUID userId;

    @NotBlank
    private String licenseNumber;

    private Boolean active;
}
