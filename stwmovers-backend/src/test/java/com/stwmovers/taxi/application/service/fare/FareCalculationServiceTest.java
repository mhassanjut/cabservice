package com.stwmovers.taxi.application.service.fare;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.stwmovers.taxi.application.port.FareCalculationContext;
import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.entity.CityRoutePricing;
import com.stwmovers.taxi.domain.enums.BodyType;
import com.stwmovers.taxi.domain.enums.CarCategory;
import com.stwmovers.taxi.domain.enums.CarType;
import com.stwmovers.taxi.domain.enums.RideType;
import com.stwmovers.taxi.domain.repository.CityRoutePricingRepository;

@ExtendWith(MockitoExtension.class)
class FareCalculationServiceTest {

    @Mock
    private CityRoutePricingRepository cityRoutePricingRepository;

    private FareCalculationService fareCalculationService;
    private Car sedan;

    @BeforeEach
    void setUp() {
        AppProperties appProperties = new AppProperties();
        AppProperties.Fare fare = new AppProperties.Fare();
        fare.setInCityBaseKm(27);
        fare.setInCityExtraKmBlock(3);
        fare.setInCityExtraEurPerBlock(new BigDecimal("5"));
        appProperties.setFare(fare);

        InCityFareCalculationStrategy inCity = new InCityFareCalculationStrategy(appProperties);
        CityToCityFareCalculationStrategy cityToCity =
                new CityToCityFareCalculationStrategy(cityRoutePricingRepository);
        fareCalculationService = new FareCalculationService(List.of(inCity, cityToCity));

        sedan = Car.builder()
                .name("Mercedes E Class")
                .carType(CarType.SEDAN)
                .bodyType(BodyType.SEDAN)
                .category(CarCategory.LUXURY)
                .passengerCapacity(4)
                .baseFare(new BigDecimal("70.00"))
                .build();
    }

    @Test
    void inCity_withinBaseDistance_returnsBaseFare() {
        FareCalculationContext context = FareCalculationContext.builder()
                .distanceKm(new BigDecimal("20"))
                .build();

        BigDecimal fare = fareCalculationService.calculateFare(sedan, RideType.IN_CITY, context);

        assertThat(fare).isEqualByComparingTo("70.00");
    }

    @Test
    void inCity_beyondBaseDistance_addsExtraBlocks() {
        FareCalculationContext context = FareCalculationContext.builder()
                .distanceKm(new BigDecimal("33"))
                .build();

        BigDecimal fare = fareCalculationService.calculateFare(sedan, RideType.IN_CITY, context);

        assertThat(fare).isEqualByComparingTo("80.00");
    }

    @Test
    void cityToCity_usesRoutePricing() {
        when(cityRoutePricingRepository.findByFromCityIgnoreCaseAndToCityIgnoreCaseAndCarTypeAndActiveTrue(
                        any(), any(), any()))
                .thenReturn(Optional.of(CityRoutePricing.builder()
                        .fromCity("Barcelona")
                        .toCity("Girona")
                        .carType(CarType.SEDAN)
                        .price(new BigDecimal("120.00"))
                        .build()));

        FareCalculationContext context = FareCalculationContext.builder()
                .destinationCity("Girona")
                .distanceKm(new BigDecimal("100"))
                .build();

        BigDecimal fare = fareCalculationService.calculateFare(sedan, RideType.CITY_TO_CITY, context);

        assertThat(fare).isEqualByComparingTo("120.00");
    }
}
