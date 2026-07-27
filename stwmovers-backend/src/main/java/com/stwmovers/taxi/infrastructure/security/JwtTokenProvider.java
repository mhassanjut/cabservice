package com.stwmovers.taxi.infrastructure.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import com.stwmovers.taxi.config.AppProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

    public record AccessToken(String token, String jti, long expiresAtEpochMs) {
    }

    private final AppProperties appProperties;
    private final SecretKey secretKey;

    public JwtTokenProvider(AppProperties appProperties) {
        this.appProperties = appProperties;
        this.secretKey = Keys.hmacShaKeyFor(appProperties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(UserPrincipal principal) {
        return generateAccessToken(principal).token();
    }

    public AccessToken generateAccessToken(UserPrincipal principal) {
        Date now = new Date();
        long accessExpirationMs = getAccessExpirationMs();
        Date expiry = new Date(now.getTime() + accessExpirationMs);
        String jti = UUID.randomUUID().toString();
        String token = Jwts.builder()
                .id(jti)
                .subject(principal.getEmail())
                .claim("userId", principal.getId().toString())
                .claim("role", principal.getRole().name())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey)
                .compact();
        return new AccessToken(token, jti, expiry.getTime());
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getAccessExpirationMs() {
        return appProperties.getJwt().getAccessExpirationMs();
    }

    public long getExpirationMs() {
        return getAccessExpirationMs();
    }
}
