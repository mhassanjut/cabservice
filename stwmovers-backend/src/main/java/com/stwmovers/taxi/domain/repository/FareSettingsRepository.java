package com.stwmovers.taxi.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stwmovers.taxi.domain.entity.FareSettings;

public interface FareSettingsRepository extends JpaRepository<FareSettings, Short> {
}
