package com.stwmovers.taxi.domain.entity;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.stwmovers.taxi.domain.enums.BodyType;
import com.stwmovers.taxi.domain.enums.CarCategory;
import com.stwmovers.taxi.domain.enums.CarType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cars")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Car {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "car_type", nullable = false, length = 50)
    private CarType carType;

    @Enumerated(EnumType.STRING)
    @Column(name = "body_type", nullable = false, length = 50)
    private BodyType bodyType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CarCategory category;

    @Column(name = "passenger_capacity", nullable = false)
    private Integer passengerCapacity;

    @Column(name = "base_fare", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseFare;

    @Column(nullable = false)
    @Builder.Default
    private Boolean electric = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean available = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(name = "supports_in_city", nullable = false)
    @Builder.Default
    private Boolean supportsInCity = true;

    @Column(name = "supports_city_to_city", nullable = false)
    @Builder.Default
    private Boolean supportsCityToCity = true;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "display_priority", nullable = false)
    @Builder.Default
    private Integer displayPriority = 0;

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
