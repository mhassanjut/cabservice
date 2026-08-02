package com.stwmovers.taxi.application.dto.response;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Value;

/** WordPress post shape consumed by the Nuxt blog UI (compatible with wp/v2/posts). */
@Value
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BlogPostResponse {

    long id;
    String date;
    String modified;
    String slug;
    String link;
    RenderedField title;
    RenderedField excerpt;
    RenderedField content;

    @JsonProperty("_embedded")
    Map<String, Object> embedded;

    @Value
    @Builder
    public static class RenderedField {
        String rendered;
    }
}
