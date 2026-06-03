package com.stwmovers.taxi.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stwmovers.taxi.application.dto.request.CarsWithFareRequest;
import com.stwmovers.taxi.application.dto.response.PagedResponse;
import com.stwmovers.taxi.application.dto.response.CarWithFareResponse;
import com.stwmovers.taxi.application.service.CarCatalogService;
import com.stwmovers.taxi.config.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/rides")
public class RideController {

    private final CarCatalogService carCatalogService;

    public RideController(CarCatalogService carCatalogService) {
        this.carCatalogService = carCatalogService;
    }

    @PostMapping("/cars")
    public ResponseEntity<ApiResponse<PagedResponse<CarWithFareResponse>>> listCarsWithFare(
            @Valid @RequestBody CarsWithFareRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(carCatalogService.listCarsWithFare(request)));
    }
}
