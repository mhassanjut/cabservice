package com.stwmovers.taxi.presentation.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stwmovers.taxi.application.dto.request.TourCarsRequest;
import com.stwmovers.taxi.application.dto.response.CarWithFareResponse;
import com.stwmovers.taxi.application.dto.response.PagedResponse;
import com.stwmovers.taxi.application.dto.response.TourResponse;
import com.stwmovers.taxi.application.service.TourCatalogService;
import com.stwmovers.taxi.application.service.TourPricingService;
import com.stwmovers.taxi.config.ApiResponse;

/** Public, read-only tour catalogue consumed by the marketing site's Tours page. */
@RestController
@RequestMapping("/api/v1/tours")
public class TourController {

    private final TourCatalogService tourCatalogService;
    private final TourPricingService tourPricingService;

    public TourController(TourCatalogService tourCatalogService, TourPricingService tourPricingService) {
        this.tourCatalogService = tourCatalogService;
        this.tourPricingService = tourPricingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TourResponse>>> listTours() {
        return ResponseEntity.ok(ApiResponse.ok(tourCatalogService.listActiveTours()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TourResponse>> getTour(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(tourCatalogService.getPublicTour(id)));
    }

    @PostMapping("/{id}/cars")
    public ResponseEntity<ApiResponse<PagedResponse<CarWithFareResponse>>> listCarsForTour(
            @PathVariable UUID id,
            @RequestBody(required = false) TourCarsRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(tourPricingService.listCarsWithFare(id, request)));
    }
}
