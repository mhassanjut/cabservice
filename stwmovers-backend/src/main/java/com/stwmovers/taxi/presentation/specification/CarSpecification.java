package com.stwmovers.taxi.presentation.specification;

import java.math.BigDecimal;

import org.springframework.data.jpa.domain.Specification;

import com.stwmovers.taxi.application.dto.request.CarFilterRequest;
import com.stwmovers.taxi.domain.entity.Car;
import com.stwmovers.taxi.domain.enums.CarCategory;

public final class CarSpecification {

    private CarSpecification() {
    }

    public static Specification<Car> activeAndAvailable() {
        return (root, query, cb) -> cb.and(
                cb.isTrue(root.get("active")),
                cb.isTrue(root.get("available")));
    }

    public static Specification<Car> withFilters(CarFilterRequest filters) {
        if (filters == null) {
            return (root, query, cb) -> cb.conjunction();
        }
        Specification<Car> spec = (root, query, cb) -> cb.conjunction();

        if (filters.getPassengerCapacity() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("passengerCapacity"), filters.getPassengerCapacity()));
        }
        if (filters.getCarType() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("carType"), filters.getCarType()));
        }
        if (filters.getBodyType() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("bodyType"), filters.getBodyType()));
        }
        if (filters.getCategory() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), filters.getCategory()));
        }
        if (filters.getElectric() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("electric"), filters.getElectric()));
        }
        if (Boolean.TRUE.equals(filters.getLuxury())) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), CarCategory.LUXURY));
        }
        if (filters.getMinPrice() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("baseFare"), filters.getMinPrice()));
        }
        if (filters.getMaxPrice() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("baseFare"), filters.getMaxPrice()));
        }
        return spec;
    }
}
