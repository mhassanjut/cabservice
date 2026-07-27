package com.stwmovers.taxi.application.service;

import java.security.SecureRandom;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stwmovers.taxi.application.port.OtpRateLimiter;
import com.stwmovers.taxi.application.port.OtpStore;
import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.exception.BadRequestException;

@Service
public class OtpService {

    private final OtpStore otpStore;
    private final OtpRateLimiter otpRateLimiter;
    private final AppProperties appProperties;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom random = new SecureRandom();

    public OtpService(
            OtpStore otpStore,
            OtpRateLimiter otpRateLimiter,
            AppProperties appProperties,
            PasswordEncoder passwordEncoder) {
        this.otpStore = otpStore;
        this.otpRateLimiter = otpRateLimiter;
        this.appProperties = appProperties;
        this.passwordEncoder = passwordEncoder;
    }

    public String generateAndStore(String email) {
        String normalizedEmail = normalizeEmail(email);
        otpRateLimiter.checkSendAllowed(normalizedEmail);

        String otp = generateOtp(appProperties.getOtp().getLength());
        String hash = passwordEncoder.encode(otp);
        long ttlSeconds = appProperties.getOtp().getTtlSeconds();
        otpStore.save(normalizedEmail, hash, ttlSeconds);
        otpRateLimiter.recordSend(normalizedEmail, ttlSeconds);
        otpRateLimiter.resetVerifyAttempts(normalizedEmail);
        return otp;
    }

    public boolean verify(String email, String otp) {
        String normalizedEmail = normalizeEmail(email);
        long ttlSeconds = appProperties.getOtp().getTtlSeconds();

        String storedHash = otpStore.get(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("OTP expired or not found"));

        if (passwordEncoder.matches(otp.trim(), storedHash)) {
            otpStore.delete(normalizedEmail);
            otpRateLimiter.resetVerifyAttempts(normalizedEmail);
            return true;
        }

        try {
            otpRateLimiter.recordFailedVerify(normalizedEmail, ttlSeconds);
        } catch (BadRequestException ex) {
            otpStore.delete(normalizedEmail);
            throw ex;
        }
        return false;
    }

    private String generateOtp(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
