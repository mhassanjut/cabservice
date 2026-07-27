package com.stwmovers.taxi.application.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminTourRequest {

    @NotBlank
    private String title;

    private String location;

    private String durationLabel;

    private Integer durationHours;

    private Integer guestMin;

    private Integer guestMax;

    private String category;

    private String shortDescription;

    private String aboutDescription;

    private String imageUrl;

    private Boolean active;

    private Integer displayPriority;

    private List<String> highlights;

    private List<String> included;

    private List<String> excluded;

    private List<TourItineraryItemRequest> itinerary;
}
