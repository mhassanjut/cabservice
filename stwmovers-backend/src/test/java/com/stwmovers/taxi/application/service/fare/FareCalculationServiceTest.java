package com.stwmovers.taxi.application.service.fare;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

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
import com.stwmovers.taxi.domain.repository.CityRoutePricingRepository;
import com.stwmovers.taxi.exception.BadRequestException;

@ExtendWith(MockitoExtension.class)
class FareCalculationServiceTest {

    @Mock
    private CityRoutePricingRepository cityRoutePricingRepository;

    private FareCalculationService fareCalculationService;
    private Car sedan;
    private UUID sedanId;

    @BeforeEach
    void setUp() {
        AppProperties appProperties = new AppProperties();
        AppProperties.Fare fare = new AppProperties.Fare();
        fare.setInCityBaseKm(27);
        fare.setInCityExtraEurPerKm(new BigDecimal("1"));
        appProperties.setFare(fare);

        fareCalculationService = new FareCalculationService(cityRoutePricingRepository, appProperties);

        sedanId = UUID.randomUUID();
        sedan = Car.builder()
                .id(sedanId)
                .name("Mercedes E Class")
                .carType(CarType.SEDAN)
                .bodyType(BodyType.SEDAN)
                .category(CarCategory.LUXURY)
                .passengerCapacity(4)
                .baseFare(new BigDecimal("70.00"))
                .build();
    }

    @Test
    void withinBaseDistance_returnsBaseFare() {
        FareCalculationContext context = FareCalculationContext.builder()
                .distanceKm(new BigDecimal("20"))
                .pickupCity("Barcelona")
                .destinationCity("Girona")
                .build();

        BigDecimal fare = fareCalculationService.calculateFare(sedan, context);

        assertThat(fare).isEqualByComparingTo("70.00");
    }

    @Test
    void beyondBaseDistance_addsPerKmCharge() {
        FareCalculationContext context = FareCalculationContext.builder()
                .distanceKm(new BigDecimal("33"))
                .pickupCity("Barcelona")
                .destinationCity("Girona")
                .build();

        BigDecimal fare = fareCalculationService.calculateFare(sedan, context);

        assertThat(fare).isEqualByComparingTo("76.00");
    }

    @Test
    void matchingRoute_usesRoutePrice() {
        when(cityRoutePricingRepository.findActiveByRouteAndCarId(any(), any(), eq(sedanId)))
                .thenReturn(Optional.of(CityRoutePricing.builder()
                        .fromCity("Barcelona")
                        .toCity("Girona")
                        .car(sedan)
                        .price(new BigDecimal("120.00"))
                        .build()));

        FareCalculationContext context = FareCalculationContext.builder()
                .distanceKm(new BigDecimal("100"))
                .pickupCity("Barcelona")
                .destinationCity("Girona")
                .build();

        BigDecimal fare = fareCalculationService.calculateFare(sedan, context);

        assertThat(fare).isEqualByComparingTo("120.00");
    }

    @Test
    void missingDistance_throwsBadRequest() {
        FareCalculationContext context = FareCalculationContext.builder()
                .pickupCity("Barcelona")
                .destinationCity("Girona")
                .build();

        assertThatThrownBy(() -> fareCalculationService.calculateFare(sedan, context))
                .isInstanceOf(BadRequestException.class);
    }
}
