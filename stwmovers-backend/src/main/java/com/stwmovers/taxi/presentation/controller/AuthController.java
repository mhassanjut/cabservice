package com.stwmovers.taxi.presentation.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stwmovers.taxi.application.dto.request.GoogleLoginRequest;
import com.stwmovers.taxi.application.dto.request.GuestOtpRequest;
import com.stwmovers.taxi.application.dto.request.LoginRequest;
import com.stwmovers.taxi.application.dto.request.RefreshRequest;
import com.stwmovers.taxi.application.dto.request.RegisterRequest;
import com.stwmovers.taxi.application.dto.request.VerifyOtpRequest;
import com.stwmovers.taxi.application.dto.response.AuthResponse;
import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.application.dto.response.OtpSentResponse;
import com.stwmovers.taxi.application.service.AuthService;
import com.stwmovers.taxi.application.service.GuestBookingService;
import com.stwmovers.taxi.application.service.RefreshTokenService;
import com.stwmovers.taxi.application.service.TokenRevocationService;
import com.stwmovers.taxi.config.ApiResponse;
import com.stwmovers.taxi.exception.UnauthorizedException;
import com.stwmovers.taxi.infrastructure.security.AuthCookieService;
import com.stwmovers.taxi.infrastructure.security.HttpAuthTokenExtractor;
import com.stwmovers.taxi.infrastructure.security.JwtTokenProvider;
import com.stwmovers.taxi.infrastructure.security.UserPrincipal;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final GuestBookingService guestBookingService;
    private final RefreshTokenService refreshTokenService;
    private final TokenRevocationService tokenRevocationService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthCookieService authCookieService;

    public AuthController(
            AuthService authService,
            GuestBookingService guestBookingService,
            RefreshTokenService refreshTokenService,
            TokenRevocationService tokenRevocationService,
            JwtTokenProvider jwtTokenProvider,
            AuthCookieService authCookieService) {
        this.authService = authService;
        this.guestBookingService = guestBookingService;
        this.refreshTokenService = refreshTokenService;
        this.tokenRevocationService = tokenRevocationService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authCookieService = authCookieService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        AuthResponse auth = authService.register(request);
        setAuthCookies(response, auth);
        return ResponseEntity.ok(ApiResponse.ok(auth));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        AuthResponse auth = authService.login(request);
        setAuthCookies(response, auth);
        return ResponseEntity.ok(ApiResponse.ok(auth));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithGoogle(
            @Valid @RequestBody GoogleLoginRequest request,
            HttpServletResponse response) {
        AuthResponse auth = authService.loginWithGoogle(request);
        setAuthCookies(response, auth);
        return ResponseEntity.ok(ApiResponse.ok(auth));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @CookieValue(name = AuthCookieService.REFRESH_TOKEN_COOKIE, required = false) String cookieRefreshToken,
            @RequestBody(required = false) RefreshRequest body,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletResponse response) {
        String refreshToken = resolveRefreshToken(cookieRefreshToken, body);
        AuthResponse auth;
        if (refreshToken != null) {
            auth = refreshTokenService.rotate(refreshToken);
        } else if (principal != null) {
            auth = authService.refreshSession(principal);
        } else {
            throw new UnauthorizedException("Refresh token required");
        }
        setAuthCookies(response, auth);
        return ResponseEntity.ok(ApiResponse.ok(auth));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest request,
            HttpServletResponse response) {
        revokePresentTokens(request);
        clearAuthCookies(response);
        return ResponseEntity.ok(ApiResponse.ok("Logged out", null));
    }

    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<Void>> logoutAll(
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest request,
            HttpServletResponse response) {
        if (principal == null) {
            throw new UnauthorizedException("Not authenticated");
        }
        authService.revokeAllSessions(principal.getId());
        revokePresentTokens(request);
        clearAuthCookies(response);
        return ResponseEntity.ok(ApiResponse.ok("Logged out from all devices", null));
    }

    @PostMapping("/guest/otp/send")
    public ResponseEntity<ApiResponse<OtpSentResponse>> sendGuestOtp(@Valid @RequestBody GuestOtpRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(guestBookingService.sendOtp(request)));
    }

    @PostMapping("/guest/otp/verify")
    public ResponseEntity<ApiResponse<BookingResponse>> verifyGuestOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(guestBookingService.verifyOtp(request)));
    }

    private String resolveRefreshToken(String cookieRefreshToken, RefreshRequest body) {
        if (cookieRefreshToken != null && !cookieRefreshToken.isBlank()) {
            return cookieRefreshToken;
        }
        if (body != null && body.getRefreshToken() != null && !body.getRefreshToken().isBlank()) {
            return body.getRefreshToken();
        }
        return null;
    }

    private void revokePresentTokens(HttpServletRequest request) {
        String accessToken = HttpAuthTokenExtractor.extractAccessToken(request);
        java.util.UUID userId = null;
        if (accessToken != null) {
            try {
                Claims claims = jwtTokenProvider.parseClaims(accessToken);
                tokenRevocationService.revoke(claims.getId(), claims.getExpiration().getTime());
                userId = java.util.UUID.fromString(claims.get("userId", String.class));
            } catch (Exception ignored) {
                // Ignore invalid or expired access tokens during logout.
            }
        }

        String refreshToken = HttpAuthTokenExtractor.extractCookie(
                request, AuthCookieService.REFRESH_TOKEN_COOKIE);
        if (refreshToken != null) {
            refreshTokenService.revokeByRawToken(refreshToken);
        } else if (userId != null) {
            refreshTokenService.revokeAllForUser(userId);
        }
    }

    private void setAuthCookies(HttpServletResponse response, AuthResponse auth) {
        response.addHeader(HttpHeaders.SET_COOKIE,
                authCookieService.accessTokenCookie(auth.getAccessToken(), authCookieService.accessMaxAgeSeconds())
                        .toString());
        if (auth.getRefreshToken() != null) {
            response.addHeader(HttpHeaders.SET_COOKIE,
                    authCookieService.refreshTokenCookie(
                            auth.getRefreshToken(), authCookieService.refreshMaxAgeSeconds()).toString());
        }
    }

    private void clearAuthCookies(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, authCookieService.clearAccessTokenCookie().toString());
        response.addHeader(HttpHeaders.SET_COOKIE, authCookieService.clearRefreshTokenCookie().toString());
    }
}
