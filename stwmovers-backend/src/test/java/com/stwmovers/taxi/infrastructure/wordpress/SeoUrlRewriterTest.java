package com.stwmovers.taxi.infrastructure.wordpress;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.stwmovers.taxi.application.dto.response.ParsedSeoResponse;

class SeoUrlRewriterTest {

    private final SeoUrlRewriter rewriter = new SeoUrlRewriter();

    @Test
    void rewritesCanonicalOgAndSchemaUrls() {
        ParsedSeoResponse seo = ParsedSeoResponse.builder()
                .canonical("https://cms.example.com/post/")
                .build();
        seo.getOg().put("url", "https://cms.example.com/post/");
        seo.setSchema(java.util.List.of(
                new com.fasterxml.jackson.databind.ObjectMapper()
                        .createObjectNode()
                        .put("url", "https://cms.example.com/post/")));

        rewriter.rewriteToPublicSite(
                seo,
                "https://cms.example.com/post/",
                "https://stwmovers.com/blogs/post");

        assertThat(seo.getCanonical()).isEqualTo("https://stwmovers.com/blogs/post");
        assertThat(seo.getOg().get("url")).isEqualTo("https://stwmovers.com/blogs/post");
        assertThat(seo.getSchema().get(0).get("url").asText()).isEqualTo("https://stwmovers.com/blogs/post");
    }
}
