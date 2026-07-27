package com.stwmovers.taxi.domain.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stwmovers.taxi.domain.entity.Tour;

public interface TourRepository extends JpaRepository<Tour, UUID> {

    List<Tour> findByActiveTrueOrderByDisplayPriorityAsc();
}
