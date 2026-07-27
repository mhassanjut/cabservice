package com.stwmovers.taxi.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourItineraryItem {

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    @Column(name = "time_label", length = 50)
    private String time;

    @Column(name = "activity", nullable = false)
    private String activity;
}
