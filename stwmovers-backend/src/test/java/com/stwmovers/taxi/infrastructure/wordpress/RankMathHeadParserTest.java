package com.stwmovers.taxi.infrastructure.wordpress;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.context.annotation.Import;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stwmovers.taxi.application.dto.response.ParsedSeoResponse;

@JsonTest
@Import({RankMathHeadParser.class, ObjectMapper.class})
class RankMathHeadParserTest {

    @Autowired
    private RankMathHeadParser parser;

    @Test
    void parsesDynamicMetaOgTwitterArticleAndSchema() throws Exception {
        String raw = new String(getClass().getResourceAsStream("/rankmath/sample-head.html").readAllBytes());
        ParsedSeoResponse seo = parser.parse(raw);

        assertThat(seo.getTitle()).isEqualTo("Sample Article Title");
        assertThat(seo.getCanonical()).isEqualTo("https://cms.example.com/sample-post/");
        assertThat(seo.getMeta()).containsEntry("description", "Sample description");
        assertThat(seo.getMeta()).containsEntry("robots", "index, follow");
        assertThat(seo.getMeta()).containsEntry("rank-math-foo", "future-tag");
        assertThat(seo.getOg()).containsEntry("title", "OG Title");
        assertThat(seo.getArticle()).containsEntry("published_time", "2026-01-01T00:00:00+00:00");
        assertThat(seo.getTwitter()).containsEntry("card", "summary_large_image");
        assertThat(seo.getSchema()).hasSize(2);
        assertThat(seo.getSchema().get(0).get("@type").asText()).isEqualTo("BlogPosting");
        assertThat(seo.getRawHead()).isEqualTo(raw);
    }
}
