# Standardization baseline and progress

Baseline: staging commit e9289bc. Inventory established 2026-10-06.

## Representative routes and journeys

| Family | Routes / components | Critical checks |
| --- | --- | --- |
| Home | /, HomeHero, BookingForm, AppNavbar | Stable scroll, mobile rails, dropdowns, quote links |
| Service and local | /services/barcelona-airport-transfer, /locations, GrowthSeoPage, GrowthSeoHub | Readable CTAs, links, mobile layout, metadata |
| Answers | /answers, GrowthSeoHub | Shared quote CTA and question hierarchy |
| Insights | /blogs, /blogs/[slug] | Latest first, canonicals, article/schema consistency |
| Booking | /cars, /booking, /payment, /confirm | Valid draft, refresh/back, guest/auth, failure and success |
| Account | /dashboard/*, /driver/*, /admin/* | Role enforcement and API authorization |

External boundaries: backend HTTP API, Google Places and sign-in, Stripe,
WordPress content and WhatsApp handoff. Browser route guards are not substitutes
for backend authorization, pricing validation or payment verification.

## Completed in the first implementation milestone

- Semantic control colours, sizes, focus, error and disabled states.
- Shared UiButton and UiTextField with typed variants/props.
- Location/answer hub and service detail quote CTAs migrated.
- Guest name/email fields and Continue button migrated.
- PhoneInput consumes semantic field colours, including the country dropdown.
- Component behaviour and 14 colour-pair regression assertions in Vitest.
- CI now runs lint and regression tests before builds.
- Developer standards and examples added; architecture version corrected.

## Remaining milestones (not claimed complete)

1. Capture and approve automated screenshot/SEO baselines for each route family.
2. Migrate remaining legacy controls in small, reviewed template batches.
3. Add runtime schemas for API responses and persisted booking drafts; define
   expiry policy and audit all submission paths for duplicate requests.
4. Add browser regression tests with isolated booking/API fixtures, accessibility
   scans and screenshot comparisons. Include authenticated checkout and sandbox
   payment outcomes. Do not send test leads to production.
5. Verify backend pricing, authorization, payment idempotency and webhook handling.
6. Add post-deployment smoke checks and atomic rollback after deployment review.
7. Resolve pre-existing lint/dependency findings in separately tested updates.

The earlier 88-route public check did not cover protected or payment flows. This
milestone's component tests do not imply full-site accessibility certification,
zero defects, or complete end-to-end coverage.
