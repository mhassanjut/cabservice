package com.stwmovers.taxi.presentation.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stwmovers.taxi.application.dto.request.CreateBookingRequest;
import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.application.dto.response.PagedResponse;
import com.stwmovers.taxi.application.service.BookingService;
import com.stwmovers.taxi.config.ApiResponse;
import com.stwmovers.taxi.infrastructure.security.UserPrincipal;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> create(@Valid @RequestBody CreateBookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking created", bookingService.createBooking(request)));
    }

    @GetMapping("/{reference}")
    public ResponseEntity<ApiResponse<BookingResponse>> getByReference(@PathVariable String reference) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getByReference(reference)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> myBookings(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.listMyBookings(page, size)));
    }

    @PostMapping("/{reference}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancel(@PathVariable String reference) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.cancelBooking(reference)));
    }
}
