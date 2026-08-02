package com.stwmovers.taxi.config;

import java.time.Duration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class WordPressClientConfig {

    @Bean(name = "wordpressRestClient")
    RestClient wordpressRestClient(AppProperties appProperties) {
        AppProperties.Wordpress wp = appProperties.getWordpress();
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofMillis(wp.getConnectTimeoutMs()));
        factory.setReadTimeout(Duration.ofMillis(wp.getReadTimeoutMs()));

        String baseUrl = wp.getBaseUrl().replaceAll("/$", "");
        return RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .build();
    }
}
