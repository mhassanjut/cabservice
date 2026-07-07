package com.stwmovers.taxi.util;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

public final class CityNameUtils {

    public static final List<String> SUPPORTED_PICKUP_CITIES = List.of("Barcelona", "Tarragona", "Girona");

    /** Barcelona + El Prat (08820) + BCN airport — matches app.barcelona in application.yml */
    private static final double BARCELONA_MIN_LAT = 41.270;
    private static final double BARCELONA_MAX_LAT = 41.469;
    private static final double BARCELONA_MIN_LNG = 2.052;
    private static final double BARCELONA_MAX_LNG = 2.228;

    private static final Map<String, String> BARCELONA_PICKUP_ALIASES = Map.ofEntries(
            Map.entry("el prat de llobregat", "Barcelona"),
            Map.entry("hospitalet de llobregat", "Barcelona"),
            Map.entry("l'hospitalet de llobregat", "Barcelona"),
            Map.entry("cornella de llobregat", "Barcelona"),
            Map.entry("sant boi de llobregat", "Barcelona"),
            Map.entry("castelldefels", "Barcelona"));

    private CityNameUtils() {
    }

    public static String normalize(String city) {
        if (city == null || city.isBlank()) {
            return null;
        }
        String trimmed = city.trim();
        int comma = trimmed.indexOf(',');
        if (comma > 0) {
            trimmed = trimmed.substring(0, comma).trim();
        }
        return stripAccents(trimmed);
    }

    public static boolean isWithinBarcelonaPickupZone(double lat, double lng) {
        return lat >= BARCELONA_MIN_LAT
                && lat <= BARCELONA_MAX_LAT
                && lng >= BARCELONA_MIN_LNG
                && lng <= BARCELONA_MAX_LNG;
    }

    /**
     * Resolves a supported pickup hub using city name, known aliases, or Barcelona metro coordinates.
     */
    public static String resolvePickupCity(String city, Double lat, Double lng) {
        String fromName = resolveSupportedPickupCity(city);
        if (fromName != null) {
            return fromName;
        }

        String normalized = normalize(city);
        if (normalized != null) {
            String alias = BARCELONA_PICKUP_ALIASES.get(normalized.toLowerCase(Locale.ROOT));
            if (alias != null) {
                return alias;
            }
        }

        if (lat != null && lng != null && isWithinBarcelonaPickupZone(lat, lng)) {
            return "Barcelona";
        }

        return null;
    }

    public static boolean isValidPickupCity(String city, Double lat, Double lng) {
        return resolvePickupCity(city, lat, lng) != null;
    }

    public static boolean isSupportedPickupCity(String city) {
        return resolveSupportedPickupCity(city) != null;
    }

    public static String resolveSupportedPickupCity(String city) {
        String normalized = normalize(city);
        if (normalized == null) {
            return null;
        }
        return SUPPORTED_PICKUP_CITIES.stream()
                .filter(supported -> stripAccents(supported).equalsIgnoreCase(normalized))
                .findFirst()
                .orElse(null);
    }

    public static boolean citiesMatch(String a, String b) {
        String left = normalize(a);
        String right = normalize(b);
        if (left == null || right == null) {
            return false;
        }
        return left.equalsIgnoreCase(right);
    }

    public static Optional<String> findSupportedPickupCity(String city) {
        return Optional.ofNullable(resolveSupportedPickupCity(city));
    }

    private static String stripAccents(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}+", "");
    }
}
