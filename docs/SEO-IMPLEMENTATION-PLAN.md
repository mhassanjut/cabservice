# STW Movers Local SEO Implementation Plan

Date: 2026-09-21
Branch: `seo/local-growth-phase-1`
Mode: Local only. Do not push, deploy, merge, or open a PR until explicitly authorized.

## Completed Local Phase 1 Work

### P0: Remove Search-Engine-Only Content

- Removed the hidden crawlable homepage keyword paragraph.
- Added `HomeServiceClarity.vue`, a visible section clarifying that STW Movers is a Barcelona chauffeur, airport-transfer, private driver, and executive transport service.
- Added natural internal links to airport transfer, chauffeur service, executive travel, and 08015 chauffeur service.

Acceptance checks:
- Homepage has no hidden keyword list.
- Visible copy answers user/entity confusion around “Movers.”
- Links point to real indexable commercial pages.

### P0: Canonical Domain Alignment

- Set frontend canonical host to `https://www.stwmovers.com`.
- Updated frontend env example, backend env example, backend defaults, robots.txt, sitemap.xml, backend URL-related tests, and deployment docs to use the www host where canonical URLs are generated.
- Kept dual-domain production notes only where redirect/referrer coverage is useful.

Acceptance checks:
- Sitemap uses www URLs.
- Robots sitemap directive uses www.
- Nuxt `usePageSeo()` fallback uses www.
- Backend WordPress/public site defaults use www.

### P0: Private Route Noindex

- Added a centralized `robotsForPath()` helper.
- Updated `usePageSeo()` to emit `noindex,follow` for booking, cars, payment, confirmation, login, dashboard, guest, admin, and driver paths.
- Added Nuxt route rules with `X-Robots-Tag: noindex, follow` for private/app routes, including routes that do not call `usePageSeo()`.

Acceptance checks:
- Commercial pages remain indexable.
- Private/app workflow pages are not blocked in robots.txt and instead use noindex/follow.

### P0: Admin Bootstrap Credential Hardening

- Removed the committed admin password fallback from application config and Java defaults.
- Updated `DataInitializer` so admin bootstrap is skipped unless `ADMIN_EMAIL` and `ADMIN_PASSWORD` are explicitly configured.
- Updated backend README and test configuration to avoid documenting the old fallback.

Acceptance checks:
- Backend does not create/reset an admin account from a committed default credential.
- Local/staging can still seed admin access with explicit env vars.

### P1: Safer Entity and Schema Markup

- Updated organization/local business schema to use stable www `@id` values.
- Removed precise address and geo JSON-LD until address legitimacy/public-use status is verified.
- Kept service area, contact, language, organization, website, and service relationships.
- Cleaned service schema URLs and removed taxi/shuttle-style terms that could confuse chauffeur positioning.

Acceptance checks:
- Schema describes STW Movers as chauffeur/airport-transfer/executive transport.
- No fake ratings, reviews, prices, awards, people, or exact geo claims were added.

### P1: 08015 Local Landing Page

- Added `/chauffeur-service-barcelona-08015`.
- Added factual content for BCN airport transfer, early departures, hourly chauffeur, luggage guidance, flight delay handling, child seats on request, Mercedes fleet fit, WhatsApp/quote process, and internal links.
- Added page schema, sitemap entry, and prerender route.

Acceptance checks:
- Page is useful to travellers around 08015.
- Page does not become a postcode doorway page.
- Page avoids strengthening the exact street address.

### P1: Footer Trust and Internal Linking

- Removed placeholder footer legal links from public footer components.
- Removed generic placeholder social link.
- Replaced weak/private footer destinations with service, quote, FAQ, and support links.

Acceptance checks:
- Footer links are real, crawlable, and user-useful.
- Confirmation/private workflow pages are no longer promoted in public footer navigation.

## Remaining Gated Work

### Consent and Analytics

Do not enable or expand GA/Clarity events until consent handling is approved.

Planned events after consent approach:
- `quote_form_start`
- `quote_form_submit`
- `whatsapp_click`
- `phone_click`
- `vehicle_selected`
- `booking_start`
- `payment_start`
- `booking_complete`

Validation:
- Confirm no analytics/session replay requests fire before consent where consent is required.
- Validate event names/properties in GA4 DebugView or GTM Preview.

### Legal / GDPR Pages

Do not invent privacy, terms, cancellation, cookie, or licensing copy.

Needed inputs:
- Final business legal entity details
- Privacy policy text
- Terms/cancellation/payment policy text
- Cookie/consent requirements

### Address / LocalBusiness Verification

Before restoring exact address/geo schema:
- Confirm the address is legitimate for public/local SEO use.
- Confirm Google Business Profile NAP values.
- Confirm opening hours/service area/category values.

### External Service Credentials

Required local/staging values:
- Stripe test secret/public keys and webhook secret
- Google Maps non-production API key with localhost/staging referrer restrictions
- Brevo non-production SMTP/API credentials
- JWT secret
- Admin email/password

Do not commit any of these values.

## Local QA Checklist

- Homepage renders visible service-clarity section.
- Hidden keyword paragraph is absent.
- `/chauffeur-service-barcelona-08015` renders on desktop and mobile.
- `/airport-transfer`, `/chauffeur-service`, `/executive-business-travel`, `/services`, `/journey`, `/faq`, `/tours`, `/contact` render and retain canonical tags.
- `/booking`, `/cars`, `/payment`, `/confirm`, `/login`, `/dashboard`, `/driver`, `/admin`, `/guest/booking` emit noindex/follow behavior.
- Footer links resolve to real pages/anchors.
- Sitemap contains only intended public URLs.
- Robots points to the www sitemap.
- Backend starts with explicit local `ADMIN_PASSWORD`.
- Admin bootstrap skips safely when password is absent.
- No production credentials are used locally.

## Future Push Gate

When and only when the user says `PUSH TO STAGING`:

1. Re-run frontend lint, typecheck, build.
2. Re-run backend tests/package if backend remains touched.
3. Re-run secret scan and diff review.
4. Verify no production secrets or live payment credentials are included.
5. Push `seo/local-growth-phase-1`.
6. Create a PR targeting `staging`.
7. Monitor CI.
8. Stop before merge unless merge is explicitly authorized.
