package com.stwmovers.taxi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.stwmovers.taxi.config.AppProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class TaxiBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaxiBookingApplication.class, args);
    }
}
