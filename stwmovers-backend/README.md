# STW Movers — Spring Boot Backend

Taxi booking API for Barcelona (IN_CITY / CITY_TO_CITY), Stripe payments, email OTP, JWT roles (CUSTOMER, DRIVER, ADMIN).

## Stack
- Java 21, Spring Boot 3.4
- PostgreSQL + Flyway
- Redis (OTP cache)
- Stripe
- Docker Compose + Nginx + GitHub Actions

## Quick start
```bash
docker compose up -d --build
```
API: `http://localhost:8080` (via Nginx: `http://localhost`)

Admin: `admin@stwmovers.com` / `Admin@12345`

## Local dev
```bash
mvn spring-boot:run
```
Requires PostgreSQL and Redis running.

## Postman
Import `postman/STW-Movers-API.postman_collection.json`.

## Key endpoints
- `POST /api/v1/rides/cars` — cars with calculated fares + backend filters
- `POST /api/v1/bookings` — create booking (guest or authenticated)
- `POST /api/v1/auth/guest/otp/send|verify` — email OTP
- `POST /api/v1/payments/session` — Stripe checkout
- `POST /api/v1/payments/webhook` — Stripe webhook
- `GET /api/v1/admin/dashboard` — admin stats (JWT ADMIN)
