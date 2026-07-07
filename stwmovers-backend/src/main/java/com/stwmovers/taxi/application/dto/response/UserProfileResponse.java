package com.stwmovers.taxi.application.dto.response;

import java.time.Instant;
import java.util.UUID;

import com.stwmovers.taxi.domain.enums.Role;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserProfileResponse {

    UUID userId;
    String email;
    String fullName;
    String phone;
    Role role;
    String googleId;
    String profilePictureUrl;
    Instant createdAt;
}
