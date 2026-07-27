package com.stwmovers.taxi.application.dto.response;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.stwmovers.taxi.domain.enums.Role;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {

    String accessToken;
    String refreshToken;
    String tokenType;
    long expiresInMs;
    UUID userId;
    String email;
    String fullName;
    Role role;
    String profilePictureUrl;

    public AuthResponse withoutTokens() {
        return AuthResponse.builder()
                .tokenType(tokenType)
                .expiresInMs(expiresInMs)
                .userId(userId)
                .email(email)
                .fullName(fullName)
                .role(role)
                .profilePictureUrl(profilePictureUrl)
                .build();
    }
}
