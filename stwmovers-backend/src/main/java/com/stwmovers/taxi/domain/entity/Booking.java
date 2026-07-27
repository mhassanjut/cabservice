package com.stwmovers.taxi.domain.entity;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.stwmovers.taxi.domain.enums.BookingStatus;
import com.stwmovers.taxi.domain.enums.RideStatus;
import com.stwmovers.taxi.domain.enums.RideType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    private UUID id;

    @Column(name = "booking_reference", nullable = false, unique = true, length = 20)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "guest_name")
    private String guestName;

    @Column(name = "guest_email")
    private String guestEmail;

    @Column(name = "guest_phone", length = 50)
    private String guestPhone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id")
    private Car car;

    @Column(name = "custom_request", nullable = false)
    @Builder.Default
    private Boolean customRequest = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private BookingStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "ride_type", nullable = false, length = 30)
    private RideType rideType;

    @Column(name = "pickup_address", nullable = false, length = 500)
    private String pickupAddress;

    @Column(name = "dropoff_address", nullable = false, length = 500)
    private String dropoffAddress;

    @Column(name = "pickup_lat", nullable = false)
    private Double pickupLat;

    @Column(name = "pickup_lng", nullable = false)
    private Double pickupLng;

    @Column(name = "dropoff_lat", nullable = false)
    private Double dropoffLat;

    @Column(name = "dropoff_lng", nullable = false)
    private Double dropoffLng;

    @Column(name = "distance_km", nullable = false, precision = 10, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "passenger_count")
    private Integer passengerCount;

    @Column(name = "scheduled_at", nullable = false)
    private Instant scheduledAt;

    @Column(name = "calculated_fare", precision = 10, scale = 2)
    private BigDecimal calculatedFare;

    @Column(name = "destination_city", length = 100)
    private String destinationCity;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id")
    private Tour tour;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Enumerated(EnumType.STRING)
    @Column(name = "ride_status", length = 40)
    private RideStatus rideStatus;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }
}
