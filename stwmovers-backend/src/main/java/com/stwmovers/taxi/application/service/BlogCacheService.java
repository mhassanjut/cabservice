package com.stwmovers.taxi.application.service;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.stwmovers.taxi.application.dto.response.BlogPostDetailResponse;
import com.stwmovers.taxi.application.dto.response.BlogPostResponse;
import com.stwmovers.taxi.config.AppProperties;

@Service
public class BlogCacheService {

    private final Cache<String, BlogPostDetailResponse> detailCache;
    private final Cache<String, List<BlogPostResponse>> listCache;

    public BlogCacheService(AppProperties appProperties) {
        Duration ttl = appProperties.getWordpress().getCacheTtl();
        detailCache = Caffeine.newBuilder()
                .expireAfterWrite(ttl)
                .maximumSize(500)
                .build();
        listCache = Caffeine.newBuilder()
                .expireAfterWrite(ttl)
                .maximumSize(100)
                .build();
    }

    public Optional<BlogPostDetailResponse> getDetail(String slug) {
        return Optional.ofNullable(detailCache.getIfPresent(detailKey(slug)));
    }

    public void putDetail(String slug, BlogPostDetailResponse detail) {
        detailCache.put(detailKey(slug), detail);
    }

    public Optional<List<BlogPostResponse>> getList(int page, int perPage) {
        return Optional.ofNullable(listCache.getIfPresent(listKey(page, perPage)));
    }

    public void putList(int page, int perPage, List<BlogPostResponse> posts) {
        listCache.put(listKey(page, perPage), posts);
    }

    public void evictDetail(String slug) {
        detailCache.invalidate(detailKey(slug));
    }

    public void evictAllLists() {
        listCache.invalidateAll();
    }

    public void evictAll() {
        detailCache.invalidateAll();
        listCache.invalidateAll();
    }

    private static String detailKey(String slug) {
        return "detail:" + slug;
    }

    private static String listKey(int page, int perPage) {
        return "list:" + page + ":" + perPage;
    }
}
