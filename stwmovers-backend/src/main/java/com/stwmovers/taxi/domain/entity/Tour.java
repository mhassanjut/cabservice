package com.stwmovers.taxi.domain.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tour {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String location;

    @Column(name = "duration_label")
    private String durationLabel;

    @Column(name = "duration_hours")
    private Integer durationHours;

    @Column(name = "guest_min")
    private Integer guestMin;

    @Column(name = "guest_max")
    private Integer guestMax;

    private String category;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(name = "about_description", columnDefinition = "TEXT")
    private String aboutDescription;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(name = "display_priority", nullable = false)
    @Builder.Default
    private Integer displayPriority = 0;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tour_highlights", joinColumns = @JoinColumn(name = "tour_id"))
    @OrderColumn(name = "sort_order")
    @Column(name = "highlight", nullable = false)
    @Builder.Default
    private List<String> highlights = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tour_included_items", joinColumns = @JoinColumn(name = "tour_id"))
    @OrderColumn(name = "sort_order")
    @Column(name = "item", nullable = false)
    @Builder.Default
    private List<String> included = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tour_excluded_items", joinColumns = @JoinColumn(name = "tour_id"))
    @OrderColumn(name = "sort_order")
    @Column(name = "item", nullable = false)
    @Builder.Default
    private List<String> excluded = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tour_itinerary_items", joinColumns = @JoinColumn(name = "tour_id"))
    @OrderColumn(name = "sort_order")
    @Builder.Default
    private List<TourItineraryItem> itinerary = new ArrayList<>();

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
