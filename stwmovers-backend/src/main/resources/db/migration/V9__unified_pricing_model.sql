-- Unified pricing: route pricing by car_type + destination city registry

CREATE TABLE destination_cities (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_destination_cities_name UNIQUE (name)
);

ALTER TABLE city_route_pricing ADD COLUMN IF NOT EXISTS car_type VARCHAR(50);

UPDATE city_route_pricing crp
SET car_type = c.car_type
FROM cars c
WHERE c.id = crp.car_id AND crp.car_type IS NULL;

DELETE FROM city_route_pricing a
USING city_route_pricing b
WHERE a.id > b.id
  AND lower(trim(a.from_city)) = lower(trim(b.from_city))
  AND lower(trim(a.to_city)) = lower(trim(b.to_city))
  AND a.car_type = b.car_type;

DELETE FROM city_route_pricing WHERE car_type IS NULL;

ALTER TABLE city_route_pricing DROP CONSTRAINT IF EXISTS uq_city_route_pricing_route_car;
ALTER TABLE city_route_pricing DROP COLUMN IF EXISTS car_id;

ALTER TABLE city_route_pricing ALTER COLUMN car_type SET NOT NULL;

ALTER TABLE city_route_pricing
    ADD CONSTRAINT uq_city_route_pricing_route_car_type UNIQUE (from_city, to_city, car_type);

CREATE INDEX IF NOT EXISTS idx_city_route_pricing_lookup
    ON city_route_pricing (lower(from_city), lower(to_city), car_type);

INSERT INTO destination_cities (id, name, active, created_at, updated_at)
SELECT gen_random_uuid(), city_name, TRUE, NOW(), NOW()
FROM (
    SELECT DISTINCT trim(to_city) AS city_name FROM city_route_pricing
) AS cities
WHERE city_name IS NOT NULL AND city_name <> ''
ON CONFLICT (name) DO NOTHING;
