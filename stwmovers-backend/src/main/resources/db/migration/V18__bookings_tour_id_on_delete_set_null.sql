ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_tour_id_fkey;

ALTER TABLE bookings
    ADD CONSTRAINT bookings_tour_id_fkey
        FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE SET NULL;
