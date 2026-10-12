package com.stwmovers.taxi.application.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import org.junit.jupiter.api.Test;
import com.fasterxml.jackson.databind.ObjectMapper;

class BookingAttributionServiceTest {
    private final ObjectMapper mapper = new ObjectMapper();
    private final BookingAttributionService service = new BookingAttributionService(mapper);

    @Test
    void requiresConsent() {
        assertThat(service.serialize(null)).isNull();
        assertThat(service.serialize(Map.of("gclid", "click-id"))).isNull();
        assertThat(service.serialize(Map.of("consent", "denied", "gclid", "click-id"))).isNull();
    }

    @Test
    void storesOnlyBoundedCampaignFields() throws Exception {
        var data = mapper.readTree(service.serialize(Map.of(
                "consent", "granted", "gclid", " click-id ", "utm_campaign", "x".repeat(700),
                "email", "private@example.com", "landing_page", "/landing/airport?email=private#form",
                "referrer", "https://example.com/path?email=private")));
        assertThat(data.get("gclid").asText()).isEqualTo("click-id");
        assertThat(data.get("utm_campaign").asText()).hasSize(500);
        assertThat(data.get("landing_page").asText()).isEqualTo("/landing/airport");
        assertThat(data.get("referrer").asText()).isEqualTo("https://example.com");
        assertThat(data.has("email")).isFalse();
    }

    @Test
    void rejectsUnsafeUrlsAndEmptyData() {
        assertThat(service.serialize(Map.of("consent", "granted", "landing_page", "//example.com",
                "referrer", "javascript:alert(1)"))).isNull();
    }
}
