package com.stwmovers.taxi.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stwmovers.taxi.domain.entity.PickupCity;

public interface PickupCityRepository extends JpaRepository<PickupCity, UUID> {

    List<PickupCity> findAllByOrderByNameAsc();

    List<PickupCity> findAllByActiveTrueOrderByNameAsc();

    @Query("SELECT p FROM PickupCity p WHERE lower(trim(p.name)) = lower(trim(:name))")
    Optional<PickupCity> findByNameIgnoreCase(@Param("name") String name);

    @Query("SELECT p FROM PickupCity p WHERE lower(trim(p.name)) = lower(trim(:name)) AND p.active = true")
    Optional<PickupCity> findByNameIgnoreCaseAndActiveTrue(@Param("name") String name);
}
