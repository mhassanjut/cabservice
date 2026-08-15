-- Remove default Barcelona route prices that were previously inserted in V2__seed_data.sql.
-- Cars, admin user, and all other seed data are unchanged.

DELETE FROM city_route_pricing
WHERE lower(trim(from_city)) = 'barcelona'
  AND lower(trim(to_city)) IN ('girona', 'sitges', 'tarragona');
