package com.stwmovers.taxi.application.service;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class BookingAttributionService {
    private static final Set<String> ALLOWED = Set.of("gclid", "gbraid", "wbraid", "utm_source", "utm_medium",
            "utm_campaign", "utm_id", "utm_content", "utm_term", "landing_page", "referrer", "attribution_captured_at");
    private final ObjectMapper mapper;

    public BookingAttributionService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public String serialize(Map<String, String> input) {
        if (input == null || !"granted".equals(input.get("consent"))) return null;
        Map<String, String> values = new LinkedHashMap<>();
        for (String key : ALLOWED) {
            String raw = input.get(key);
            if (raw == null) continue;
            String value = raw.replaceAll("[\\p{Cntrl}]", "").strip();
            if (value.length() > 500) value = value.substring(0, 500);
            if (key.equals("landing_page")) {
                if (!value.startsWith("/") || value.startsWith("//")) continue;
                value = value.split("[?#]", 2)[0];
            }
            if (key.equals("referrer")) {
                try {
                    URI uri = URI.create(value);
                    if (uri.getHost() == null || !("https".equals(uri.getScheme()) || "http".equals(uri.getScheme()))) continue;
                    value = uri.getScheme() + "://" + uri.getHost();
                } catch (IllegalArgumentException ignored) {
                    continue;
                }
            }
            if (!value.isBlank()) values.put(key, value);
        }
        if (values.isEmpty()) return null;
        values.put("consent", "granted");
        try {
            return mapper.writeValueAsString(values);
        } catch (JsonProcessingException ignored) {
            // Optional acquisition data must not prevent a booking.
            return null;
        }
    }
}
