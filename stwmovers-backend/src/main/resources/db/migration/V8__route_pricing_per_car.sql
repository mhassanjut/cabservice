-- Migrate route pricing from car_type to individual cars

ALTER TABLE city_route_pricing DROP CONSTRAINT IF EXISTS city_route_pricing_from_city_to_city_car_type_key;

ALTER TABLE city_route_pricing ADD COLUMN IF NOT EXISTS car_id UUID REFERENCES cars(id);

-- car_type is still NOT NULL until dropped below; copy it on insert so rows are valid
INSERT INTO city_route_pricing (id, from_city, to_city, car_type, car_id, price, active, created_at, updated_at)
SELECT gen_random_uuid(), crp.from_city, crp.to_city, crp.car_type, c.id, crp.price, crp.active, NOW(), NOW()
FROM city_route_pricing crp
INNER JOIN cars c ON c.car_type = crp.car_type AND c.active = TRUE
WHERE crp.car_id IS NULL;

DELETE FROM city_route_pricing WHERE car_id IS NULL;

ALTER TABLE city_route_pricing DROP COLUMN IF EXISTS car_type;

ALTER TABLE city_route_pricing ALTER COLUMN car_id SET NOT NULL;

ALTER TABLE city_route_pricing
    ADD CONSTRAINT uq_city_route_pricing_route_car UNIQUE (from_city, to_city, car_id);
