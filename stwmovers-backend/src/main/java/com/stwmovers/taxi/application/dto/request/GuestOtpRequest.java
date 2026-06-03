package com.stwmovers.taxi.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GuestOtpRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String bookingReference;
}
