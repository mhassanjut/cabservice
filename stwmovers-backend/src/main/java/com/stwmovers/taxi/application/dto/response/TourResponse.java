package com.stwmovers.taxi.application.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class TourResponse {

    UUID id;
    String title;
    String location;
    String durationLabel;
    Integer durationHours;
    Integer guestMin;
    Integer guestMax;
    String category;
    String shortDescription;
    String aboutDescription;
    BigDecimal startingPrice;
    List<TourCarPricingResponse> carPrices;
    String imageUrl;
    Boolean active;
    Integer displayPriority;
    List<String> highlights;
    List<String> included;
    List<String> excluded;
    List<TourItineraryItemResponse> itinerary;
    Instant createdAt;
    Instant updatedAt;
}
