package com.stwmovers.taxi.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stwmovers.taxi.application.dto.request.GoogleLoginRequest;
import com.stwmovers.taxi.application.dto.request.GuestOtpRequest;
import com.stwmovers.taxi.application.dto.request.LoginRequest;
import com.stwmovers.taxi.application.dto.request.RegisterRequest;
import com.stwmovers.taxi.application.dto.request.VerifyOtpRequest;
import com.stwmovers.taxi.application.dto.response.AuthResponse;
import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.application.dto.response.OtpSentResponse;
import com.stwmovers.taxi.application.service.AuthService;
import com.stwmovers.taxi.application.service.GuestBookingService;
import com.stwmovers.taxi.config.ApiResponse;
import com.stwmovers.taxi.exception.UnauthorizedException;
import com.stwmovers.taxi.infrastructure.security.UserPrincipal;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final GuestBookingService guestBookingService;

    public AuthController(AuthService authService, GuestBookingService guestBookingService) {
        this.authService = authService;
        this.guestBookingService = guestBookingService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(authService.login(request)));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(authService.loginWithGoogle(request)));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("Not authenticated");
        }
        return ResponseEntity.ok(ApiResponse.ok(authService.refreshSession(principal)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.ok("Logged out", null));
    }

    @PostMapping("/guest/otp/send")
    public ResponseEntity<ApiResponse<OtpSentResponse>> sendGuestOtp(@Valid @RequestBody GuestOtpRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(guestBookingService.sendOtp(request)));
    }

    @PostMapping("/guest/otp/verify")
    public ResponseEntity<ApiResponse<BookingResponse>> verifyGuestOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(guestBookingService.verifyOtp(request)));
    }
}
