package com.stwmovers.taxi.presentation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stwmovers.taxi.application.dto.response.BlogPostDetailResponse;
import com.stwmovers.taxi.application.dto.response.BlogPostResponse;
import com.stwmovers.taxi.application.service.BlogCacheService;
import com.stwmovers.taxi.application.service.BlogService;
import com.stwmovers.taxi.config.ApiResponse;

/** Public blog content and Rank Math SEO for the Nuxt marketing site. */
@RestController
@RequestMapping("/api/v1/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BlogPostResponse>>> listPosts(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "per_page", defaultValue = "12") int perPage) {
        return ResponseEntity.ok(ApiResponse.ok(blogService.listPosts(page, perPage)));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<BlogPostDetailResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(blogService.getBySlug(slug)));
    }
}
