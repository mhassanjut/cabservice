package com.stwmovers.taxi.application.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.request.UpdateFareSettingsRequest;
import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.entity.FareSettings;
import com.stwmovers.taxi.domain.repository.FareSettingsRepository;

@Service
public class FareSettingsService {

    private final FareSettingsRepository fareSettingsRepository;
    private final AppProperties appProperties;

    public FareSettingsService(FareSettingsRepository fareSettingsRepository, AppProperties appProperties) {
        this.fareSettingsRepository = fareSettingsRepository;
        this.appProperties = appProperties;
    }

    @Transactional(readOnly = true)
    public int getInCityBaseKm() {
        return resolveSettings().getInCityBaseKm();
    }

    @Transactional(readOnly = true)
    public BigDecimal getInCityExtraEurPerKm() {
        return resolveSettings().getInCityExtraEurPerKm();
    }

    @Transactional
    public FareSettings updateSettings(UpdateFareSettingsRequest request) {
        FareSettings settings = fareSettingsRepository.findById(FareSettings.SINGLETON_ID)
                .orElseGet(this::createDefaultSettings);
        settings.setInCityBaseKm(request.getInCityBaseKm());
        settings.setInCityExtraEurPerKm(request.getInCityExtraEurPerKm());
        return fareSettingsRepository.save(settings);
    }

    private FareSettings resolveSettings() {
        return fareSettingsRepository.findById(FareSettings.SINGLETON_ID)
                .orElseGet(this::createDefaultSettings);
    }

    private FareSettings createDefaultSettings() {
        AppProperties.Fare defaults = appProperties.getFare();
        return FareSettings.builder()
                .id(FareSettings.SINGLETON_ID)
                .inCityBaseKm(defaults.getInCityBaseKm())
                .inCityExtraEurPerKm(defaults.getInCityExtraEurPerKm())
                .build();
    }
}
