CREATE TABLE fare_settings (
    id SMALLINT PRIMARY KEY CHECK (id = 1),
    in_city_base_km INT NOT NULL,
    in_city_extra_eur_per_km NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO fare_settings (id, in_city_base_km, in_city_extra_eur_per_km)
VALUES (1, 27, 1.00);
