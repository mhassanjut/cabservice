package com.stwmovers.taxi.infrastructure.otp;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.stwmovers.taxi.application.port.OtpStore;

@Component
public class RedisOtpStore implements OtpStore {

    private static final String KEY_PREFIX = "otp:";

    private final ConcurrentHashMap<String, Entry> store = new ConcurrentHashMap<>();

    @Override
    public void save(String email, String otpHash, long ttlSeconds) {
        store.put(key(email), new Entry(otpHash, System.currentTimeMillis() + ttlSeconds * 1000L));
    }

    @Override
    public Optional<String> get(String email) {
        Entry entry = store.get(key(email));
        if (entry == null) {
            return Optional.empty();
        }
        if (System.currentTimeMillis() > entry.expiresAtMs) {
            store.remove(key(email));
            return Optional.empty();
        }
        return Optional.of(entry.value);
    }

    @Override
    public void delete(String email) {
        store.remove(key(email));
    }

    private String key(String email) {
        return KEY_PREFIX + email;
    }

    private static final class Entry {
        private final String value;
        private final long expiresAtMs;

        private Entry(String value, long expiresAtMs) {
            this.value = value;
            this.expiresAtMs = expiresAtMs;
        }
    }
}
