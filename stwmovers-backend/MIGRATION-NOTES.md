# Redis & Docker Decoupling Notes

## (a) Redis touchpoints disabled + fallbacks

| Location | What was disabled | Fallback |
|----------|-------------------|----------|
| `pom.xml` | `spring-boot-starter-data-redis` dependency | No Redis client on classpath; app starts without Redis auto-config |
| `src/main/resources/application.yml` | `spring.data.redis` host/port | N/A (config unused) |
| `src/main/resources/application-docker.yml` | `spring.data.redis.host: redis` | N/A (profile unused while Docker disabled) |
| `src/test/resources/application-test.yml` | `spring.data.redis` host/port | Tests use unit mocks; no Redis connection |
| `.env.example` | `REDIS_HOST`, `REDIS_PORT` | Marked unused; vars kept for restoration |
| `src/main/java/.../config/RedisConfig.java` | `@Configuration`, `StringRedisTemplate` bean | Bean removed from startup lifecycle |
| `src/main/java/.../infrastructure/otp/RedisOtpStore.java` | `StringRedisTemplate` set/get/delete | `ConcurrentHashMap` with TTL expiry per entry |
| `scripts/start-dev.ps1` | Call to `start-redis.ps1` | Backend starts directly via `mvn spring-boot:run` |
| `scripts/start-redis.ps1` | Redis server launch | Early exit with disabled message |
| `scripts/stop-redis.ps1` | Redis shutdown | Early exit with disabled message |
| `scripts/setup-redis.ps1` | Redis Windows download/install | Early exit with disabled message |
| `docker-compose.yml` | `redis` service | OTP no longer needs Redis container |
| `docker-compose.infra.yml` | `redis` service | Postgres-only infra compose |

**Unchanged (already non-Redis):** `RateLimitFilter` uses in-memory `ConcurrentHashMap` (per-instance rate limiting).

## (b) Docker files/steps disabled + replacement run method

| Location | What was disabled | Replacement |
|----------|-------------------|-------------|
| `Dockerfile` | Entire build/run instructions commented | Use `Dockerfile.disabled` as restore template |
| `Dockerfile.disabled` | Preserved original container build | Rename to `Dockerfile` to restore |
| `docker-compose.yml` | `redis`, `api`, `nginx` services | `postgres` service only (optional DB); app via JAR/process |
| `docker-compose.infra.yml` | `redis` service | Postgres-only for local DB |
| `.github/workflows/ci-cd.yml` | `docker` job (image build) | Removed from pipeline |
| `.github/workflows/ci-cd.yml` | `deploy` `needs: docker` | `deploy` `needs: build-test` |
| `.github/workflows/ci-cd.yml` | VPS `docker compose pull && up` hint | `mvn package && java -jar target/stwmovers-backend-1.0.0.jar` |
| `scripts/setup-docker.ps1` | Docker Desktop install flow | Early exit; use `mvn spring-boot:run` |

**Active deployment paths:**

```bash
# Local development
mvn spring-boot:run

# Production-style (after package)
mvn -DskipTests package
java -jar target/stwmovers-backend-1.0.0.jar

# Optional PostgreSQL only (no app container)
docker compose -f docker-compose.infra.yml up -d
```

## (c) Flagged unsafe-fallback features

### OTP store (`RedisOtpStore` → in-memory `ConcurrentHashMap`)

- **Issue:** OTP codes are stored in the JVM heap, not shared across instances.
- **Impact:** Multi-instance / horizontal scaling will break OTP verify (code sent on instance A may be verified on instance B). Restarting the JVM clears all pending OTPs.
- **Not a safe production substitute for Redis** when running more than one app instance or requiring OTP survival across restarts.
- **Restore:** Uncomment Redis dependency, `RedisConfig`, `application.yml` redis block, `RedisOtpStore` Redis calls, Redis compose service, and `start-redis.ps1` integration.

### Rate limiting (`RateLimitFilter`)

- **Issue:** Already in-memory before this migration; unchanged.
- **Impact:** Per-instance limits only; not coordinated across replicas.
- **Restore:** Would require Redis or another shared store (not previously implemented).
