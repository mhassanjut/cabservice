package com.stwmovers.taxi.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.stwmovers.taxi.domain.entity.Driver;

public interface DriverRepository extends JpaRepository<Driver, UUID> {

    Optional<Driver> findByUserId(UUID userId);

    List<Driver> findByActiveTrue();

    @Query("SELECT COUNT(d) FROM Driver d WHERE d.active = true")
    long countActiveDrivers();
}
