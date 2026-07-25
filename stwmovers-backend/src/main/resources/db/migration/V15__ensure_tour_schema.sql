ALTER TABLE tours ADD COLUMN IF NOT EXISTS duration_hours INTEGER;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS guest_min INTEGER;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS guest_max INTEGER;

ALTER TABLE tours DROP COLUMN IF EXISTS hours_label;
ALTER TABLE tours DROP COLUMN IF EXISTS guests_label;
ALTER TABLE tours DROP COLUMN IF EXISTS price;

CREATE TABLE IF NOT EXISTS tour_car_pricing (
    id UUID PRIMARY KEY,
    tour_id UUID NOT NULL REFERENCES tours (id) ON DELETE CASCADE,
    car_id UUID NOT NULL REFERENCES cars (id),
    price NUMERIC(10, 2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    UNIQUE (tour_id, car_id)
);

CREATE INDEX IF NOT EXISTS idx_tour_car_pricing_tour_id ON tour_car_pricing (tour_id);
