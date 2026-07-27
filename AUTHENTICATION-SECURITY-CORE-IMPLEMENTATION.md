# Core Authentication Security — Implementation Guide

Focused implementation plan for five security gaps:

1. **Refresh tokens** — separate short-lived access + long-lived refresh token pair with rotation
2. **Server-side logout** — revoke JWTs so logout actually invalidates sessions
3. **Token storage** — move JWTs from `localStorage` to httpOnly cookies
4. **CSRF** — protect cookie-based auth from cross-site request forgery
5. **OTP storage** — hash OTPs at rest and store in Redis (not plain text in memory)



**Stack:** Spring Boot backend (`stwmovers-backend`) + Nuxt frontend (`stwmovers-frontend`).

---

## Which stack to touch first?

### Short answer

**Start with the backend.** Implement in this order:

```
Backend Phase 0  →  Redis re-enablement
Backend Phase 1  →  OTP storage (independent quick win)
Backend Phase 2  →  Refresh tokens
Backend Phase 3  →  Server-side logout
Backend Phase 4  →  httpOnly cookie token storage
Frontend Phase 5 →  Cookie auth + refresh client changes
Backend Phase 6  →  CSRF
Frontend Phase 7 →  CSRF headers
```

Do **not** start with frontend cookie or CSRF work until the backend exposes the matching APIs and cookie behavior.

---

### Decision guide — which stack for each gap?

| Gap | Start with | Why |
|-----|------------|-----|
| **OTP storage** | **Backend only** | Hashing + Redis is entirely server-side. Frontend only needs to handle new error messages (optional). |
| **Refresh tokens** | **Backend first** | DB migration, new service, new endpoint contract. Frontend can keep working with Bearer tokens during transition. |
| **Server-side logout** | **Backend first** | Revocation store, `jti` claim, and real logout logic live on the server. Frontend already calls `POST /logout` — it just needs to work once backend revokes. |
| **Token storage (cookies)** | **Backend first, then frontend** | Backend must set `Set-Cookie` headers and read tokens from cookies. Frontend removes `localStorage` and adds `credentials: 'include'`. |
| **CSRF** | **Backend first, then frontend** | CSRF only matters after cookies are live. Backend enables CSRF; frontend sends `X-XSRF-TOKEN`. |

---

### Can frontend and backend work in parallel?

| Parallel safe? | Work |
|----------------|------|
| ✅ Yes | Backend: OTP storage + Redis while someone else prepares frontend error handling for OTP |
| ✅ Yes | Backend: refresh tokens while frontend updates types (no deploy until backend is ready) |
| ❌ No | Frontend cookie auth before backend sets cookies — breaks login |
| ❌ No | Frontend CSRF headers before backend enables CSRF — breaks mutating requests |
| ⚠️ Partial | Frontend refresh logic can be updated only after backend refresh endpoint accepts refresh token (not access token) |

---

### Rollout strategy (recommended)

Use a **transition period** so you never break production auth:

| Stage | Backend behavior | Frontend behavior |
|-------|------------------|-------------------|
| **A — Today** | Single JWT in JSON, logout is no-op | Token in `localStorage`, Bearer header |
| **B — Refresh + revoke** | Refresh token pair + server logout; still return tokens in JSON | Update refresh logic; keep `localStorage` temporarily |
| **C — Cookies** | Set httpOnly cookies **and** return tokens in JSON (dual mode) | Add `credentials: 'include'`; still use Bearer as fallback |
| **D — Cookie-only** | Stop returning tokens in JSON body | Remove token from `localStorage`; profile only |
| **E — CSRF** | Enable CSRF for authenticated cookie requests | Send `X-XSRF-TOKEN` on POST/PUT/PATCH/DELETE |

Ship stages B → C → D → E as separate deploys. Test each stage before moving on.

---

## Dependency diagram

```
                    ┌─────────────────┐
                    │  Redis (Phase 0) │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌────────────┐  ┌──────────────┐  ┌─────────────┐
     │ OTP storage│  │Refresh tokens│  │Server logout│
     │  (Phase 1) │  │  (Phase 2)   │  │  (Phase 3)  │
     └────────────┘  └──────┬───────┘  └──────┬──────┘
                            │                  │
                            └────────┬─────────┘
                                     ▼
                          ┌──────────────────┐
                          │ Token storage    │
                          │ httpOnly cookies │
                          │    (Phase 4)     │
                          └────────┬─────────┘
                                   ▼
                          ┌──────────────────┐
                          │ CSRF (Phase 6/7) │
                          └──────────────────┘
```

**OTP storage** is independent — implement anytime after Redis is up.

---

## Phase 0 — Redis re-enablement (backend, prerequisite)

Required for: OTP storage, token revocation blacklist.

### Current state

Redis is disabled across the codebase:

- `application.yml` — redis block commented out
- `pom.xml` — `spring-boot-starter-data-redis` commented out
- `RedisConfig.java` — bean commented out
- `RedisOtpStore.java` — uses in-memory `ConcurrentHashMap`
- `docker-compose.yml` — redis service commented out

### Backend steps

**Step 0.1** — Uncomment in `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

**Step 0.2** — Uncomment in `application.yml`:

```yaml
spring:
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
```

**Step 0.3** — Restore `RedisConfig.java` (`StringRedisTemplate` bean).

**Step 0.4** — Uncomment redis service in `docker-compose.yml` and run:

```bash
docker compose up -d redis
```

**Step 0.5** — Verify connectivity on backend startup (no Redis connection errors in logs).

### Redis key layout (this guide)

| Feature | Key | TTL |
|---------|-----|-----|
| OTP hash | `otp:{email}` | OTP TTL (600s) |
| OTP brute-force | `otp:attempts:{email}` | OTP TTL |
| OTP send rate limit | `otp:send:{email}` | 600s |
| Revoked access token | `revoked:{jti}` | until token expiry |
| User session index | `user:{userId}:sessions` | refresh token lifetime |

### Frontend steps

None for Phase 0.

### Test

- [ ] Backend starts with Redis running
- [ ] `redis-cli ping` returns `PONG`

---

## Phase 1 — OTP storage (backend first)

### Current state

`OtpService.java` stores OTP in **plain text**:

```java
otpStore.save(normalizeEmail(email), otp, ttlSeconds);
// verify: stored.equals(otp.trim())
```

`RedisOtpStore.java` uses an in-memory map — OTPs are lost on restart and not shared across instances.

Used by: guest booking flow (`GuestBookingService` → `/api/v1/auth/guest/otp/send` and `/verify`).

### Backend steps

**Step 1.1** — Hash OTP before storage in `OtpService.java`:

```java
public String generateAndStore(String email) {
    String otp = generateOtp(appProperties.getOtp().getLength());
    String hash = passwordEncoder.encode(otp);  // BCrypt — reuse existing bean
    otpStore.save(normalizeEmail(email), hash, appProperties.getOtp().getTtlSeconds());
    return otp;  // sent via email only — never stored plain
}

public boolean verify(String email, String otp) {
    String storedHash = otpStore.get(normalizeEmail(email))
        .orElseThrow(() -> new BadRequestException("OTP expired or not found"));
    boolean valid = passwordEncoder.matches(otp.trim(), storedHash);
    if (valid) otpStore.delete(normalizeEmail(email));
    return valid;
}
```

Inject existing `PasswordEncoder` bean into `OtpService`.

**Step 1.2** — Restore Redis ops in `RedisOtpStore.java`:

```java
redisTemplate.opsForValue().set(key(email), hash, ttlSeconds, TimeUnit.SECONDS);
```

Remove the in-memory `ConcurrentHashMap`.

**Step 1.3** — Add OTP attempt limit (brute-force protection):

```java
private static final int MAX_OTP_ATTEMPTS = 5;

// In verify(), before passwordEncoder.matches:
String attemptKey = "otp:attempts:" + normalizeEmail(email);
long attempts = redis.opsForValue().increment(attemptKey);
if (attempts == 1) redis.expire(attemptKey, ttlSeconds, TimeUnit.SECONDS);
if (attempts > MAX_OTP_ATTEMPTS) {
    otpStore.delete(normalizeEmail(email));
    throw new BadRequestException("Too many OTP attempts. Request a new code.");
}
```

**Step 1.4** — Rate-limit OTP send in `GuestBookingService` or `OtpService`:

```java
// Max 3 sends per email per 10 minutes
String sendKey = "otp:send:" + normalizeEmail(email);
long count = redis.opsForValue().increment(sendKey);
if (count == 1) redis.expire(sendKey, 600, TimeUnit.SECONDS);
if (count > 3) {
    throw new BadRequestException("OTP already sent. Please wait before requesting again.");
}
```

### Frontend steps (optional, after backend)

**Step 1.5** — Handle new error messages in `components/OtpVerifyModal.vue`:

| Backend message | UI action |
|-----------------|-----------|
| `"Too many OTP attempts. Request a new code."` | Show error, enable resend |
| `"OTP already sent. Please wait before requesting again."` | Disable resend with countdown |

No changes to OTP input format or API contract.

### Files to modify

| Stack | File |
|-------|------|
| Backend | `OtpService.java` |
| Backend | `RedisOtpStore.java` |
| Backend | `GuestBookingService.java` (send rate limit) |
| Frontend (optional) | `OtpVerifyModal.vue` |

### Test

- [ ] Guest OTP email still delivered
- [ ] Correct code verifies successfully
- [ ] Wrong code fails; after 5 attempts OTP is invalidated
- [ ] Redis value is BCrypt hash (not 6 digits)
- [ ] OTP survives only within TTL; expires automatically
- [ ] Resend rate limit enforced

---

## Phase 2 — Refresh tokens (backend first)

### Current state

- Single JWT with 24h expiry (`app.jwt.expiration-ms: 86400000`)
- `POST /api/v1/auth/refresh` requires the **access token** (`SecurityConfig.java` line 54)
- `AuthService.refreshSession()` re-issues a new access token from the authenticated principal — no separate refresh token, no rotation

Frontend (`services/http/api.ts`) sends the access token to refresh when it gets a 401.

### Backend steps

**Step 2.1** — Add config in `application.yml`:

```yaml
app:
  jwt:
    access-expiration-ms: 900000       # 15 minutes
    refresh-expiration-ms: 604800000 # 7 days
    expiration-ms: 900000              # alias during migration
```

Update `AppProperties.Jwt` with `accessExpirationMs` and `refreshExpirationMs`.

**Step 2.2** — DB migration `Vxxx__refresh_tokens.sql`:

```sql
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
```

Store **SHA-256 hash** of the refresh token — never plain text in DB.

**Step 2.3** — Create `RefreshToken` entity + `RefreshTokenRepository`.

**Step 2.4** — Create `RefreshTokenService`:

| Method | Behavior |
|--------|----------|
| `create(userId)` | Generate random token, hash, save to DB, return raw token once |
| `rotate(rawToken)` | Validate hash → revoke old → issue new access + new refresh |
| `revokeByRawToken(rawToken)` | Mark revoked (used on logout) |
| `revokeAllForUser(userId)` | Revoke all active refresh tokens for user |

**Refresh token rotation (theft detection):**

1. Validate refresh token hash exists, not revoked, not expired
2. Revoke the old refresh token (one-time use)
3. Issue new access JWT + new refresh token
4. If a revoked refresh token is reused → revoke **all** sessions for that user

**Step 2.5** — Split `JwtTokenProvider`:

```java
public String generateAccessToken(UserPrincipal principal) {
    String jti = UUID.randomUUID().toString();
    return Jwts.builder()
        .id(jti)                                    // NEW — needed for logout revocation
        .subject(principal.getEmail())
        .claim("userId", principal.getId().toString())
        .claim("role", principal.getRole().name())
        .issuedAt(now)
        .expiration(new Date(now + accessExpirationMs))
        .signWith(secretKey)
        .compact();
}
```

Keep `generateToken()` as alias → `generateAccessToken()` during migration.

**Step 2.6** — Update `AuthService.buildAuthResponse()`:

```java
String accessToken = jwtTokenProvider.generateAccessToken(principal);
String refreshToken = refreshTokenService.create(user.getId());
return AuthResponse.builder()
    .accessToken(accessToken)
    .refreshToken(refreshToken)   // NEW field on AuthResponse
    .expiresInMs(accessExpirationMs)
    // ... user profile fields
    .build();
```

Issue on: `register`, `login`, `loginWithGoogle`.

**Step 2.7** — Replace refresh endpoint in `AuthController.java`:

```java
@PostMapping("/refresh")
public ResponseEntity<ApiResponse<AuthResponse>> refresh(
        @CookieValue(name = "refresh_token", required = false) String cookieToken,
        @RequestBody(required = false) RefreshRequest body) {
    String refreshToken = cookieToken != null ? cookieToken : body.getRefreshToken();
    if (refreshToken == null || refreshToken.isBlank()) {
        throw new UnauthorizedException("Refresh token required");
    }
    AuthResponse auth = refreshTokenService.rotate(refreshToken);
    return ResponseEntity.ok(ApiResponse.ok(auth));
}
```

**Step 2.8** — Update `SecurityConfig.java`:

Remove this line so refresh is public (validated inside `RefreshTokenService`, not JWT filter):

```java
.requestMatchers(HttpMethod.POST, "/api/v1/auth/refresh").authenticated()
```

Refresh is already covered by `.requestMatchers("/api/v1/auth/**").permitAll()`.

**Step 2.9** — Add `refreshToken` field to `AuthResponse` DTO.

### Frontend steps (after backend Phase 2 is deployed)

**Step 2.10** — Update `types/api.ts`:

```typescript
export type AuthDto = {
  accessToken: string
  refreshToken?: string   // present during Bearer transition
  tokenType: string
  expiresInMs: number
  userId: string
  email: string
  fullName: string
  role: Role
  profilePictureUrl?: string
}
```

**Step 2.11** — Update `services/api/auth.service.ts`:

```typescript
refresh(refreshToken?: string) {
  return api<AuthDto>('/api/v1/auth/refresh', {
    method: 'POST',
    body: refreshToken ? { refreshToken } : undefined,
    auth: false,  // do NOT send expired access token
  })
},
```

During Bearer transition: pass stored refresh token from a new field in auth store.

**Step 2.12** — Update `tryRefreshSession()` in `services/http/api.ts`:

```typescript
async function tryRefreshSession(auth: ReturnType<typeof useAuthStore>): Promise<boolean> {
  // Use refresh token, not access token
  const refreshToken = auth.refreshToken
  if (!refreshToken && !auth.token) return false  // until cookies in Phase 4

  if (!refreshing) {
    refreshing = authService
      .refresh(refreshToken)
      .then((session) => {
        auth.setSession(session)
        return true
      })
      .catch(() => false)
      .finally(() => { refreshing = null })
  }
  return refreshing
}
```

**Step 2.13** — Store refresh token separately in `stores/auth.ts` (transition only):

```typescript
state: () => ({
  token: '',
  refreshToken: '',   // NEW — transition only; removed in Phase 4
  // ...
}),
persistAuth() {
  localStorage.setItem(AUTH_KEY, JSON.stringify({
    token: this.token,
    refreshToken: this.refreshToken,
    // ...profile fields
  }))
},
setSession(d: AuthDto) {
  this.token = d.accessToken
  this.refreshToken = d.refreshToken ?? this.refreshToken
  // ...
},
```

### Files to modify

| Stack | File |
|-------|------|
| Backend | `application.yml`, `AppProperties.java` |
| Backend | `db/migration/Vxxx__refresh_tokens.sql` |
| Backend | New: `RefreshToken.java`, `RefreshTokenRepository.java`, `RefreshTokenService.java` |
| Backend | `JwtTokenProvider.java`, `AuthService.java`, `AuthController.java`, `AuthResponse.java` |
| Backend | `SecurityConfig.java` |
| Frontend | `types/api.ts`, `services/api/auth.service.ts`, `services/http/api.ts`, `stores/auth.ts` |

### Test

- [ ] Login returns access + refresh tokens
- [ ] Access token expires in ~15 min (configurable)
- [ ] Refresh with valid refresh token returns new pair
- [ ] Old refresh token rejected after rotation
- [ ] Reused refresh token revokes all user sessions
- [ ] Google sign-in issues refresh token
- [ ] Frontend auto-refreshes on 401

---

## Phase 3 — Server-side logout (backend first)

### Current state

`AuthController.logout()` returns 200 without revoking anything:

```java
@PostMapping("/logout")
public ResponseEntity<ApiResponse<Void>> logout() {
    return ResponseEntity.ok(ApiResponse.ok("Logged out", null));
}
```

Frontend (`stores/auth.ts`) clears `localStorage` but the JWT remains valid until expiry.

### Backend steps

**Step 3.1** — Create `TokenRevocationService` (Redis-backed):

```java
public void revoke(String jti, long expiresAtEpochMs) {
    long ttl = expiresAtEpochMs - System.currentTimeMillis();
    if (ttl > 0) {
        redis.opsForValue().set("revoked:" + jti, "1", ttl, TimeUnit.MILLISECONDS);
    }
}

public boolean isRevoked(String jti) {
    return Boolean.TRUE.equals(redis.hasKey("revoked:" + jti));
}

public void trackSession(UUID userId, String jti, long expiresAtEpochMs) { /* ... */ }
public void revokeAllForUser(UUID userId) { /* ... */ }
```

**Step 3.2** — `jti` claim is added in Phase 2 (`JwtTokenProvider.generateAccessToken`). On token creation, call `trackSession(userId, jti, expiry)`.

**Step 3.3** — Check blacklist in `JwtAuthenticationFilter.java`:

After parsing claims, before setting authentication:

```java
if (tokenRevocationService.isRevoked(claims.getId())) {
    SecurityContextHolder.clearContext();
    return;  // or send 401
}
```

**Step 3.4** — Implement real logout in `AuthController.java`:

```java
@PostMapping("/logout")
public ResponseEntity<ApiResponse<Void>> logout(
        HttpServletRequest request,
        HttpServletResponse response) {
    // Revoke access token
    String accessToken = extractToken(request);  // Bearer header or cookie
    if (accessToken != null) {
        Claims claims = jwtTokenProvider.parseClaims(accessToken);
        tokenRevocationService.revoke(claims.getId(), claims.getExpiration().getTime());
    }
    // Revoke refresh token
    String refreshToken = extractCookie(request, "refresh_token");
    if (refreshToken != null) {
        refreshTokenService.revokeByRawToken(refreshToken);
    }
    // Clear cookies (Phase 4)
    clearAuthCookies(response);
    return ResponseEntity.ok(ApiResponse.ok("Logged out", null));
}
```

**Step 3.5** — Revoke all sessions on password change (in `UserService` if exists):

```java
tokenRevocationService.revokeAllForUser(userId);
refreshTokenService.revokeAllForUser(userId);
```

**Step 3.6** — Optional: `POST /api/v1/auth/logout-all` for "log out all devices".

### Frontend steps (after backend Phase 3)

**Step 3.7** — Update `stores/auth.ts` — always call server logout:

```typescript
async logout() {
  try {
    await authService.logout()  // remove `if (this.token)` guard
  } catch { /* still clear client */ }
  this.clear()
  this.broadcastAuthChange()
},
```

**Step 3.8** — Update `auth.service.ts`:

```typescript
logout() {
  return api<void>('/api/v1/auth/logout', {
    method: 'POST',
    auth: false,
    credentials: 'include',  // sends cookies when Phase 4 is live
  })
},
```

**Step 3.9** — Optional: "Log out all devices" button in `pages/dashboard/account.vue`.

### Files to modify

| Stack | File |
|-------|------|
| Backend | New: `TokenRevocationService.java` |
| Backend | `JwtAuthenticationFilter.java`, `AuthController.java` |
| Backend | `AuthService.java` (track session on token issue) |
| Frontend | `stores/auth.ts`, `services/api/auth.service.ts` |
| Frontend (optional) | `pages/dashboard/account.vue` |

### Test

- [ ] Logout → reuse same access token → 401
- [ ] Logout → reuse same refresh token → rejected
- [ ] Client state cleared after logout
- [ ] Password change invalidates all sessions (if implemented)

---

## Phase 4 — Token storage: httpOnly cookies (backend first, then frontend)

### Current state

Frontend stores JWT in `localStorage` (`stwmovers.auth.v1`):

```typescript
// stores/auth.ts
localStorage.setItem(AUTH_KEY, JSON.stringify({ token: this.token, ... }))
```

Backend returns token in JSON body; `JwtAuthenticationFilter` reads `Authorization: Bearer` header only.

Any XSS can steal the token from `localStorage`.

### Prerequisites

- Phase 2 (refresh tokens) complete
- Phase 3 (server-side logout) complete

### Backend steps

**Step 4.1** — Create `AuthCookieService`:

```java
public ResponseCookie accessTokenCookie(String token, long maxAgeSeconds) {
    return ResponseCookie.from("access_token", token)
        .httpOnly(true)
        .secure(secureCookies)       // true in production
        .sameSite("Lax")
        .path("/")
        .maxAge(maxAgeSeconds)
        .build();
}

public ResponseCookie refreshTokenCookie(String token, long maxAgeSeconds) {
    return ResponseCookie.from("refresh_token", token)
        .httpOnly(true)
        .secure(secureCookies)
        .sameSite("Strict")
        .path("/api/v1/auth")        // limit refresh cookie to auth paths
        .maxAge(maxAgeSeconds)
        .build();
}
```

Add to `application.yml`:

```yaml
app:
  cookie:
    secure: false   # true in production profile
```

**Step 4.2** — Set cookies on auth responses in `AuthController`:

On `login`, `register`, `google`, `refresh`, and after logout (clear cookies):

```java
private void setAuthCookies(HttpServletResponse response, AuthResponse auth) {
    response.addHeader(HttpHeaders.SET_COOKIE,
        authCookieService.accessTokenCookie(auth.getAccessToken(), accessMaxAge).toString());
    response.addHeader(HttpHeaders.SET_COOKIE,
        authCookieService.refreshTokenCookie(auth.getRefreshToken(), refreshMaxAge).toString());
}
```

**Step 4.3** — Dual-mode transition (Stage C): still return tokens in JSON **and** set cookies. Frontend can migrate gradually.

**Step 4.4** — Cookie-only mode (Stage D): add `AuthResponse.withoutTokens()` — strip tokens from JSON response.

**Step 4.5** — Update `JwtAuthenticationFilter.java` to read cookie:

```java
String token = extractBearerToken(request);
if (token == null) {
    token = extractCookie(request, "access_token");
}
```

**Step 4.6** — Verify `CorsConfig.java` (already has `allowCredentials(true)`):

```java
configuration.setAllowedOrigins(appProperties.getCors().getAllowedOrigins());
// Must be explicit origins — NOT "*"
configuration.setAllowCredentials(true);
```

Ensure `CORS_ORIGINS` env includes exact frontend URL (e.g. `http://localhost:3000`).

### Frontend steps (after backend sets cookies)

**Step 4.7** — Add `credentials: 'include'` to all API calls in `services/http/api.ts`:

```typescript
await $fetch<ApiResponse<T>>(path, {
  baseURL: config.public.apiBaseUrl as string,
  credentials: 'include',
  // ...
})
```

**Step 4.8** — Stop persisting token in `stores/auth.ts`:

- Remove `token` from `persistAuth()` → rename to `persistProfile()`
- Persist only: `userId`, `email`, `fullName`, `role`, `profilePictureUrl`
- Remove `refreshToken` from storage (cookies handle it)

**Step 4.9** — Update `isLoggedIn` getter:

```typescript
isLoggedIn: (s) => Boolean(s.userId && s.role),
```

Add optional `sessionVerified` flag after first successful authenticated API call.

**Step 4.10** — Remove Bearer header when cookie auth is active:

```typescript
// api.ts — only during transition
if (opts.auth !== false && auth.token && !config.public.cookieAuth) {
  headers.Authorization = `Bearer ${auth.token}`
}
```

Add feature flag in `nuxt.config.ts`:

```typescript
runtimeConfig: {
  public: {
    cookieAuth: process.env.NUXT_PUBLIC_COOKIE_AUTH === 'true',
  },
},
```

**Step 4.11** — Replace all `auth.token` checks with `auth.isLoggedIn`:

| File | Change |
|------|--------|
| `middleware/admin.ts` | `!auth.isLoggedIn` |
| `pages/dashboard/index.vue` | same |
| `pages/dashboard/account.vue` | same |
| `pages/dashboard/bookings/index.vue` | same |
| `pages/payment.vue` | same |
| `pages/booking.vue` | same |

**Step 4.12** — Update login flows to use `setProfile()` instead of `setSession()`:

- `components/CustomerSignInPanel.vue`
- `pages/driver/login.vue`
- `pages/confirm.vue`
- `pages/guest/booking.vue`
- `pages/booking.vue`

**Step 4.13** — One-time migration in `plugins/init.client.ts`:

Clear old `localStorage` entries that contain a `token` field — force re-login once.

**Step 4.14** — Update refresh logic — refresh via cookie only:

```typescript
refresh() {
  return api<AuthProfileDto>('/api/v1/auth/refresh', {
    method: 'POST',
    auth: false,
    credentials: 'include',
  })
},
```

Remove refresh token from store entirely.

### Files to modify

| Stack | File |
|-------|------|
| Backend | New: `AuthCookieService.java` |
| Backend | `AuthController.java`, `JwtAuthenticationFilter.java`, `CorsConfig.java` |
| Backend | `application.yml` (cookie.secure) |
| Frontend | `services/http/api.ts`, `stores/auth.ts`, `services/api/auth.service.ts` |
| Frontend | `nuxt.config.ts`, `plugins/init.client.ts` |
| Frontend | All files with `auth.token` checks (see Step 4.11) |

### Test

- [ ] Login sets `Set-Cookie` for `access_token` and `refresh_token`
- [ ] Cookies are `HttpOnly` (not visible in `document.cookie`)
- [ ] No token in `localStorage` after login
- [ ] Authenticated API calls work with cookies only
- [ ] Logout clears cookies
- [ ] CORS preflight succeeds from frontend origin
- [ ] Cross-tab logout sync still works (`AUTH_EVENT`)

---

## Phase 5 — CSRF (backend first, then frontend)

### When to implement

**Only after Phase 4 (httpOnly cookies) is live.** Bearer token in `Authorization` header is not vulnerable to CSRF — the browser does not auto-send it.

### Backend steps

**Step 5.1** — Replace CSRF disable in `SecurityConfig.java`:

```java
// REMOVE:
http.csrf(AbstractHttpConfigurer::disable)

// ADD:
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler())
    .ignoringRequestMatchers(
        "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/api/v1/auth/google",
        "/api/v1/auth/refresh",
        "/api/v1/auth/guest/**",
        "/api/v1/auth/logout",
        "/api/v1/payments/webhook",
        "/actuator/**"
    )
);
```

Add `SpaCsrfTokenRequestHandler` (Spring Security 6 SPA pattern).

**Step 5.2** — CSRF cookie (`XSRF-TOKEN`) must be readable by JavaScript (`httpOnly=false`). Auth cookies remain `httpOnly=true`.

**Step 5.3** — Exempt stateless/pre-auth endpoints (listed above). Stripe webhook uses signature verification, not cookies.

### Frontend steps (after backend enables CSRF)

**Step 5.4** — Read CSRF cookie and send on mutating requests in `services/http/api.ts`:

```typescript
function getCsrfToken(): string | undefined {
  if (!import.meta.client) return undefined
  return useCookie('XSRF-TOKEN').value ?? undefined
}

const method = (opts.method ?? 'GET').toUpperCase()
const csrfToken = getCsrfToken()
if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
  headers['X-XSRF-TOKEN'] = csrfToken
}
```

**Step 5.5** — Ensure CSRF token is available after login:

Spring sets `XSRF-TOKEN` on first authenticated request. Trigger a profile fetch (`GET /api/v1/users/me`) immediately after login so the cookie exists before the user submits a form.

**Step 5.6** — Handle 403 CSRF errors:

```typescript
if (status === 403) {
  toast.show('Security token expired. Please refresh the page.', 'error')
}
```

### Files to modify

| Stack | File |
|-------|------|
| Backend | `SecurityConfig.java` |
| Backend | New: `SpaCsrfTokenRequestHandler.java` (if not using Spring built-in) |
| Frontend | `services/http/api.ts` |
| Frontend | Login success handlers (trigger profile fetch post-login) |

### Test

- [ ] POST without `X-XSRF-TOKEN` → 403
- [ ] POST with valid CSRF token → success
- [ ] Login/register (exempt) work without CSRF
- [ ] Stripe webhook unaffected
- [ ] Guest OTP endpoints unaffected

---

## Master checklist — stack and phase order

| Phase | Gap | Stack | Can deploy alone? |
|-------|-----|-------|-------------------|
| 0 | Redis | Backend | ✅ Yes |
| 1 | OTP storage | Backend (+ optional frontend errors) | ✅ Yes |
| 2 | Refresh tokens | Backend → Frontend | ⚠️ Backend first, then frontend |
| 3 | Server-side logout | Backend → Frontend | ⚠️ Backend first, then frontend |
| 4 | Token storage (cookies) | Backend → Frontend | ⚠️ Must deploy together (dual-mode first) |
| 5 | CSRF | Backend → Frontend | ⚠️ Must deploy together |

---

## Full testing checklist (all five gaps)

### OTP storage
- [ ] Guest booking OTP flow end-to-end
- [ ] OTP hash in Redis (not plain digits)
- [ ] Max verify attempts enforced
- [ ] Send rate limit enforced

### Refresh tokens
- [ ] Login issues access + refresh
- [ ] Refresh rotates both tokens
- [ ] Old refresh token rejected
- [ ] Reuse detection revokes all sessions
- [ ] Google sign-in issues refresh token

### Server-side logout
- [ ] Logout invalidates access token (401 on reuse)
- [ ] Logout invalidates refresh token
- [ ] Client state cleared

### Token storage
- [ ] No JWT in `localStorage`
- [ ] Cookies are httpOnly
- [ ] API works with cookies + `credentials: 'include'`
- [ ] CORS works in dev and production

### CSRF
- [ ] Mutating requests require CSRF token
- [ ] Pre-auth endpoints exempt
- [ ] Stripe webhook exempt

### Regression
- [ ] Google sign-in still works
- [ ] Admin and driver route guards still work
- [ ] Guest booking unaffected
- [ ] Payment flow works for logged-in customers

---

## Environment variables

### Backend

| Variable | Purpose |
|----------|---------|
| `REDIS_HOST` | Redis host (default `localhost`) |
| `REDIS_PORT` | Redis port (default `6379`) |
| `CORS_ORIGINS` | Exact frontend origins (comma-separated) |
| `JWT_SECRET` | Signing key (min 32 chars) |
| `JWT_EXPIRATION_MS` | Access token TTL (after Phase 2: 900000) |

### Frontend

| Variable | Purpose |
|----------|---------|
| `NUXT_PUBLIC_API_BASE_URL` | Backend URL — must match CORS origin |
| `NUXT_PUBLIC_COOKIE_AUTH` | Feature flag: `true` when Phase 4 complete |

---

## Summary — what to do on day 1

1. **Backend dev:** Re-enable Redis (Phase 0)
2. **Backend dev:** Implement OTP hashing + Redis store (Phase 1) — ship independently
3. **Backend dev:** Implement refresh tokens (Phase 2)
4. **Backend dev:** Implement server-side logout (Phase 3)
5. **Frontend dev:** Update refresh + logout client logic (Phases 2–3 frontend steps)
6. **Both devs:** Cookie auth dual-mode (Phase 4), then remove Bearer fallback
7. **Both devs:** CSRF (Phase 5) — last step

**Do not touch frontend cookie or CSRF code until backend Phases 2–4 are deployed.**

