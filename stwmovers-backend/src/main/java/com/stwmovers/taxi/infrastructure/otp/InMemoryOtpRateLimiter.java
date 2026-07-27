package com.stwmovers.taxi.infrastructure.otp;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.stwmovers.taxi.application.port.OtpRateLimiter;
import com.stwmovers.taxi.exception.BadRequestException;

@Component
public class InMemoryOtpRateLimiter implements OtpRateLimiter {

    private static final int MAX_SENDS_PER_WINDOW = 3;
    private static final long SEND_WINDOW_SECONDS = 600;
    private static final int MAX_VERIFY_ATTEMPTS = 5;

    private final ConcurrentHashMap<String, Counter> sendCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Counter> verifyAttempts = new ConcurrentHashMap<>();

    @Override
    public void checkSendAllowed(String email) {
        Counter counter = sendCounts.get(sendKey(email));
        if (counter != null && !counter.isExpired() && counter.count >= MAX_SENDS_PER_WINDOW) {
            throw new BadRequestException("OTP already sent. Please wait before requesting again.");
        }
    }

    @Override
    public void recordSend(String email, long windowSeconds) {
        long windowMs = windowSeconds > 0 ? windowSeconds * 1000L : SEND_WINDOW_SECONDS * 1000L;
        sendCounts.compute(sendKey(email), (key, existing) -> {
            if (existing == null || existing.isExpired()) {
                return new Counter(1, System.currentTimeMillis() + windowMs);
            }
            existing.count++;
            return existing;
        });
    }

    @Override
    public void recordFailedVerify(String email, long ttlSeconds) {
        long ttlMs = ttlSeconds * 1000L;
        Counter counter = verifyAttempts.compute(attemptKey(email), (key, existing) -> {
            if (existing == null || existing.isExpired()) {
                return new Counter(1, System.currentTimeMillis() + ttlMs);
            }
            existing.count++;
            return existing;
        });
        if (counter != null && counter.count >= MAX_VERIFY_ATTEMPTS) {
            throw new BadRequestException("Too many OTP attempts. Request a new code.");
        }
    }

    @Override
    public void resetVerifyAttempts(String email) {
        verifyAttempts.remove(attemptKey(email));
    }

    private String sendKey(String email) {
        return "otp:send:" + email;
    }

    private String attemptKey(String email) {
        return "otp:attempts:" + email;
    }

    private static final class Counter {
        private int count;
        private final long expiresAtMs;

        private Counter(int count, long expiresAtMs) {
            this.count = count;
            this.expiresAtMs = expiresAtMs;
        }

        private boolean isExpired() {
            return System.currentTimeMillis() > expiresAtMs;
        }
    }
}
