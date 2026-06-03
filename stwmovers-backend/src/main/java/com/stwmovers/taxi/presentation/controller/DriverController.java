package com.stwmovers.taxi.presentation.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stwmovers.taxi.application.dto.request.DriverRideStatusRequest;
import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.application.service.DriverRideService;
import com.stwmovers.taxi.config.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/drivers")
public class DriverController {

    private final DriverRideService driverRideService;

    public DriverController(DriverRideService driverRideService) {
        this.driverRideService = driverRideService;
    }

    @GetMapping("/rides")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> assignedRides() {
        return ResponseEntity.ok(ApiResponse.ok(driverRideService.listAssignedRides()));
    }

    @GetMapping("/rides/completed")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> completedRides() {
        return ResponseEntity.ok(ApiResponse.ok(driverRideService.listCompletedRides()));
    }

    @PostMapping("/rides/{bookingId}/accept")
    public ResponseEntity<ApiResponse<BookingResponse>> accept(@PathVariable UUID bookingId) {
        return ResponseEntity.ok(ApiResponse.ok(driverRideService.acceptRide(bookingId)));
    }

    @PostMapping("/rides/{bookingId}/reject")
    public ResponseEntity<ApiResponse<BookingResponse>> reject(@PathVariable UUID bookingId) {
        return ResponseEntity.ok(ApiResponse.ok(driverRideService.rejectRide(bookingId)));
    }

    @PutMapping("/rides/{bookingId}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateStatus(
            @PathVariable UUID bookingId,
            @Valid @RequestBody DriverRideStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(driverRideService.updateRideStatus(bookingId, request)));
    }
}
