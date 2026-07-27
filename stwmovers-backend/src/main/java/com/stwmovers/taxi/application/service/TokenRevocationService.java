package com.stwmovers.taxi.application.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.domain.entity.RevokedAccessToken;
import com.stwmovers.taxi.domain.repository.RevokedAccessTokenRepository;

@Service
public class TokenRevocationService {

    private final RevokedAccessTokenRepository revokedAccessTokenRepository;

    public TokenRevocationService(RevokedAccessTokenRepository revokedAccessTokenRepository) {
        this.revokedAccessTokenRepository = revokedAccessTokenRepository;
    }

    @Transactional
    public void revoke(String jti, long expiresAtEpochMs) {
        if (jti == null || jti.isBlank()) {
            return;
        }
        long ttl = expiresAtEpochMs - System.currentTimeMillis();
        if (ttl <= 0) {
            return;
        }
        RevokedAccessToken revoked = RevokedAccessToken.builder()
                .jti(jti)
                .expiresAt(Instant.ofEpochMilli(expiresAtEpochMs))
                .build();
        revokedAccessTokenRepository.save(revoked);
    }

    @Transactional(readOnly = true)
    public boolean isRevoked(String jti) {
        if (jti == null || jti.isBlank()) {
            return false;
        }
        return revokedAccessTokenRepository.findById(jti)
                .filter(token -> token.getExpiresAt().isAfter(Instant.now()))
                .isPresent();
    }

    public void trackSession(UUID userId, String jti, long expiresAtEpochMs) {
        // Session index is optional; access-token revocation uses jti blacklist.
    }

    @Transactional
    public void revokeAllForUser(UUID userId) {
        // Per-user mass revocation of access tokens requires session index (future enhancement).
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void purgeExpiredRevocations() {
        revokedAccessTokenRepository.deleteExpiredBefore(Instant.now());
    }
}
