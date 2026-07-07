package com.stwmovers.taxi.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stwmovers.taxi.domain.entity.DestinationCity;

public interface DestinationCityRepository extends JpaRepository<DestinationCity, UUID> {

    List<DestinationCity> findAllByActiveTrueOrderByNameAsc();

    List<DestinationCity> findAllByOrderByNameAsc();

    @Query("SELECT d FROM DestinationCity d WHERE lower(trim(d.name)) = lower(trim(:name))")
    Optional<DestinationCity> findByNameIgnoreCase(@Param("name") String name);

    boolean existsByNameIgnoreCase(String name);
}
