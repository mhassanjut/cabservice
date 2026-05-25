package com.stwmovers.taxi.presentation.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stwmovers.taxi.application.dto.request.AdminCarRequest;
import com.stwmovers.taxi.application.dto.request.AdminDriverRequest;
import com.stwmovers.taxi.application.dto.request.AssignDriverRequest;
import com.stwmovers.taxi.application.dto.request.CityRoutePricingRequest;
import com.stwmovers.taxi.application.dto.request.CreateDriverUserRequest;
import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.application.dto.response.CarResponse;
import com.stwmovers.taxi.application.dto.response.CityRoutePricingResponse;
import com.stwmovers.taxi.application.dto.response.DashboardStatsResponse;
import com.stwmovers.taxi.application.dto.response.DriverResponse;
import com.stwmovers.taxi.application.dto.response.PagedResponse;
import com.stwmovers.taxi.application.service.AdminDashboardService;
import com.stwmovers.taxi.application.service.BookingService;
import com.stwmovers.taxi.application.service.CarCatalogService;
import com.stwmovers.taxi.config.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminDashboardService adminDashboardService;
    private final CarCatalogService carCatalogService;
    private final BookingService bookingService;

    public AdminController(
            AdminDashboardService adminDashboardService,
            CarCatalogService carCatalogService,
            BookingService bookingService) {
        this.adminDashboardService = adminDashboardService;
        this.carCatalogService = carCatalogService;
        this.bookingService = bookingService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> dashboard() {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.getDashboardStats()));
    }

    @GetMapping("/cars")
    public ResponseEntity<ApiResponse<List<CarResponse>>> listCars() {
        return ResponseEntity.ok(ApiResponse.ok(carCatalogService.listAllCars()));
    }

    @PostMapping("/cars")
    public ResponseEntity<ApiResponse<CarResponse>> createCar(@Valid @RequestBody AdminCarRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(carCatalogService.createCar(request)));
    }

    @PutMapping("/cars/{id}")
    public ResponseEntity<ApiResponse<CarResponse>> updateCar(
            @PathVariable UUID id, @Valid @RequestBody AdminCarRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(carCatalogService.updateCar(id, request)));
    }

    @DeleteMapping("/cars/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable UUID id) {
        carCatalogService.deleteCar(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/drivers")
    public ResponseEntity<ApiResponse<List<DriverResponse>>> listDrivers() {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.listDrivers()));
    }

    @PostMapping("/drivers")
    public ResponseEntity<ApiResponse<DriverResponse>> createDriver(
            @Valid @RequestBody CreateDriverUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(adminDashboardService.createDriver(request)));
    }

    @PostMapping("/drivers/link")
    public ResponseEntity<ApiResponse<DriverResponse>> linkDriver(@Valid @RequestBody AdminDriverRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.linkDriver(request)));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> listBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.listBookings(page, size)));
    }

    @PostMapping("/bookings/{bookingId}/assign-driver")
    public ResponseEntity<ApiResponse<BookingResponse>> assignDriver(
            @PathVariable UUID bookingId,
            @Valid @RequestBody AssignDriverRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.assignDriver(bookingId, request.getDriverId())));
    }

    @GetMapping("/pricing/routes")
    public ResponseEntity<ApiResponse<List<CityRoutePricingResponse>>> listRoutePricing() {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.listRoutePricing()));
    }

    @PostMapping("/pricing/routes")
    public ResponseEntity<ApiResponse<CityRoutePricingResponse>> createRoutePricing(
            @Valid @RequestBody CityRoutePricingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(adminDashboardService.createRoutePricing(request)));
    }
}
