ALTER TABLE bookings ADD COLUMN tour_id UUID REFERENCES tours (id);

CREATE INDEX idx_bookings_tour_id ON bookings (tour_id);
