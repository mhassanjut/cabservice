CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(30) NOT NULL,
    google_id VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE drivers (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    license_number VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE cars (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    car_type VARCHAR(50) NOT NULL,
    body_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    passenger_capacity INT NOT NULL,
    base_fare DECIMAL(10,2) NOT NULL,
    electric BOOLEAN NOT NULL DEFAULT FALSE,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    supports_in_city BOOLEAN NOT NULL DEFAULT TRUE,
    supports_city_to_city BOOLEAN NOT NULL DEFAULT TRUE,
    image_url VARCHAR(500),
    description TEXT,
    display_priority INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE city_route_pricing (
    id UUID PRIMARY KEY,
    from_city VARCHAR(100) NOT NULL,
    to_city VARCHAR(100) NOT NULL,
    car_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    UNIQUE (from_city, to_city, car_type)
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    booking_reference VARCHAR(20) NOT NULL UNIQUE,
    user_id UUID REFERENCES users(id),
    guest_name VARCHAR(255),
    guest_email VARCHAR(255),
    guest_phone VARCHAR(50),
    car_id UUID REFERENCES cars(id),
    custom_request BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(40) NOT NULL,
    ride_type VARCHAR(30) NOT NULL,
    pickup_address VARCHAR(500) NOT NULL,
    dropoff_address VARCHAR(500) NOT NULL,
    pickup_lat DOUBLE PRECISION NOT NULL,
    pickup_lng DOUBLE PRECISION NOT NULL,
    dropoff_lat DOUBLE PRECISION NOT NULL,
    dropoff_lng DOUBLE PRECISION NOT NULL,
    distance_km DECIMAL(10,2) NOT NULL,
    passenger_count INT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    calculated_fare DECIMAL(10,2),
    destination_city VARCHAR(100),
    driver_id UUID REFERENCES drivers(id),
    ride_status VARCHAR(40),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE payments (
    id UUID PRIMARY KEY,
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id),
    stripe_session_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'eur',
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_cars_active ON cars(active, available);
