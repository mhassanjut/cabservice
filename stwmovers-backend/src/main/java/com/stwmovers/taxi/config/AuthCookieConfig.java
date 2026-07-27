package com.stwmovers.taxi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.stwmovers.taxi.infrastructure.security.AuthCookieService;

@Configuration
public class AuthCookieConfig {

    @Bean
    AuthCookieService authCookieService(AppProperties appProperties) {
        return new AuthCookieService(appProperties);
    }
}
