package com.stwmovers.taxi.application.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.request.AdminCarRequest;
import com.stwmovers.taxi.application.dto.request.CarFilterRequest;
import com.stwmovers.taxi.application.dto.request.CarsWithFareRequest;
import com.stwmovers.taxi.application.dto.response.CarResponse;
import com.stwmovers.taxi.application.dto.response.CarWithFareResponse;
import com.stwmovers.taxi.application.dto.response.PagedResponse;
import com.stwmovers.taxi.application.port.FareCalculationContext;
import com.stwmovers.taxi.application.service.fare.FareCalculationService;
import com.stwmovers.taxi.application.service.fare.RideTypeService;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.enums.RideType;
import com.stwmovers.taxi.domain.repository.CarRepository;
import com.stwmovers.taxi.exception.ResourceNotFoundException;
import com.stwmovers.taxi.presentation.specification.CarSpecification;
import com.stwmovers.taxi.util.EntityMapper;

@Service
public class CarCatalogService {

    private final CarRepository carRepository;
    private final FareCalculationService fareCalculationService;
    private final RideTypeService rideTypeService;

    public CarCatalogService(
            CarRepository carRepository,
            FareCalculationService fareCalculationService,
            RideTypeService rideTypeService) {
        this.carRepository = carRepository;
        this.fareCalculationService = fareCalculationService;
        this.rideTypeService = rideTypeService;
    }

    @Transactional(readOnly = true)
    public PagedResponse<CarWithFareResponse> listCarsWithFare(CarsWithFareRequest request) {
        RideType rideType = rideTypeService.resolveRideType(
                request.getRideType(),
                request.getPickupLat(),
                request.getPickupLng(),
                request.getDropoffLat(),
                request.getDropoffLng());

        Specification<Car> spec = Specification.where(CarSpecification.activeAndAvailable())
                .and(CarSpecification.supportsRideType(rideType))
                .and(CarSpecification.withFilters(request.getFilters()));

        int page = request.getPage() != null ? request.getPage() : 0;
        int size = request.getSize() != null ? request.getSize() : 20;
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "displayPriority"));

        Page<Car> carPage = carRepository.findAll(spec, pageable);
        FareCalculationContext context = FareCalculationContext.builder()
                .distanceKm(request.getDistanceKm())
                .destinationCity(request.getDestinationCity())
                .build();

        List<CarWithFareResponse> results = new ArrayList<>();
        for (Car car : carPage.getContent()) {
            BigDecimal fare = fareCalculationService.calculateFare(car, rideType, context);
            if (request.getFilters() != null) {
                if (request.getFilters().getMinPrice() != null
                        && fare.compareTo(request.getFilters().getMinPrice()) < 0) {
                    continue;
                }
                if (request.getFilters().getMaxPrice() != null
                        && fare.compareTo(request.getFilters().getMaxPrice()) > 0) {
                    continue;
                }
            }
            results.add(EntityMapper.toCarWithFare(car, fare, rideType));
        }

        return PagedResponse.<CarWithFareResponse>builder()
                .content(results)
                .page(carPage.getNumber())
                .size(carPage.getSize())
                .totalElements(carPage.getTotalElements())
                .totalPages(carPage.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public List<CarResponse> listAllCars() {
        return carRepository.findAll(Sort.by(Sort.Direction.ASC, "displayPriority")).stream()
                .map(EntityMapper::toCarResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CarResponse getCar(UUID id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found: " + id));
        return EntityMapper.toCarResponse(car);
    }

    @Transactional
    public CarResponse createCar(AdminCarRequest request) {
        Car car = Car.builder()
                .name(request.getName())
                .carType(request.getCarType())
                .bodyType(request.getBodyType())
                .category(request.getCategory())
                .passengerCapacity(request.getPassengerCapacity())
                .baseFare(request.getBaseFare())
                .electric(request.getElectric() != null ? request.getElectric() : false)
                .available(request.getAvailable() != null ? request.getAvailable() : true)
                .active(request.getActive() != null ? request.getActive() : true)
                .supportsInCity(request.getSupportsInCity() != null ? request.getSupportsInCity() : true)
                .supportsCityToCity(request.getSupportsCityToCity() != null ? request.getSupportsCityToCity() : true)
                .imageUrl(request.getImageUrl())
                .description(request.getDescription())
                .displayPriority(request.getDisplayPriority() != null ? request.getDisplayPriority() : 0)
                .build();
        return EntityMapper.toCarResponse(carRepository.save(car));
    }

    @Transactional
    public CarResponse updateCar(UUID id, AdminCarRequest request) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found: " + id));
        car.setName(request.getName());
        car.setCarType(request.getCarType());
        car.setBodyType(request.getBodyType());
        car.setCategory(request.getCategory());
        car.setPassengerCapacity(request.getPassengerCapacity());
        car.setBaseFare(request.getBaseFare());
        if (request.getElectric() != null) {
            car.setElectric(request.getElectric());
        }
        if (request.getAvailable() != null) {
            car.setAvailable(request.getAvailable());
        }
        if (request.getActive() != null) {
            car.setActive(request.getActive());
        }
        if (request.getSupportsInCity() != null) {
            car.setSupportsInCity(request.getSupportsInCity());
        }
        if (request.getSupportsCityToCity() != null) {
            car.setSupportsCityToCity(request.getSupportsCityToCity());
        }
        car.setImageUrl(request.getImageUrl());
        car.setDescription(request.getDescription());
        if (request.getDisplayPriority() != null) {
            car.setDisplayPriority(request.getDisplayPriority());
        }
        return EntityMapper.toCarResponse(carRepository.save(car));
    }

    @Transactional
    public void deleteCar(UUID id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found: " + id));
        car.setActive(false);
        car.setAvailable(false);
        carRepository.save(car);
    }
}
