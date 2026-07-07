package com.stwmovers.taxi.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateDriverRequest {

    @NotBlank
    private String fullName;

    private String phone;

    @NotBlank
    private String licenseNumber;

    private Boolean active;
}
