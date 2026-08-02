package com.stwmovers.taxi.application.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;

import com.fasterxml.jackson.databind.JsonNode;
import com.stwmovers.taxi.application.dto.response.BlogPostDetailResponse;
import com.stwmovers.taxi.application.dto.response.BlogPostResponse;
import com.stwmovers.taxi.exception.ResourceNotFoundException;
import com.stwmovers.taxi.infrastructure.wordpress.BlogPostMapper;
import com.stwmovers.taxi.infrastructure.wordpress.WordPressClient;

@Service
public class BlogService {

    private static final Logger log = LoggerFactory.getLogger(BlogService.class);

    private final WordPressClient wordPressClient;
    private final BlogPostMapper blogPostMapper;
    private final BlogSeoService blogSeoService;
    private final BlogCacheService blogCacheService;

    public BlogService(
            WordPressClient wordPressClient,
            BlogPostMapper blogPostMapper,
            BlogSeoService blogSeoService,
            BlogCacheService blogCacheService) {
        this.wordPressClient = wordPressClient;
        this.blogPostMapper = blogPostMapper;
        this.blogSeoService = blogSeoService;
        this.blogCacheService = blogCacheService;
    }

    public BlogPostDetailResponse getBySlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new ResourceNotFoundException("Article not found");
        }

        return blogCacheService.getDetail(slug).orElseGet(() -> loadDetail(slug));
    }

    public List<BlogPostResponse> listPosts(int page, int perPage) {
        int safePage = Math.max(page, 1);
        int safePerPage = Math.min(Math.max(perPage, 1), 50);

        return blogCacheService
                .getList(safePage, safePerPage)
                .orElseGet(() -> loadList(safePage, safePerPage));
    }

    private BlogPostDetailResponse loadDetail(String slug) {
        try {
            List<JsonNode> nodes = WordPressClient.emptyIfNull(wordPressClient.fetchPostsBySlug(slug));
            if (nodes.isEmpty()) {
                throw new ResourceNotFoundException("Article not found");
            }
            BlogPostResponse post = blogPostMapper.map(nodes.getFirst());
            var seo = blogSeoService.resolveForPost(post, slug);
            BlogPostDetailResponse detail = BlogPostDetailResponse.builder()
                    .post(post)
                    .seo(seo)
                    .build();
            blogCacheService.putDetail(slug, detail);
            return detail;
        } catch (ResourceNotFoundException ex) {
            throw ex;
        } catch (RestClientResponseException ex) {
            log.error("WordPress error loading slug={}: {}", slug, ex.getMessage());
            throw ex;
        }
    }

    private List<BlogPostResponse> loadList(int page, int perPage) {
        try {
            List<JsonNode> nodes = WordPressClient.emptyIfNull(wordPressClient.fetchPosts(page, perPage));
            List<BlogPostResponse> posts = new ArrayList<>();
            for (JsonNode node : nodes) {
                BlogPostResponse mapped = blogPostMapper.map(node);
                if (mapped != null) {
                    posts.add(mapped);
                }
            }
            blogCacheService.putList(page, perPage, posts);
            return posts;
        } catch (RestClientResponseException ex) {
            log.error("WordPress error loading blog list page={}: {}", page, ex.getMessage());
            throw ex;
        }
    }
}
