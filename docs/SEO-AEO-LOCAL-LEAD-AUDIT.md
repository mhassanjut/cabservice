# STW Movers SEO, AEO, Local Lead Audit

Date: 2026-09-21
Branch: `seo/local-growth-phase-1`
Baseline: `origin/staging` at `b048b09`
Scope: Local-only Phase 1 audit and safe P0/P1 implementation.

## Executive Summary

STW Movers already has a useful Nuxt SSR foundation, centralized SEO helpers, reusable service-page schema, a sitemap, robots.txt, and strong commercial page coverage for airport transfer, chauffeur service, executive travel, tours, FAQ, and contact.

The highest-impact Phase 1 issues were domain canonical inconsistency, hidden search-engine-only homepage text, private booking/admin pages lacking centralized noindex behavior, overly precise address/geo schema before address verification, footer placeholder links, and a backend admin bootstrap default credential pattern.

## Entity Map

- Brand: STW Movers
- Core category: Barcelona chauffeur, airport-transfer, executive transportation, private driver service
- Primary location: Barcelona, with cautious 08015 relevance
- Primary services: BCN airport transfer, chauffeur service, executive business travel, hourly private driver, private tours, city-to-city transfers
- Routes/destinations represented: Sitges, Girona, Tarragona, Costa Brava and other Catalonia destinations in existing content
- Fleet: Mercedes E Class, S Class, V Class, Vito, Sprinter-style vans, plus other configured vehicles
- Conversion paths: homepage booking form, `/journey`, WhatsApp, phone/email contact, vehicle selection, booking/payment/confirmation
- Trust signals present: visible phone, WhatsApp, email, address display, fleet imagery, FAQ, service pages
- Trust gaps: legal pages/cookie consent need business/legal review; real review/social/profile evidence not verified in repo

## Findings

### 1. Hidden Homepage Keyword Text

PRIORITY: P0
CATEGORY: Technical SEO / Content / Entity
FILE / URL: `stwmovers-frontend/pages/index.vue`
CURRENT STATE: Homepage contained visually hidden crawlable keyword/service lists.
ISSUE: Search-engine-only text violates the project zero-spam rule and creates risk without helping users.
WHY IT MATTERS: Hidden keyword content can reduce trust and create SEO quality risk.
LEAD IMPACT: High, because penalties or distrust hurt qualified leads.
SEO IMPACT: High.
AI VISIBILITY IMPACT: Medium.
RISK: High.
RECOMMENDED ACTION: Remove hidden keyword text and replace with visible, useful service clarification.
FILES TO CHANGE: `pages/index.vue`, `components/home/HomeServiceClarity.vue`, `assets/styles/css/home.css`
TEST REQUIRED: Render homepage and confirm visible copy appears without hidden keyword paragraph.
STATUS: Fixed locally.

### 2. Canonical Domain Split

PRIORITY: P0
CATEGORY: Technical SEO
FILE / URL: `config/site.ts`, `public/robots.txt`, `public/sitemap.xml`, backend public URL defaults
CURRENT STATE: Prompt lists live site as `https://www.stwmovers.com/`, but code and sitemap used `https://stwmovers.com`.
ISSUE: Mixed canonical hosts can split signals across www/non-www.
WHY IT MATTERS: Canonicals, sitemap, schema IDs, emails, and WordPress SEO rewrites should agree.
LEAD IMPACT: Medium.
SEO IMPACT: High.
AI VISIBILITY IMPACT: Medium.
RISK: Medium.
RECOMMENDED ACTION: Use `https://www.stwmovers.com` consistently as public canonical host.
FILES TO CHANGE: frontend/backend config, sitemap, robots, tests, deployment docs
TEST REQUIRED: Build frontend and inspect canonical/sitemap output.
STATUS: Fixed locally.

### 3. Private/Application Routes Indexability

PRIORITY: P0
CATEGORY: Indexability / Technical SEO
FILE / URL: `/admin`, `/dashboard`, `/driver`, `/login`, `/booking`, `/bookings`, `/cars`, `/payment`, `/confirm`, `/guest/**`
CURRENT STATE: Global head defaulted to `index,follow`; private/app routes did not have centralized noindex behavior.
ISSUE: Booking, customer, driver, admin, and payment utility pages can be indexed.
WHY IT MATTERS: These pages are poor landing pages and may expose thin/duplicate/private workflow states.
LEAD IMPACT: Medium.
SEO IMPACT: High.
AI VISIBILITY IMPACT: Low.
RISK: High.
RECOMMENDED ACTION: Add centralized robots meta policy and route-level `X-Robots-Tag`.
FILES TO CHANGE: `utils/seo.ts`, `composables/usePageSeo.ts`, `nuxt.config.ts`
TEST REQUIRED: Inspect rendered meta and response headers locally.
STATUS: Fixed locally.

### 4. Address / Geo Schema Too Strong Before Verification

PRIORITY: P1
CATEGORY: Schema / Local SEO / Trust
FILE / URL: `stwmovers-frontend/composables/useLocalBusinessSchema.ts`
CURRENT STATE: JSON-LD included exact PostalAddress and geo coordinates.
ISSUE: The prompt says not to strengthen the address aggressively until public-use legitimacy is verified.
WHY IT MATTERS: Inaccurate or unverified location markup can conflict with GBP/local trust.
LEAD IMPACT: Medium.
SEO IMPACT: Medium.
AI VISIBILITY IMPACT: Medium.
RISK: Medium.
RECOMMENDED ACTION: Keep organization/service-area entity schema, but remove exact address/geo JSON-LD until verified.
FILES TO CHANGE: `useLocalBusinessSchema.ts`
TEST REQUIRED: Validate JSON-LD and confirm no fake ratings/reviews/address claims are added.
STATUS: Fixed locally.

### 5. Missing Useful 08015 Page

PRIORITY: P1
CATEGORY: Local SEO / AEO / CRO
FILE / URL: `/chauffeur-service-barcelona-08015`
CURRENT STATE: No dedicated 08015 chauffeur page existed.
ISSUE: The site lacked a useful page answering local airport-transfer/private-driver questions around the primary postcode.
WHY IT MATTERS: A restrained local page can support qualified 08015 searches without doorway-page spam.
LEAD IMPACT: High.
SEO IMPACT: Medium.
AI VISIBILITY IMPACT: Medium.
RISK: Medium.
RECOMMENDED ACTION: Create one factual page with booking logistics, airport answers, fleet guidance, and internal links.
FILES TO CHANGE: new page, sitemap, prerender routes, homepage links, footer links.
TEST REQUIRED: Build and manually review desktop/mobile page.
STATUS: Fixed locally.

### 6. Footer Placeholder / Low-Trust Links

PRIORITY: P1
CATEGORY: Trust / CRO / Technical SEO
FILE / URL: `AppFooter.vue`, `HomeFooter.vue`
CURRENT STATE: Footer included placeholder legal links and a generic Instagram URL; generic/private links appeared in public footer.
ISSUE: Placeholder links reduce trust and can waste crawl paths.
WHY IT MATTERS: Footer links are sitewide trust and crawl signals.
LEAD IMPACT: Medium.
SEO IMPACT: Medium.
AI VISIBILITY IMPACT: Low.
RISK: Medium.
RECOMMENDED ACTION: Replace placeholders with verified internal service/quote/support links. Create real legal pages later after legal review.
FILES TO CHANGE: footer components.
TEST REQUIRED: Click footer links locally.
STATUS: Fixed locally.

### 7. Admin Bootstrap Credential Pattern

PRIORITY: P0
CATEGORY: Security
FILE / URL: backend config, backend README, backend test config
CURRENT STATE: A default admin password pattern was committed and documented.
ISSUE: A predictable admin bootstrap credential is high risk if deployed or reused.
WHY IT MATTERS: Admin access controls booking, pricing, customers, drivers, payments, and operational data.
LEAD IMPACT: High.
SEO IMPACT: Low.
AI VISIBILITY IMPACT: Low.
RISK: High.
RECOMMENDED ACTION: Require explicit `ADMIN_EMAIL` and `ADMIN_PASSWORD`; skip admin bootstrap if missing; rotate any environment/account that ever used the committed value.
FILES TO CHANGE: `application.yml`, `AppProperties.java`, `DataInitializer.java`, `.env.example`, README, tests.
TEST REQUIRED: Backend tests and local startup with explicit `ADMIN_PASSWORD`.
STATUS: Fixed locally; rotation/manual verification required.

### 8. Analytics / Consent Review

PRIORITY: P1
CATEGORY: Tracking / GDPR / CRO
FILE / URL: `app.vue`, `plugins/analytics.client.ts`
CURRENT STATE: GA/Clarity load when IDs are configured; no consent-management layer was verified in repo.
ISSUE: EU/Spain traffic likely requires consent handling before analytics/session replay.
WHY IT MATTERS: Tracking before consent can create GDPR compliance risk.
LEAD IMPACT: Medium.
SEO IMPACT: Low.
AI VISIBILITY IMPACT: Low.
RISK: Medium.
RECOMMENDED ACTION: Add or integrate a consent manager before enabling production analytics/Clarity. Define conversion events after consent mode is decided.
FILES TO CHANGE: TBD after consent approach approval.
TEST REQUIRED: Consent state, no pre-consent requests, GA4 DebugView.
STATUS: Documented, not implemented.

### 9. Non-Production External Credentials

PRIORITY: P1
CATEGORY: Environment / Security
FILE / URL: `.env.example`, `application.yml`, Nuxt runtime config
CURRENT STATE: Stripe test placeholders exist; Maps/Brevo values are empty/configurable.
ISSUE: Local testing requires separate test Maps key, Brevo credentials, Stripe test keys, JWT secret, and admin credentials.
WHY IT MATTERS: Avoids production/test leakage and supports safe local QA.
LEAD IMPACT: Medium.
SEO IMPACT: Low.
AI VISIBILITY IMPACT: Low.
RISK: High if production keys are reused locally.
RECOMMENDED ACTION: Provide local-only values through environment variables; never commit secrets.
FILES TO CHANGE: local `.env` only, not committed.
TEST REQUIRED: local frontend/backend integration.
STATUS: Documented; credentials still required.

## Required Manual Verification

- Confirm `https://www.stwmovers.com` is the intended canonical host and non-www redirects to www.
- Verify public-use status of the 08015 address before restoring exact address/geo schema.
- Provide non-production Google Maps API key restricted to localhost/staging.
- Provide non-production Brevo SMTP/API credentials.
- Provide Stripe test keys only for local/staging.
- Provide `ADMIN_PASSWORD` locally/staging and rotate any admin account that used the old committed fallback.
- Confirm legal/privacy/cookie requirements before adding policy pages or consent UI.
