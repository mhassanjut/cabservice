package com.stwmovers.taxi.presentation.controller;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.stwmovers.taxi.application.dto.request.AddDestinationCityRequest;
import com.stwmovers.taxi.application.dto.request.AdminCarRequest;
import com.stwmovers.taxi.application.dto.request.AdminDriverRequest;
import com.stwmovers.taxi.application.dto.request.AdminTourRequest;
import com.stwmovers.taxi.application.dto.request.AssignDriverRequest;
import com.stwmovers.taxi.application.dto.request.CancelBookingAdminRequest;
import com.stwmovers.taxi.application.dto.request.CityRoutePricingRequest;
import com.stwmovers.taxi.application.dto.request.CreateDriverUserRequest;
import com.stwmovers.taxi.application.dto.request.RoutePricingBatchRequest;
import com.stwmovers.taxi.application.dto.request.SetCustomFareRequest;
import com.stwmovers.taxi.application.dto.request.UpdateBookingStatusRequest;
import com.stwmovers.taxi.application.dto.request.UpdateDriverRequest;
import com.stwmovers.taxi.application.dto.request.UpdateFareSettingsRequest;
import com.stwmovers.taxi.application.dto.request.TourPricingBatchRequest;
import com.stwmovers.taxi.application.dto.response.AdminBookingDetailResponse;
import com.stwmovers.taxi.application.dto.response.AdminSettingsResponse;
import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.application.dto.response.CarImageUploadResponse;
import com.stwmovers.taxi.application.dto.response.CarResponse;
import com.stwmovers.taxi.application.dto.response.CityListResponse;
import com.stwmovers.taxi.application.dto.response.CityRoutePricingResponse;
import com.stwmovers.taxi.application.dto.response.DashboardStatsResponse;
import com.stwmovers.taxi.application.dto.response.DestinationCityResponse;
import com.stwmovers.taxi.application.dto.response.DriverResponse;
import com.stwmovers.taxi.application.dto.response.PagedResponse;
import com.stwmovers.taxi.application.dto.response.PickupCityResponse;
import com.stwmovers.taxi.application.dto.response.PaymentResponse;
import com.stwmovers.taxi.application.dto.response.TourCarPricingResponse;
import com.stwmovers.taxi.application.dto.response.TourImageUploadResponse;
import com.stwmovers.taxi.application.dto.response.TourResponse;
import com.stwmovers.taxi.application.service.AdminDashboardService;
import com.stwmovers.taxi.application.service.BookingService;
import com.stwmovers.taxi.application.service.CarImageStorageService;
import com.stwmovers.taxi.application.service.CarCatalogService;
import com.stwmovers.taxi.application.service.TourCatalogService;
import com.stwmovers.taxi.application.service.TourImageStorageService;
import com.stwmovers.taxi.application.service.TourPricingService;
import com.stwmovers.taxi.config.ApiResponse;
import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.enums.PaymentStatus;
import com.stwmovers.taxi.domain.enums.RideType;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminDashboardService adminDashboardService;
    private final CarCatalogService carCatalogService;
    private final CarImageStorageService carImageStorageService;
    private final TourCatalogService tourCatalogService;
    private final TourImageStorageService tourImageStorageService;
    private final TourPricingService tourPricingService;
    private final BookingService bookingService;

    public AdminController(
            AdminDashboardService adminDashboardService,
            CarCatalogService carCatalogService,
            CarImageStorageService carImageStorageService,
            TourCatalogService tourCatalogService,
            TourImageStorageService tourImageStorageService,
            TourPricingService tourPricingService,
            BookingService bookingService) {
        this.adminDashboardService = adminDashboardService;
        this.carCatalogService = carCatalogService;
        this.carImageStorageService = carImageStorageService;
        this.tourCatalogService = tourCatalogService;
        this.tourImageStorageService = tourImageStorageService;
        this.tourPricingService = tourPricingService;
        this.bookingService = bookingService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> dashboard() {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.getDashboardStats()));
    }

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<AdminSettingsResponse>> settings() {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.getSettings()));
    }

    @PutMapping("/settings/fare")
    public ResponseEntity<ApiResponse<AdminSettingsResponse>> updateFareSettings(
            @Valid @RequestBody UpdateFareSettingsRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.updateFareSettings(request)));
    }

    @GetMapping("/cars")
    public ResponseEntity<ApiResponse<List<CarResponse>>> listCars() {
        return ResponseEntity.ok(ApiResponse.ok(carCatalogService.listAllCars()));
    }

    @PostMapping(value = "/cars/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<CarResponse>> uploadCarImageForCar(
            @PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.ok(carCatalogService.updateCarImage(id, file)));
    }

    @PostMapping(value = "/cars/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<CarImageUploadResponse>> uploadCarImage(
            @RequestParam("file") MultipartFile file) {
        String imageUrl = carImageStorageService.store(file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(CarImageUploadResponse.builder().imageUrl(imageUrl).build()));
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

    @GetMapping("/tours")
    public ResponseEntity<ApiResponse<List<TourResponse>>> listTours() {
        return ResponseEntity.ok(ApiResponse.ok(tourCatalogService.listAllTours()));
    }

    @GetMapping("/tours/{id}")
    public ResponseEntity<ApiResponse<TourResponse>> getTour(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(tourCatalogService.getTour(id)));
    }

    @PostMapping(value = "/tours/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<TourResponse>> uploadTourImageForTour(
            @PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.ok(tourCatalogService.updateTourImage(id, file)));
    }

    @PostMapping(value = "/tours/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<TourImageUploadResponse>> uploadTourImage(
            @RequestParam("file") MultipartFile file) {
        String imageUrl = tourImageStorageService.store(file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(TourImageUploadResponse.builder().imageUrl(imageUrl).build()));
    }

    @PostMapping("/tours")
    public ResponseEntity<ApiResponse<TourResponse>> createTour(@Valid @RequestBody AdminTourRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(tourCatalogService.createTour(request)));
    }

    @PutMapping("/tours/{id}")
    public ResponseEntity<ApiResponse<TourResponse>> updateTour(
            @PathVariable UUID id, @Valid @RequestBody AdminTourRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(tourCatalogService.updateTour(id, request)));
    }

    @DeleteMapping("/tours/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTour(@PathVariable UUID id) {
        tourCatalogService.deleteTour(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/tours/{tourId}/pricing")
    public ResponseEntity<ApiResponse<List<TourCarPricingResponse>>> listTourPricing(@PathVariable UUID tourId) {
        return ResponseEntity.ok(ApiResponse.ok(tourPricingService.listForTour(tourId)));
    }

    @PostMapping("/tours/{tourId}/pricing/batch")
    public ResponseEntity<ApiResponse<List<TourCarPricingResponse>>> saveTourPricingBatch(
            @PathVariable UUID tourId, @Valid @RequestBody TourPricingBatchRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(tourPricingService.saveBatch(tourId, request)));
    }

    @GetMapping("/drivers")
    public ResponseEntity<ApiResponse<List<DriverResponse>>> listDrivers() {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.listDrivers()));
    }

    @GetMapping("/drivers/{id}")
    public ResponseEntity<ApiResponse<DriverResponse>> getDriver(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.getDriver(id)));
    }

    @PostMapping("/drivers")
    public ResponseEntity<ApiResponse<DriverResponse>> createDriver(
            @Valid @RequestBody CreateDriverUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(adminDashboardService.createDriver(request)));
    }

    @PutMapping("/drivers/{id}")
    public ResponseEntity<ApiResponse<DriverResponse>> updateDriver(
            @PathVariable UUID id, @Valid @RequestBody UpdateDriverRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.updateDriver(id, request)));
    }

    @PostMapping("/drivers/link")
    public ResponseEntity<ApiResponse<DriverResponse>> linkDriver(@Valid @RequestBody AdminDriverRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.linkDriver(request)));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> listBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) RideType rideType,
            @RequestParam(required = false) RideType excludeRideType,
            @RequestParam(required = false) Boolean customRequest,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant toDate,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.listAdminBookings(
                status, rideType, excludeRideType, customRequest, search, fromDate, toDate, sortBy, sortDir, page, size)));
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<AdminBookingDetailResponse>> getBooking(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getAdminBookingDetail(id)));
    }

    @PatchMapping("/bookings/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @PathVariable UUID id, @Valid @RequestBody UpdateBookingStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.updateBookingStatus(id, request.getStatus())));
    }

    @PostMapping("/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable UUID id, @RequestBody(required = false) CancelBookingAdminRequest request) {
        String reason = request != null ? request.getReason() : null;
        return ResponseEntity.ok(ApiResponse.ok(bookingService.adminCancelBooking(id, reason)));
    }

    @PatchMapping("/bookings/{id}/custom-fare")
    public ResponseEntity<ApiResponse<BookingResponse>> setCustomFare(
            @PathVariable UUID id, @Valid @RequestBody SetCustomFareRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.setCustomFare(id, request.getFare())));
    }

    @PostMapping("/bookings/{bookingId}/assign-driver")
    public ResponseEntity<ApiResponse<BookingResponse>> assignDriver(
            @PathVariable UUID bookingId,
            @Valid @RequestBody AssignDriverRequest request) {
        boolean force = Boolean.TRUE.equals(request.getForce());
        return ResponseEntity.ok(ApiResponse.ok(
                bookingService.assignDriver(bookingId, request.getDriverId(), force)));
    }

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<PagedResponse<PaymentResponse>>> listPayments(
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.listPayments(status, page, size)));
    }

    @PostMapping("/payments/{id}/refund")
    public ResponseEntity<ApiResponse<PaymentResponse>> refundPayment(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.refundPayment(id)));
    }

    @GetMapping("/cities/pickup")
    public ResponseEntity<ApiResponse<List<PickupCityResponse>>> listPickupCities() {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.listPickupCities()));
    }

    @GetMapping("/cities/pickup/all")
    public ResponseEntity<ApiResponse<List<PickupCityResponse>>> listAllPickupCities() {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.listAllPickupCities()));
    }

    @PostMapping("/cities/pickup")
    public ResponseEntity<ApiResponse<PickupCityResponse>> addPickupCity(
            @Valid @RequestBody AddDestinationCityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(adminDashboardService.addPickupCity(request)));
    }

    @PatchMapping("/cities/pickup/{id}")
    public ResponseEntity<ApiResponse<PickupCityResponse>> updatePickupCity(
            @PathVariable UUID id, @RequestParam boolean active) {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.updatePickupCity(id, active)));
    }

    @DeleteMapping("/cities/pickup/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePickupCity(@PathVariable UUID id) {
        adminDashboardService.deletePickupCity(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/cities/destinations")
    public ResponseEntity<ApiResponse<List<DestinationCityResponse>>> listDestinationCities() {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.listDestinationCities()));
    }

    @PostMapping("/cities/destinations")
    public ResponseEntity<ApiResponse<DestinationCityResponse>> addDestinationCity(
            @Valid @RequestBody AddDestinationCityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(adminDashboardService.addDestinationCity(request)));
    }

    @DeleteMapping("/cities/destinations/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDestinationCity(@PathVariable UUID id) {
        adminDashboardService.deleteDestinationCity(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/cities")
    public ResponseEntity<ApiResponse<CityListResponse>> listCities() {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.listCities()));
    }

    @GetMapping("/pricing/routes")
    public ResponseEntity<ApiResponse<List<CityRoutePricingResponse>>> listRoutePricing(
            @RequestParam(required = false) String fromCity,
            @RequestParam(required = false) String toCity) {
        if (fromCity != null && !fromCity.isBlank() && toCity != null && !toCity.isBlank()) {
            return ResponseEntity.ok(ApiResponse.ok(
                    adminDashboardService.listRoutePricingForRoute(fromCity, toCity)));
        }
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.listRoutePricing()));
    }

    @PostMapping("/pricing/routes/batch")
    public ResponseEntity<ApiResponse<List<CityRoutePricingResponse>>> saveRoutePricingBatch(
            @Valid @RequestBody RoutePricingBatchRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(adminDashboardService.saveRoutePricingBatch(request)));
    }

    @PostMapping("/pricing/routes")
    public ResponseEntity<ApiResponse<CityRoutePricingResponse>> createRoutePricing(
            @Valid @RequestBody CityRoutePricingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(adminDashboardService.createRoutePricing(request)));
    }

    @PutMapping("/pricing/routes/{id}")
    public ResponseEntity<ApiResponse<CityRoutePricingResponse>> updateRoutePricing(
            @PathVariable UUID id, @Valid @RequestBody CityRoutePricingRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(adminDashboardService.updateRoutePricing(id, request)));
    }

    @DeleteMapping("/pricing/routes/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoutePricing(@PathVariable UUID id) {
        adminDashboardService.deleteRoutePricing(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
