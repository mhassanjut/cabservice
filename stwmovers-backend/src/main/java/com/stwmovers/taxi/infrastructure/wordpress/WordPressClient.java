package com.stwmovers.taxi.infrastructure.wordpress;

import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import com.fasterxml.jackson.databind.JsonNode;

@Component
public class WordPressClient {

    private static final Logger log = LoggerFactory.getLogger(WordPressClient.class);
    private static final ParameterizedTypeReference<List<JsonNode>> POST_LIST = new ParameterizedTypeReference<>() {};

    private final RestClient wordpressRestClient;

    public WordPressClient(@Qualifier("wordpressRestClient") RestClient wordpressRestClient) {
        this.wordpressRestClient = wordpressRestClient;
    }

    public List<JsonNode> fetchPostsBySlug(String slug) {
        return fetchPosts(1, 1, slug);
    }

    public List<JsonNode> fetchPosts(int page, int perPage) {
        return fetchPosts(page, perPage, null);
    }

    private List<JsonNode> fetchPosts(int page, int perPage, String slug) {
        try {
            return wordpressRestClient.get()
                    .uri(uriBuilder -> {
                        var b = uriBuilder
                                .path("/wp-json/wp/v2/posts")
                                .queryParam("page", page)
                                .queryParam("per_page", perPage)
                                .queryParam("_embed", true);
                        if (slug != null && !slug.isBlank()) {
                            b.queryParam("slug", slug);
                        }
                        return b.build();
                    })
                    .retrieve()
                    .body(POST_LIST);
        } catch (RestClientResponseException ex) {
            log.warn("WordPress REST error: status={} slug={}", ex.getStatusCode().value(), slug);
            throw ex;
        } catch (RestClientException ex) {
            log.warn("WordPress REST request failed: {}", ex.getMessage());
            throw ex;
        }
    }

    public static List<JsonNode> emptyIfNull(List<JsonNode> posts) {
        return posts == null ? Collections.emptyList() : posts;
    }
}
