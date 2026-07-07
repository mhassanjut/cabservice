# Production deployment — STW Movers (Hostinger KVM 2 VPS)

Use this checklist after purchasing Hostinger KVM 2. The repo uses **one VPS** with Nginx, PostgreSQL, Spring Boot API, and Nuxt SSR frontend.

---

## 1. Domain and DNS

- [ ] Register or point domain (e.g. `stwmovers.com`) to VPS public IP (A record `@` and `www`).
- [ ] Add API subdomain A record: `api.stwmovers.com` → same VPS IP (or separate host if you split later).
- [ ] Wait for DNS propagation (up to 24–48h; often minutes).

---

## 2. VPS initial setup (Ubuntu 22.04/24.04 recommended)

- [ ] SSH in as root: `ssh root@YOUR_VPS_IP`
- [ ] Create deploy user: `adduser stwmovers` + `usermod -aG sudo stwmovers`
- [ ] Configure SSH key auth; disable password login for root when keys work.
- [ ] `sudo apt update && sudo apt upgrade -y`
- [ ] Install: `openjdk-21-jdk`, `postgresql`, `postgresql-contrib`, `nginx`, `certbot`, `python3-certbot-nginx`, `nodejs` (20 LTS via NodeSource), `rsync`, `ufw`
- [ ] Firewall: `ufw allow OpenSSH`, `ufw allow 'Nginx Full'`, `ufw enable`

Suggested directories:

```text
/opt/stwmovers/backend/     # app.jar, .env, uploads/
/opt/stwmovers/frontend/    # Nuxt .output/
/var/lib/postgresql/        # database data
```

---

## 3. PostgreSQL

- [ ] Create DB and user:

```sql
CREATE USER stwmovers WITH PASSWORD 'strong-random-password';
CREATE DATABASE stwmovers OWNER stwmovers;
```

- [ ] Restrict PostgreSQL to localhost (`/etc/postgresql/*/main/pg_hba.conf`).
- [ ] Flyway migrations run automatically on backend startup — no manual SQL needed if JAR starts cleanly.

---

## 4. Backend environment (never commit real values)

Create `/opt/stwmovers/backend/.env` (or systemd `EnvironmentFile`):

| Variable | Production value |
|----------|------------------|
| `DB_URL` | `jdbc:postgresql://localhost:5432/stwmovers` |
| `DB_USER` | `stwmovers` |
| `DB_PASSWORD` | Strong password from step 3 |
| `JWT_SECRET` | **New** random string ≥ 32 bytes (e.g. `openssl rand -base64 48`) — **never reuse dev secret** |
| `CORS_ORIGINS` | `https://stwmovers.com,https://www.stwmovers.com` |
| `STRIPE_API_KEY` | `sk_live_...` from Stripe Dashboard (Live mode) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from Live webhook endpoint |
| `STRIPE_SUCCESS_URL` | `https://stwmovers.com/confirm` |
| `STRIPE_CANCEL_URL` | `https://stwmovers.com/payment?cancelled=1` |
| `GOOGLE_CLIENT_ID` | Production OAuth Web client ID |
| `MAIL_HOST` / `MAIL_USERNAME` / `MAIL_PASSWORD` | Brevo (or provider) production SMTP |
| `MAIL_FROM` | Verified sender address in Brevo |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Change from defaults; use strong admin password |
| `SERVER_PORT` | `8080` (internal; Nginx proxies to this) |
| `CAR_UPLOADS_DIR` | `/opt/stwmovers/backend/uploads/cars` |

Load in systemd unit (see section 7).

---

## 5. Frontend environment (build-time for Nuxt)

Set on VPS build or in GitHub Actions secrets for deploy:

| Variable | Production value |
|----------|------------------|
| `NUXT_PUBLIC_API_BASE_URL` | `https://api.stwmovers.com` |
| `NUXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Maps JavaScript API key (HTTP referrer restricted) |
| `NUXT_PUBLIC_GOOGLE_CLIENT_ID` | Same as backend `GOOGLE_CLIENT_ID` |
| `NUXT_PUBLIC_STRIPE_PUBLIC_KEY` | `pk_live_...` |

Update `stwmovers-frontend/config/site.ts` → `siteUrl: 'https://stwmovers.com'` before production build.

---

## 6. SSL (HTTPS) — free with Let's Encrypt

```bash
sudo certbot --nginx -d stwmovers.com -d www.stwmovers.com -d api.stwmovers.com
```

- [ ] Confirm auto-renewal: `sudo certbot renew --dry-run`
- [ ] Force HTTPS redirects in Nginx.

---

## 7. Systemd services

**Backend** `/etc/systemd/system/stwmovers-backend.service`:

```ini
[Unit]
Description=STW Movers API
After=network.target postgresql.service

[Service]
User=stwmovers
WorkingDirectory=/opt/stwmovers/backend
EnvironmentFile=/opt/stwmovers/backend/.env
ExecStart=/usr/bin/java -jar /opt/stwmovers/backend/app.jar
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Frontend** `/etc/systemd/system/stwmovers-frontend.service`:

```ini
[Unit]
Description=STW Movers Nuxt SSR
After=network.target

[Service]
User=stwmovers
WorkingDirectory=/opt/stwmovers/frontend
Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=3000
EnvironmentFile=/opt/stwmovers/frontend/.env
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now stwmovers-backend stwmovers-frontend
```

---

## 8. Nginx reverse proxy (sketch)

- `stwmovers.com` / `www` → `proxy_pass http://127.0.0.1:3000` (Nuxt)
- `api.stwmovers.com` → `proxy_pass http://127.0.0.1:8080` (Spring Boot)
- Serve uploaded car images: `location /api/v1/media/` → backend
- Client body size for uploads: `client_max_body_size 10M;`

---

## 9. Stripe (production)

- [ ] Activate Stripe account (business verification, bank account).
- [ ] Switch Dashboard to **Live** mode.
- [ ] Create Live webhook: `https://api.stwmovers.com/api/v1/payments/webhook`
  - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed` (match what `StripePaymentGateway` expects).
- [ ] Copy Live `sk_live_...` → `STRIPE_API_KEY`
- [ ] Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`
- [ ] Copy `pk_live_...` → `NUXT_PUBLIC_STRIPE_PUBLIC_KEY`
- [ ] Update success/cancel URLs to production domain.
- [ ] Run a small real test payment; confirm booking status updates.

---

## 10. JWT and auth

- [ ] Generate production-only `JWT_SECRET` (long, random).
- [ ] Store only on server + GitHub encrypted secrets (if CI injects); never in git.
- [ ] Rotating JWT secret logs out all users — plan maintenance window if rotating later.
- [ ] Google OAuth: in Google Cloud Console add authorized origins `https://stwmovers.com` and redirect URIs if required by your flow.
- [ ] Restrict Maps API key by HTTP referrer: `https://stwmovers.com/*`, `https://www.stwmovers.com/*`.

---

## 11. Email (Brevo / SMTP)

- [ ] Verify domain in Brevo (SPF, DKIM, DMARC DNS records).
- [ ] Use verified `MAIL_FROM` address.
- [ ] Test OTP / booking emails from production API.

---

## 12. GitHub Actions secrets (repo → Settings → Secrets → production environment)

| Secret | Purpose |
|--------|---------|
| `VPS_HOST` | VPS IP or hostname |
| `VPS_USER` | `stwmovers` deploy user |
| `VPS_SSH_KEY` | Private key for deploy (public key in `~/.ssh/authorized_keys`) |
| `VPS_BACKEND_PATH` | `/opt/stwmovers/backend` |
| `VPS_FRONTEND_PATH` | `/opt/stwmovers/frontend` |
| `NUXT_PUBLIC_API_BASE_URL` | `https://api.stwmovers.com` |
| `NUXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Production Maps key |
| `NUXT_PUBLIC_GOOGLE_CLIENT_ID` | Production OAuth client |
| `NUXT_PUBLIC_STRIPE_PUBLIC_KEY` | `pk_live_...` |

CI is free on public repos; private repos have a monthly Actions minutes allowance.

---

## 13. Google / legal / SEO verification

- [ ] Google Search Console — verify `stwmovers.com` (DNS TXT or HTML file).
- [ ] Google Business Profile (if applicable for local Barcelona transfers).
- [ ] Privacy policy + cookie notice (GDPR if EU customers).
- [ ] Terms of service for bookings and payments.
- [ ] Cookie consent if using Google Maps / Analytics.

---

## 14. Security hardening

- [ ] Change default admin password immediately after first deploy.
- [ ] PostgreSQL not exposed to public internet.
- [ ] Backend actuator only internal or disabled in production.
- [ ] Rate limiting enabled (`app.rate-limit.enabled=true`).
- [ ] Regular `apt upgrade` and JVM/OS security patches.
- [ ] Backups: daily PostgreSQL dump + `uploads/cars/` directory.

---

## 15. Post-deploy smoke test

- [ ] Home → book trip → cars list → checkout → Stripe test/live payment → confirm page.
- [ ] Admin login at `https://stwmovers.com/admin/login`.
- [ ] Upload car image in admin; verify on `/cars`.
- [ ] Pickup validation (Barcelona / Tarragona / Girona).
- [ ] Route pricing admin + fare on booking.
- [ ] WhatsApp floating button and contact flows.

---

## 16. Ongoing operations

- [ ] Monitor logs: `journalctl -u stwmovers-backend -f`, `journalctl -u stwmovers-frontend -f`
- [ ] Disk space for `uploads/cars/` and PostgreSQL growth.
- [ ] Stripe Dashboard for disputes and payouts.
- [ ] Renew domain and review Hostinger VPS billing.

---

## Quick reference — what runs where

| Component | Port (internal) | Public URL |
|-----------|-----------------|------------|
| Nuxt SSR | 3000 | `https://stwmovers.com` |
| Spring Boot API | 8080 | `https://api.stwmovers.com` |
| PostgreSQL | 5432 | localhost only |
| Uploaded car images | via API | `https://api.stwmovers.com/api/v1/media/cars/...` |
