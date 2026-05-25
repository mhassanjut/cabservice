package com.stwmovers.taxi.application.service;

import java.security.SecureRandom;

import org.springframework.stereotype.Service;

import com.stwmovers.taxi.application.port.OtpStore;
import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.exception.BadRequestException;

@Service
public class OtpService {

    private final OtpStore otpStore;
    private final AppProperties appProperties;
    private final SecureRandom random = new SecureRandom();

    public OtpService(OtpStore otpStore, AppProperties appProperties) {
        this.otpStore = otpStore;
        this.appProperties = appProperties;
    }

    public String generateAndStore(String email) {
        String otp = generateOtp(appProperties.getOtp().getLength());
        otpStore.save(normalizeEmail(email), otp, appProperties.getOtp().getTtlSeconds());
        return otp;
    }

    public boolean verify(String email, String otp) {
        String stored = otpStore.get(normalizeEmail(email))
                .orElseThrow(() -> new BadRequestException("OTP expired or not found"));
        boolean valid = stored.equals(otp.trim());
        if (valid) {
            otpStore.delete(normalizeEmail(email));
        }
        return valid;
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
