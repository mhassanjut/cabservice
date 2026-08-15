package com.stwmovers.taxi.application.dto.response;

import java.time.Instant;
import java.util.UUID;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class RegisteredCustomerAdminResponse {

    UUID userId;
    String email;
    String fullName;
    String profilePictureUrl;
    Instant createdAt;
    long bookingCount;
}
