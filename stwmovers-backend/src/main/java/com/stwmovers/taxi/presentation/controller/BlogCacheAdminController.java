package com.stwmovers.taxi.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stwmovers.taxi.application.service.BlogCacheService;
import com.stwmovers.taxi.config.ApiResponse;

@RestController
@RequestMapping("/api/v1/admin/blogs/cache")
public class BlogCacheAdminController {

    private final BlogCacheService blogCacheService;

    public BlogCacheAdminController(BlogCacheService blogCacheService) {
        this.blogCacheService = blogCacheService;
    }

    @PostMapping("/evict")
    public ResponseEntity<ApiResponse<Void>> evictCache(@RequestParam(required = false) String slug) {
        if (slug != null && !slug.isBlank()) {
            blogCacheService.evictDetail(slug);
            blogCacheService.evictAllLists();
        } else {
            blogCacheService.evictAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
