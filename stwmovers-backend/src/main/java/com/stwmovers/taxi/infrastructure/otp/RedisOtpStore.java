package com.stwmovers.taxi.infrastructure.otp;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
// import java.util.concurrent.TimeUnit;
// import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.stwmovers.taxi.application.port.OtpStore;

@Component
public class RedisOtpStore implements OtpStore {

    private static final String KEY_PREFIX = "otp:";

    // REDIS-DISABLED: was StringRedisTemplate for distributed OTP cache. Re-enable: uncomment field/constructor and Redis ops in save/get/delete; remove in-memory store.
    // private final StringRedisTemplate redisTemplate;
    //
    // public RedisOtpStore(StringRedisTemplate redisTemplate) {
    //     this.redisTemplate = redisTemplate;
    // }

    private final ConcurrentHashMap<String, Entry> store = new ConcurrentHashMap<>();

    @Override
    public void save(String email, String otp, long ttlSeconds) {
        // REDIS-DISABLED: was redisTemplate.opsForValue().set(key(email), otp, ttlSeconds, TimeUnit.SECONDS). Re-enable: restore Redis set; remove in-memory put.
        // redisTemplate.opsForValue().set(key(email), otp, ttlSeconds, TimeUnit.SECONDS);
        store.put(key(email), new Entry(otp, System.currentTimeMillis() + ttlSeconds * 1000L));
    }

    @Override
    public Optional<String> get(String email) {
        // REDIS-DISABLED: was redisTemplate.opsForValue().get(key(email)). Re-enable: restore Redis get; remove in-memory lookup below.
        // return Optional.ofNullable(redisTemplate.opsForValue().get(key(email)));
        Entry entry = store.get(key(email));
        if (entry == null) {
            return Optional.empty();
        }
        if (System.currentTimeMillis() > entry.expiresAtMs) {
            store.remove(key(email));
            return Optional.empty();
        }
        return Optional.of(entry.otp);
    }

    @Override
    public void delete(String email) {
        // REDIS-DISABLED: was redisTemplate.delete(key(email)). Re-enable: restore Redis delete; remove in-memory remove.
        // redisTemplate.delete(key(email));
        store.remove(key(email));
    }

    private String key(String email) {
        return KEY_PREFIX + email;
    }

    private static final class Entry {
        private final String otp;
        private final long expiresAtMs;

        private Entry(String otp, long expiresAtMs) {
            this.otp = otp;
            this.expiresAtMs = expiresAtMs;
        }
    }
}
