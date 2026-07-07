package com.stwmovers.taxi.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stwmovers.taxi.application.dto.request.UpdateUserProfileRequest;
import com.stwmovers.taxi.application.dto.response.CustomerStatsResponse;
import com.stwmovers.taxi.application.dto.response.UserProfileResponse;
import com.stwmovers.taxi.application.service.UserService;
import com.stwmovers.taxi.config.ApiResponse;
import com.stwmovers.taxi.exception.UnauthorizedException;
import com.stwmovers.taxi.infrastructure.security.UserPrincipal;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> me(@AuthenticationPrincipal UserPrincipal principal) {
        requirePrincipal(principal);
        return ResponseEntity.ok(ApiResponse.ok(userService.getProfile(principal)));
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateMe(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateUserProfileRequest request) {
        requirePrincipal(principal);
        return ResponseEntity.ok(ApiResponse.ok(userService.updateProfile(principal, request)));
    }

    @GetMapping("/me/stats")
    public ResponseEntity<ApiResponse<CustomerStatsResponse>> stats(@AuthenticationPrincipal UserPrincipal principal) {
        requirePrincipal(principal);
        return ResponseEntity.ok(ApiResponse.ok(userService.getStats(principal)));
    }

    private static void requirePrincipal(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("Not authenticated");
        }
    }
}
