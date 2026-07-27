package com.stwmovers.taxi.domain.repository;

import java.time.Instant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.stwmovers.taxi.domain.entity.RevokedAccessToken;

public interface RevokedAccessTokenRepository extends JpaRepository<RevokedAccessToken, String> {

    @Modifying
    @Query("DELETE FROM RevokedAccessToken r WHERE r.expiresAt < :cutoff")
    int deleteExpiredBefore(Instant cutoff);
}
