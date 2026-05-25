package com.stwmovers.taxi.infrastructure.otp;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.stwmovers.taxi.application.port.OtpStore;

@Component
public class RedisOtpStore implements OtpStore {

    private static final String KEY_PREFIX = "otp:";

    private final StringRedisTemplate redisTemplate;

    public RedisOtpStore(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void save(String email, String otp, long ttlSeconds) {
        redisTemplate.opsForValue().set(key(email), otp, ttlSeconds, TimeUnit.SECONDS);
    }

    @Override
    public Optional<String> get(String email) {
        return Optional.ofNullable(redisTemplate.opsForValue().get(key(email)));
    }

    @Override
    public void delete(String email) {
        redisTemplate.delete(key(email));
    }

    private String key(String email) {
        return KEY_PREFIX + email;
    }
}
