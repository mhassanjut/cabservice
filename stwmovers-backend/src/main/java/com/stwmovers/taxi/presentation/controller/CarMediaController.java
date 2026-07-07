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

import com.stwmovers.taxi.application.service.CarImageStorageService;

@RestController
@RequestMapping("/api/v1/media/cars")
public class CarMediaController {

    private final CarImageStorageService carImageStorageService;

    public CarMediaController(CarImageStorageService carImageStorageService) {
        this.carImageStorageService = carImageStorageService;
    }

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getCarImage(@PathVariable String filename) throws Exception {
        var path = carImageStorageService.resolveStoredFile(filename);
        String mediaType = carImageStorageService.mediaTypeForFilename(filename);
        Resource resource = new FileSystemResource(path);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mediaType))
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .contentLength(Files.size(path))
                .body(resource);
    }
}
