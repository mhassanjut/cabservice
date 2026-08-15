package com.stwmovers.taxi.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stwmovers.taxi.application.dto.response.GuestContactAdminResponse;
import com.stwmovers.taxi.application.dto.response.PagedResponse;
import com.stwmovers.taxi.application.dto.response.RegisteredCustomerAdminResponse;
import com.stwmovers.taxi.application.service.AdminGuestContactService;
import com.stwmovers.taxi.application.service.AdminRegisteredCustomerService;
import com.stwmovers.taxi.config.ApiResponse;

@RestController
@RequestMapping("/api/v1/admin/customers")
public class AdminCustomerController {

    private final AdminRegisteredCustomerService registeredCustomerService;
    private final AdminGuestContactService guestContactService;

    public AdminCustomerController(
            AdminRegisteredCustomerService registeredCustomerService,
            AdminGuestContactService guestContactService) {
        this.registeredCustomerService = registeredCustomerService;
        this.guestContactService = guestContactService;
    }

    @GetMapping("/google")
    public ResponseEntity<ApiResponse<PagedResponse<RegisteredCustomerAdminResponse>>> listGoogleCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(registeredCustomerService.listGoogleCustomers(search, page, size)));
    }

    @GetMapping("/guests")
    public ResponseEntity<ApiResponse<PagedResponse<GuestContactAdminResponse>>> listGuestContacts(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(guestContactService.listGuestContacts(search, page, size)));
    }
}
