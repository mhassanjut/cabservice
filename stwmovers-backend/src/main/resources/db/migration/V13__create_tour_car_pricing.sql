CREATE TABLE tour_car_pricing (
    id UUID PRIMARY KEY,
    tour_id UUID NOT NULL REFERENCES tours (id) ON DELETE CASCADE,
    car_id UUID NOT NULL REFERENCES cars (id),
    price NUMERIC(10, 2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    UNIQUE (tour_id, car_id)
);

CREATE INDEX idx_tour_car_pricing_tour_id ON tour_car_pricing (tour_id);
CREATE INDEX idx_tour_car_pricing_lookup ON tour_car_pricing (tour_id, car_id) WHERE active = TRUE;

ALTER TABLE tours DROP COLUMN IF EXISTS price;
