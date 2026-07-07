package com.stwmovers.taxi.util;

import com.stwmovers.taxi.application.dto.response.BookingResponse;
import com.stwmovers.taxi.application.dto.response.CarResponse;
import com.stwmovers.taxi.application.dto.response.CarWithFareResponse;
import com.stwmovers.taxi.application.dto.response.CityRoutePricingResponse;
import com.stwmovers.taxi.application.dto.response.DriverResponse;
import com.stwmovers.taxi.application.dto.response.PaymentResponse;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.entity.CityRoutePricing;
import com.stwmovers.taxi.domain.entity.Driver;
import com.stwmovers.taxi.domain.entity.Payment;
import com.stwmovers.taxi.domain.enums.RideType;

import java.math.BigDecimal;

public final class EntityMapper {

    private EntityMapper() {
    }

    public static CarResponse toCarResponse(Car car) {
        return CarResponse.builder()
                .id(car.getId())
                .name(car.getName())
                .carType(car.getCarType())
                .bodyType(car.getBodyType())
                .category(car.getCategory())
                .passengerCapacity(car.getPassengerCapacity())
                .baseFare(car.getBaseFare())
                .electric(car.getElectric())
                .available(car.getAvailable())
                .active(car.getActive())
                .supportsInCity(car.getSupportsInCity())
                .supportsCityToCity(car.getSupportsCityToCity())
                .imageUrl(car.getImageUrl())
                .description(car.getDescription())
                .displayPriority(car.getDisplayPriority())
                .createdAt(car.getCreatedAt())
                .updatedAt(car.getUpdatedAt())
                .build();
    }

    public static CarWithFareResponse toCarWithFare(Car car, BigDecimal calculatedFare) {
        return CarWithFareResponse.builder()
                .id(car.getId())
                .name(car.getName())
                .carType(car.getCarType())
                .bodyType(car.getBodyType())
                .category(car.getCategory())
                .passengerCapacity(car.getPassengerCapacity())
                .baseFare(car.getBaseFare())
                .calculatedFare(calculatedFare)
                .electric(car.getElectric())
                .available(car.getAvailable())
                .imageUrl(car.getImageUrl())
                .description(car.getDescription())
                .build();
    }

    public static BookingResponse toBookingResponse(Booking booking) {
        BookingResponse.BookingResponseBuilder builder = BookingResponse.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .guestName(booking.getGuestName())
                .guestEmail(booking.getGuestEmail())
                .guestPhone(booking.getGuestPhone())
                .customRequest(booking.getCustomRequest())
                .status(booking.getStatus())
                .rideType(booking.getRideType())
                .pickupAddress(booking.getPickupAddress())
                .dropoffAddress(booking.getDropoffAddress())
                .pickupLat(booking.getPickupLat())
                .pickupLng(booking.getPickupLng())
                .dropoffLat(booking.getDropoffLat())
                .dropoffLng(booking.getDropoffLng())
                .distanceKm(booking.getDistanceKm())
                .passengerCount(booking.getPassengerCount())
                .scheduledAt(booking.getScheduledAt())
                .calculatedFare(booking.getCalculatedFare())
                .destinationCity(booking.getDestinationCity())
                .rideStatus(booking.getRideStatus())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt());

        if (booking.getUser() != null) {
            builder.userId(booking.getUser().getId());
        }
        if (booking.getCar() != null) {
            builder.carId(booking.getCar().getId()).carName(booking.getCar().getName());
        }
        if (booking.getDriver() != null) {
            builder.driverId(booking.getDriver().getId());
        }
        return builder.build();
    }

    public static DriverResponse toDriverResponse(Driver driver) {
        return DriverResponse.builder()
                .id(driver.getId())
                .userId(driver.getUser().getId())
                .email(driver.getUser().getEmail())
                .fullName(driver.getUser().getFullName())
                .phone(driver.getUser().getPhone())
                .licenseNumber(driver.getLicenseNumber())
                .active(driver.getActive())
                .createdAt(driver.getCreatedAt())
                .build();
    }

    public static PaymentResponse toPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .bookingReference(payment.getBooking().getBookingReference())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .stripeSessionId(payment.getStripeSessionId())
                .stripePaymentIntentId(payment.getStripePaymentIntentId())
                .createdAt(payment.getCreatedAt())
                .build();
    }

    public static CityRoutePricingResponse toCityRoutePricingResponse(CityRoutePricing pricing) {
        return CityRoutePricingResponse.builder()
                .id(pricing.getId())
                .fromCity(pricing.getFromCity())
                .toCity(pricing.getToCity())
                .carId(pricing.getCar().getId())
                .carName(pricing.getCar().getName())
                .price(pricing.getPrice())
                .active(pricing.getActive())
                .build();
    }
}
