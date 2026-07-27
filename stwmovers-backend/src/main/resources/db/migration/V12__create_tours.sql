CREATE TABLE tours (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    duration_label VARCHAR(100),
    hours_label VARCHAR(100),
    guests_label VARCHAR(100),
    category VARCHAR(100),
    short_description TEXT,
    about_description TEXT,
    price NUMERIC(10, 2),
    image_url VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    display_priority INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_tours_active_priority ON tours (active, display_priority);

CREATE TABLE tour_highlights (
    tour_id UUID NOT NULL REFERENCES tours (id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL,
    highlight VARCHAR(255) NOT NULL,
    PRIMARY KEY (tour_id, sort_order)
);

CREATE TABLE tour_included_items (
    tour_id UUID NOT NULL REFERENCES tours (id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL,
    item VARCHAR(255) NOT NULL,
    PRIMARY KEY (tour_id, sort_order)
);

CREATE TABLE tour_excluded_items (
    tour_id UUID NOT NULL REFERENCES tours (id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL,
    item VARCHAR(255) NOT NULL,
    PRIMARY KEY (tour_id, sort_order)
);

CREATE TABLE tour_itinerary_items (
    tour_id UUID NOT NULL REFERENCES tours (id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL,
    day_number INTEGER NOT NULL DEFAULT 1,
    time_label VARCHAR(50),
    activity VARCHAR(255) NOT NULL,
    PRIMARY KEY (tour_id, sort_order)
);
