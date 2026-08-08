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
    private Cookie cookie = new Cookie();
    private Security security = new Security();
    private BarcelonaBounds barcelona = new BarcelonaBounds();
    private Fare fare = new Fare();
    private Otp otp = new Otp();
    private Stripe stripe = new Stripe();
    private Google google = new Google();
    private Admin admin = new Admin();
    private RateLimit rateLimit = new RateLimit();
    private Uploads uploads = new Uploads();
    private Wordpress wordpress = new Wordpress();
    private Site site = new Site();

    @Getter
    @Setter
    public static class Site {
        private String publicUrl = "https://stwmovers.com";
        private String contactPhoneDisplay = "+34 627 408 522";
        private String contactEmail = "fleetvtc2025@gmail.com";
        private String fleetAlertEmail = "fleetvtc2025@gmail.com";
        private String contactAddress = "Carrer de Rocafort, 20, Eixample, 08015 Barcelona, Spain";
        private String whatsappNumber = "34627408522";
    }

    @Getter
    @Setter
    public static class Uploads {
        private String carsDir = "uploads/cars";
        private String toursDir = "uploads/tours";
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
        private long accessExpirationMs = 86400000L;
        private long refreshExpirationMs = 604800000L;

        public long getAccessExpirationMs() {
            return accessExpirationMs > 0 ? accessExpirationMs : expirationMs;
        }
    }

    @Getter
    @Setter
    public static class Cookie {
        private boolean secure = false;
    }

    @Getter
    @Setter
    public static class Security {
        private boolean csrfEnabled = false;
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

    @Getter
    @Setter
    public static class Wordpress {
        /** Headless WordPress base URL (no trailing slash). */
        private String baseUrl = "https://cms.stwmovers.com";
        /** Public marketing site URL for canonical / Open Graph rewrites. */
        private String publicSiteUrl = "https://stwmovers.com";
        /** Path prefix on the Nuxt site for blog articles. */
        private String blogPathPrefix = "/blogs";
        /** Cache TTL for blog list and detail responses. */
        private java.time.Duration cacheTtl = java.time.Duration.ofMinutes(15);
        private int connectTimeoutMs = 3000;
        private int readTimeoutMs = 15000;
    }
}
