package com.stwmovers.taxi.application.port;

import java.util.Optional;

public interface OtpStore {

    void save(String email, String otp, long ttlSeconds);

    Optional<String> get(String email);

    void delete(String email);
}
