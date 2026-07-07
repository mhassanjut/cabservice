package com.stwmovers.taxi.application.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AdminSettingsResponse {

    int inCityBaseKm;
    BigDecimal inCityExtraEurPerKm;
    String adminEmail;
}
