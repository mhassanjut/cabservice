package com.stwmovers.taxi.infrastructure.wordpress;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Component
public class RankMathClient {

    private static final Logger log = LoggerFactory.getLogger(RankMathClient.class);

    private final RestClient wordpressRestClient;

    public RankMathClient(@Qualifier("wordpressRestClient") RestClient wordpressRestClient) {
        this.wordpressRestClient = wordpressRestClient;
    }

    public String fetchHeadHtml(String absolutePostUrl) {
        try {
            RankMathHeadPayload payload = wordpressRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/wp-json/rankmath/v1/getHead")
                            .queryParam("url", absolutePostUrl)
                            .build())
                    .retrieve()
                    .body(RankMathHeadPayload.class);
            if (payload == null || !payload.success() || payload.head() == null || payload.head().isBlank()) {
                throw new RankMathUnavailableException("Rank Math returned empty head for " + absolutePostUrl);
            }
            return payload.head();
        } catch (RestClientException ex) {
            log.warn("Rank Math getHead failed for {}: {}", absolutePostUrl, ex.getMessage());
            throw new RankMathUnavailableException(ex.getMessage(), ex);
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record RankMathHeadPayload(boolean success, String head) {}

    public static class RankMathUnavailableException extends RuntimeException {
        public RankMathUnavailableException(String message) {
            super(message);
        }

        public RankMathUnavailableException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
