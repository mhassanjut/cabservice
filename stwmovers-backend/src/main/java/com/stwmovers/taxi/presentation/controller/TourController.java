package com.stwmovers.taxi.presentation.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stwmovers.taxi.application.dto.response.TourResponse;
import com.stwmovers.taxi.application.service.TourCatalogService;
import com.stwmovers.taxi.config.ApiResponse;

/** Public, read-only tour catalogue consumed by the marketing site's Tours page. */
@RestController
@RequestMapping("/api/v1/tours")
public class TourController {

    private final TourCatalogService tourCatalogService;

    public TourController(TourCatalogService tourCatalogService) {
        this.tourCatalogService = tourCatalogService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TourResponse>>> listTours() {
        return ResponseEntity.ok(ApiResponse.ok(tourCatalogService.listActiveTours()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TourResponse>> getTour(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(tourCatalogService.getPublicTour(id)));
    }
}
