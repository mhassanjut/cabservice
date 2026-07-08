INSERT INTO users (id, email, password_hash, full_name, phone, role, active, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@stwmovers.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Admin', '+34000000000', 'ADMIN', TRUE, NOW(), NOW());

INSERT INTO cars (id, name, car_type, body_type, category, passenger_capacity, base_fare, electric, available, active, supports_in_city, supports_city_to_city, image_url, description, display_priority, created_at, updated_at) VALUES
('c0000001-0000-0000-0000-000000000001', 'Mercedes Vito Van', 'VAN', 'VAN', 'STANDARD', 7, 55.00, FALSE, TRUE, TRUE, TRUE, TRUE, '/img/vehicles/van.svg', 'Spacious van for groups', 1, NOW(), NOW()),
('c0000001-0000-0000-0000-000000000002', 'Mercedes V Class', 'VAN', 'VAN', 'LUXURY', 7, 65.00, FALSE, TRUE, TRUE, TRUE, TRUE, '/img/vehicles/van.svg', 'Premium V Class', 2, NOW(), NOW()),
('c0000001-0000-0000-0000-000000000003', 'Mercedes Van', 'VAN', 'VAN', 'STANDARD', 8, 70.00, FALSE, TRUE, TRUE, TRUE, TRUE, '/img/vehicles/van.svg', 'Large capacity van', 3, NOW(), NOW()),
('c0000001-0000-0000-0000-000000000004', 'Mercedes E Class', 'SEDAN', 'SEDAN', 'LUXURY', 4, 70.00, FALSE, TRUE, TRUE, TRUE, TRUE, '/img/vehicles/comfort.svg', 'Executive sedan', 4, NOW(), NOW()),
('c0000001-0000-0000-0000-000000000005', 'Mercedes S Class', 'SEDAN', 'SEDAN', 'LUXURY', 4, 120.00, FALSE, TRUE, TRUE, TRUE, TRUE, '/img/vehicles/comfort.svg', 'Flagship luxury sedan', 5, NOW(), NOW()),
('c0000001-0000-0000-0000-000000000006', 'Tesla Model S', 'SEDAN', 'SEDAN', 'STANDARD', 4, 50.00, TRUE, TRUE, TRUE, TRUE, TRUE, '/img/vehicles/eco.svg', 'Electric premium sedan', 6, NOW(), NOW()),
('c0000001-0000-0000-0000-000000000007', 'Hyundai Ionic', 'SEDAN', 'SEDAN', 'STANDARD', 4, 40.00, TRUE, TRUE, TRUE, TRUE, TRUE, '/img/vehicles/eco.svg', 'Eco-friendly electric', 7, NOW(), NOW()),
('c0000001-0000-0000-0000-000000000008', 'Toyota Corolla Familiar', 'SEDAN', 'SEDAN', 'STANDARD', 4, 40.00, FALSE, TRUE, TRUE, TRUE, TRUE, '/img/vehicles/comfort.svg', 'Reliable family sedan', 8, NOW(), NOW());

INSERT INTO city_route_pricing (id, from_city, to_city, car_type, price, active, created_at, updated_at) VALUES
('b0000001-0000-0000-0000-000000000001', 'Barcelona', 'Girona', 'SEDAN', 120.00, TRUE, NOW(), NOW()),
('b0000001-0000-0000-0000-000000000002', 'Barcelona', 'Girona', 'VAN', 150.00, TRUE, NOW(), NOW()),
('b0000001-0000-0000-0000-000000000003', 'Barcelona', 'Tarragona', 'SEDAN', 100.00, TRUE, NOW(), NOW()),
('b0000001-0000-0000-0000-000000000004', 'Barcelona', 'Tarragona', 'VAN', 130.00, TRUE, NOW(), NOW()),
('b0000001-0000-0000-0000-000000000005', 'Barcelona', 'Sitges', 'SEDAN', 60.00, TRUE, NOW(), NOW()),
('b0000001-0000-0000-0000-000000000006', 'Barcelona', 'Sitges', 'VAN', 80.00, TRUE, NOW(), NOW());
