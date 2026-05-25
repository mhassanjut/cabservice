package com.stwmovers.taxi.domain.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.stwmovers.taxi.domain.entity.Car;

public interface CarRepository extends JpaRepository<Car, UUID>, JpaSpecificationExecutor<Car> {
}
