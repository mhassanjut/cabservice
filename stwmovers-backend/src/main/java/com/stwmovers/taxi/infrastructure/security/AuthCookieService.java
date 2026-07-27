package com.stwmovers.taxi.infrastructure.security;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

import com.stwmovers.taxi.config.AppProperties;

public final class AuthCookieService {

    public static final String ACCESS_TOKEN_COOKIE = "access_token";
    public static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    private final AppProperties appProperties;

    public AuthCookieService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public ResponseCookie accessTokenCookie(String token, long maxAgeSeconds) {
        return ResponseCookie.from(ACCESS_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(appProperties.getCookie().isSecure())
                .sameSite("Lax")
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();
    }

    public ResponseCookie refreshTokenCookie(String token, long maxAgeSeconds) {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(appProperties.getCookie().isSecure())
                .sameSite("Strict")
                .path("/api/v1/auth")
                .maxAge(maxAgeSeconds)
                .build();
    }

    public ResponseCookie clearAccessTokenCookie() {
        return ResponseCookie.from(ACCESS_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(appProperties.getCookie().isSecure())
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
    }

    public ResponseCookie clearRefreshTokenCookie() {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(appProperties.getCookie().isSecure())
                .sameSite("Strict")
                .path("/api/v1/auth")
                .maxAge(0)
                .build();
    }

    public long accessMaxAgeSeconds() {
        return Math.max(1, appProperties.getJwt().getAccessExpirationMs() / 1000L);
    }

    public long refreshMaxAgeSeconds() {
        return Math.max(1, appProperties.getJwt().getRefreshExpirationMs() / 1000L);
    }
}
