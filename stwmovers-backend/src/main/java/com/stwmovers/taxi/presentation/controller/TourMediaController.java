package com.stwmovers.taxi.presentation.controller;

import java.nio.file.Files;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stwmovers.taxi.application.service.TourImageStorageService;

@RestController
@RequestMapping("/api/v1/media/tours")
public class TourMediaController {

    private final TourImageStorageService tourImageStorageService;

    public TourMediaController(TourImageStorageService tourImageStorageService) {
        this.tourImageStorageService = tourImageStorageService;
    }

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getTourImage(@PathVariable String filename) throws Exception {
        var path = tourImageStorageService.resolveStoredFile(filename);
        String mediaType = tourImageStorageService.mediaTypeForFilename(filename);
        Resource resource = new FileSystemResource(path);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mediaType))
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .contentLength(Files.size(path))
                .body(resource);
    }
}
