package com.stwmovers.taxi.application.dto.response;

import java.util.UUID;

import com.stwmovers.taxi.domain.enums.Role;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponse {

    String accessToken;
    String tokenType;
    long expiresInMs;
    UUID userId;
    String email;
    String fullName;
    Role role;
}
