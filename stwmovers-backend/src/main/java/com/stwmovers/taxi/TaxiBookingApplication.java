package com.stwmovers.taxi;

// Staging CI/CD test trigger — safe to remove after verification

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.stwmovers.taxi.config.AppProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
@EnableScheduling
public class TaxiBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaxiBookingApplication.class, args);
    }
}
