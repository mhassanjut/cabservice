package com.stwmovers.taxi.application.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.response.AuthResponse;
import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.entity.RefreshToken;
import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.repository.RefreshTokenRepository;
import com.stwmovers.taxi.domain.repository.UserRepository;
import com.stwmovers.taxi.exception.UnauthorizedException;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final AppProperties appProperties;
    private final AuthService authService;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            UserRepository userRepository,
            AppProperties appProperties,
            @Lazy AuthService authService) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.appProperties = appProperties;
        this.authService = authService;
    }

    @Transactional
    public String create(UUID userId) {
        String rawToken = generateRawToken();
        RefreshToken entity = RefreshToken.builder()
                .userId(userId)
                .tokenHash(hashToken(rawToken))
                .expiresAt(Instant.now().plusMillis(appProperties.getJwt().getRefreshExpirationMs()))
                .revoked(false)
                .build();
        refreshTokenRepository.save(entity);
        return rawToken;
    }

    @Transactional
    public AuthResponse rotate(String rawToken) {
        String tokenHash = hashToken(rawToken);
        RefreshToken stored = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (Boolean.TRUE.equals(stored.getRevoked())) {
            authService.revokeAllSessions(stored.getUserId());
            throw new UnauthorizedException("Refresh token reuse detected");
        }

        if (stored.getExpiresAt().isBefore(Instant.now())) {
            stored.setRevoked(true);
            refreshTokenRepository.save(stored);
            throw new UnauthorizedException("Refresh token expired");
        }

        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        User user = userRepository.findById(stored.getUserId())
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new UnauthorizedException("User account is inactive");
        }

        return authService.issueSession(user);
    }

    @Transactional
    public void revokeByRawToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return;
        }
        String tokenHash = hashToken(rawToken);
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
            if (!Boolean.TRUE.equals(token.getRevoked())) {
                token.setRevoked(true);
                refreshTokenRepository.save(token);
            }
        });
    }

    @Transactional
    public void revokeAllForUser(UUID userId) {
        refreshTokenRepository.revokeAllActiveForUser(userId);
    }

    private String generateRawToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    static String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
