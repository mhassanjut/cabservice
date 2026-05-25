package com.stwmovers.taxi.application.dto.response;

import java.time.Instant;
import java.util.UUID;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class DriverResponse {

    UUID id;
    UUID userId;
    String email;
    String fullName;
    String phone;
    String licenseNumber;
    Boolean active;
    Instant createdAt;
}
