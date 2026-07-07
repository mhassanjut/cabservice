package com.stwmovers.taxi.application.dto.request;

import com.stwmovers.taxi.domain.enums.BookingStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateBookingStatusRequest {

    @NotNull
    private BookingStatus status;
}
