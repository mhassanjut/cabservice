package com.stwmovers.taxi.application.port;

public interface OtpRateLimiter {

    void checkSendAllowed(String email);

    void recordSend(String email, long windowSeconds);

    void recordFailedVerify(String email, long ttlSeconds);

    void resetVerifyAttempts(String email);
}
