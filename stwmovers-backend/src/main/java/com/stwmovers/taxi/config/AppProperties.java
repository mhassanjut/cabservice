package com.stwmovers.taxi.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Cors cors = new Cors();
    private Jwt jwt = new Jwt();
    private BarcelonaBounds barcelona = new BarcelonaBounds();
    private Fare fare = new Fare();
    private Otp otp = new Otp();
    private Stripe stripe = new Stripe();
    private Google google = new Google();
    private Admin admin = new Admin();
    private RateLimit rateLimit = new RateLimit();
    private Uploads uploads = new Uploads();

    @Getter
    @Setter
    public static class Uploads {
        private String carsDir = "uploads/cars";
    }

    @Getter
    @Setter
    public static class RateLimit {
        private boolean enabled = true;
        private int maxRequestsPerMinute = 300;
    }

    @Getter
    @Setter
    public static class Cors {
        private List<String> allowedOrigins = List.of("http://localhost:3000");
    }

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private long expirationMs = 86400000L;
    }

    @Getter
    @Setter
    public static class BarcelonaBounds {
        private double minLat = 41.270;
        private double maxLat = 41.469;
        private double minLng = 2.052;
        private double maxLng = 2.228;
    }

    @Getter
    @Setter
    public static class Fare {
        private int inCityBaseKm = 27;
        private BigDecimal inCityExtraEurPerKm = new BigDecimal("1");
    }

    @Getter
    @Setter
    public static class Otp {
        private long ttlSeconds = 600;
        private int length = 6;
    }

    @Getter
    @Setter
    public static class Stripe {
        private String apiKey;
        private String webhookSecret;
        private String successUrl;
        private String cancelUrl;
    }

    @Getter
    @Setter
    public static class Google {
        private String clientId;
    }

    @Getter
    @Setter
    public static class Admin {
        private String email = "admin@stwmovers.com";
        private String password = "Admin@12345";
    }
}
