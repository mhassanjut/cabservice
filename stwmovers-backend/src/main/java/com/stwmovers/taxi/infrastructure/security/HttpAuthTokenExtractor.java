package com.stwmovers.taxi.infrastructure.security;

import org.springframework.http.HttpHeaders;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

public final class HttpAuthTokenExtractor {

    private HttpAuthTokenExtractor() {
    }

    public static String extractAccessToken(HttpServletRequest request) {
        String bearer = extractBearerToken(request);
        if (bearer != null) {
            return bearer;
        }
        return extractCookie(request, AuthCookieService.ACCESS_TOKEN_COOKIE);
    }

    public static String extractBearerToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    public static String extractCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (name.equals(cookie.getName()) && cookie.getValue() != null && !cookie.getValue().isBlank()) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
