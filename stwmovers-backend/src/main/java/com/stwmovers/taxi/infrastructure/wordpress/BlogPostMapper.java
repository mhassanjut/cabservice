package com.stwmovers.taxi.infrastructure.wordpress;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stwmovers.taxi.application.dto.response.BlogPostResponse;

@Component
public class BlogPostMapper {

    private final ObjectMapper objectMapper;

    public BlogPostMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public BlogPostResponse map(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }
        BlogPostResponse.RenderedField title = rendered(node.get("title"));
        BlogPostResponse.RenderedField excerpt = rendered(node.get("excerpt"));
        BlogPostResponse.RenderedField content = rendered(node.get("content"));

        Map<String, Object> embedded = null;
        JsonNode embedNode = node.get("_embedded");
        if (embedNode != null && !embedNode.isNull()) {
            embedded = objectMapper.convertValue(embedNode, Map.class);
        }

        return BlogPostResponse.builder()
                .id(node.path("id").asLong())
                .date(textOrNull(node.get("date")))
                .modified(textOrNull(node.get("modified")))
                .slug(textOrNull(node.get("slug")))
                .link(textOrNull(node.get("link")))
                .title(title)
                .excerpt(excerpt)
                .content(content)
                .embedded(embedded)
                .build();
    }

    private static BlogPostResponse.RenderedField rendered(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }
        String rendered = textOrNull(node.get("rendered"));
        return BlogPostResponse.RenderedField.builder().rendered(rendered).build();
    }

    private static String textOrNull(JsonNode node) {
        if (node == null || node.isNull() || node.isMissingNode()) {
            return null;
        }
        return node.asText(null);
    }

    /** Strip HTML tags for fallback SEO descriptions. */
    public static String plainText(String html) {
        if (html == null || html.isBlank()) {
            return "";
        }
        return html.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();
    }
}
