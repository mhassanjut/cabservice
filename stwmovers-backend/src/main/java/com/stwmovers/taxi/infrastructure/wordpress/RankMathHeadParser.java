package com.stwmovers.taxi.infrastructure.wordpress;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stwmovers.taxi.application.dto.response.ParsedSeoResponse;

@Component
public class RankMathHeadParser {

    private static final Logger log = LoggerFactory.getLogger(RankMathHeadParser.class);

    private final ObjectMapper objectMapper;

    public RankMathHeadParser(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public ParsedSeoResponse parse(String rawHead) {
        if (rawHead == null || rawHead.isBlank()) {
            return ParsedSeoResponse.builder().rawHead(rawHead).build();
        }

        Document doc = Jsoup.parse(rawHead);

        Map<String, Object> meta = new LinkedHashMap<>();
        Map<String, Object> og = new LinkedHashMap<>();
        Map<String, Object> twitter = new LinkedHashMap<>();
        Map<String, Object> article = new LinkedHashMap<>();
        Map<String, Object> properties = new LinkedHashMap<>();
        Map<String, Object> links = new LinkedHashMap<>();
        List<JsonNode> schema = new ArrayList<>();

        String title = doc.selectFirst("title") != null ? doc.selectFirst("title").text() : null;
        String canonical = null;

        for (Element link : doc.select("link[rel]")) {
            String rel = link.attr("rel").trim().toLowerCase(Locale.ROOT);
            String href = firstNonBlank(link.attr("href"), link.attr("abs:href"));
            if (href == null || href.isBlank()) {
                continue;
            }
            if ("canonical".equals(rel)) {
                canonical = href;
            } else {
                TagBuckets.put(links, rel, href);
            }
        }

        for (Element metaEl : doc.select("meta")) {
            if (metaEl.hasAttr("charset")) {
                TagBuckets.put(meta, "charset", metaEl.attr("charset"));
                continue;
            }
            String httpEquiv = metaEl.attr("http-equiv");
            if (!httpEquiv.isBlank()) {
                TagBuckets.put(meta, httpEquiv.toLowerCase(Locale.ROOT), metaEl.attr("content"));
                continue;
            }
            String property = metaEl.attr("property");
            String name = metaEl.attr("name");
            String content = metaEl.attr("content");
            if (property.isBlank() && name.isBlank()) {
                continue;
            }
            if (!property.isBlank()) {
                routeProperty(property, content, og, article, properties);
            } else {
                routeName(name, content, meta, twitter);
            }
        }

        for (Element script : doc.select("script[type=application/ld+json]")) {
            String json = script.html();
            if (json == null || json.isBlank()) {
                continue;
            }
            try {
                JsonNode node = objectMapper.readTree(json);
                schema.add(node);
            } catch (Exception ex) {
                log.warn("Skipping invalid JSON-LD block: {}", ex.getMessage());
            }
        }

        return ParsedSeoResponse.builder()
                .title(title)
                .canonical(canonical)
                .meta(meta)
                .og(og)
                .twitter(twitter)
                .article(article)
                .properties(properties)
                .links(links)
                .schema(schema.isEmpty() ? null : schema)
                .rawHead(rawHead)
                .build();
    }

    private static void routeProperty(
            String property,
            String content,
            Map<String, Object> og,
            Map<String, Object> article,
            Map<String, Object> properties) {
        String lower = property.toLowerCase(Locale.ROOT);
        if (lower.startsWith("og:")) {
            TagBuckets.put(og, lower.substring(3), content);
        } else if (lower.startsWith("article:")) {
            TagBuckets.put(article, lower.substring(8), content);
        } else {
            TagBuckets.put(properties, property, content);
        }
    }

    private static void routeName(String name, String content, Map<String, Object> meta, Map<String, Object> twitter) {
        String lower = name.toLowerCase(Locale.ROOT);
        if (lower.startsWith("twitter:")) {
            TagBuckets.put(twitter, lower.substring(8), content);
        } else {
            TagBuckets.put(meta, name, content);
        }
    }

    private static String firstNonBlank(String... values) {
        for (String v : values) {
            if (v != null && !v.isBlank()) {
                return v;
            }
        }
        return null;
    }

    static final class TagBuckets {
        private TagBuckets() {}

        static void put(Map<String, Object> bucket, String key, String value) {
            if (key == null || key.isBlank() || value == null) {
                return;
            }
            Object existing = bucket.get(key);
            if (existing == null) {
                bucket.put(key, value);
                return;
            }
            if (existing instanceof String first) {
                List<String> list = new ArrayList<>();
                list.add(first);
                list.add(value);
                bucket.put(key, list);
                return;
            }
            if (existing instanceof List<?> list) {
                @SuppressWarnings("unchecked")
                List<String> strings = (List<String>) list;
                strings.add(value);
            }
        }
    }
}
