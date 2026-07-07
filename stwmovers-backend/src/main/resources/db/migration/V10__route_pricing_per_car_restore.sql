CREATE TABLE pickup_cities (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_pickup_cities_name UNIQUE (name)
);

INSERT INTO pickup_cities (id, name, active, created_at, updated_at) VALUES
    ('a0000001-0000-0000-0000-000000000001', 'Barcelona', TRUE, NOW(), NOW()),
    ('a0000001-0000-0000-0000-000000000002', 'Tarragona', TRUE, NOW(), NOW()),
    ('a0000001-0000-0000-0000-000000000003', 'Girona', TRUE, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

ALTER TABLE city_route_pricing ADD COLUMN IF NOT EXISTS car_id UUID REFERENCES cars(id);

INSERT INTO city_route_pricing (id, from_city, to_city, car_id, car_type, price, active, created_at, updated_at)
SELECT gen_random_uuid(), crp.from_city, crp.to_city, c.id, crp.car_type, crp.price, crp.active, NOW(), NOW()
FROM city_route_pricing crp
INNER JOIN cars c ON c.car_type::text = crp.car_type AND c.active = TRUE
WHERE crp.car_id IS NULL;

DELETE FROM city_route_pricing a
USING city_route_pricing b
WHERE a.id > b.id
  AND lower(trim(a.from_city)) = lower(trim(b.from_city))
  AND lower(trim(a.to_city)) = lower(trim(b.to_city))
  AND a.car_id = b.car_id;

DELETE FROM city_route_pricing WHERE car_id IS NULL;

ALTER TABLE city_route_pricing DROP CONSTRAINT IF EXISTS uq_city_route_pricing_route_car_type;
ALTER TABLE city_route_pricing DROP COLUMN IF EXISTS car_type;

ALTER TABLE city_route_pricing ALTER COLUMN car_id SET NOT NULL;

ALTER TABLE city_route_pricing
    ADD CONSTRAINT uq_city_route_pricing_route_car UNIQUE (from_city, to_city, car_id);

CREATE INDEX IF NOT EXISTS idx_city_route_pricing_car_lookup
    ON city_route_pricing (lower(from_city), lower(to_city), car_id);
