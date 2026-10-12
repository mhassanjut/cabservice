# Competitive Website Implementation

Date: 12 October 2026
Scope: Website changes from the competitive audit, with existing Nuxt 4 / Vue / TypeScript and Spring Boot architecture retained.

## Implemented

- Campaign pages now use a quiet booking-support header and the real booking form in the hero. Mobile pages have one campaign action bar rather than additional global floating controls.
- One-way transfer pricing is distinguished from hourly and multi-stop requests. Hourly and event service pages point to a tailored itinerary request.
- Eight routes have individual pickup, destination, timing, vehicle-fit and confirmation checklists. Official airport, port and venue references support relevant facts; these references do not imply endorsement of STW Movers.
- Five existing articles received practical planning sections. Other affected articles and pages were cleaned of internal targeting instructions and linked to preferred service pages.
- Airport, private-driver and cab aliases remain accessible but use preferred service canonicals. Campaign-only `/landing/*` pages are `noindex,follow`; they remain crawlable for Ads review.
- Sitemap output is generated from content records, excludes aliases and campaign pages, and uses content modification dates instead of deployment timestamps. Existing CMS article URLs remain in the sitemap.
- Schema no longer asserts an unverified legal name, unpriced in-stock offers, or synthetic comparison lists. FAQ content remains useful, without promising a Google FAQ rich result.
- Consent-granted campaign attribution is sanitized in the browser and again on the backend, saved with bookings, and available only through the admin detail response. Unknown fields and URL query strings are excluded. Declining measurement does not block booking.
- Privacy copy describes campaign attribution and the difference between clearing browser data and deleting an already-saved booking record.
- The duplicate route-page mobile action bar was removed.
- CMS failures now return a meaningful unavailable/not-found status instead of a 200 page with no article/title.

## Campaign Destinations

| Ad Group | Website URL |
| --- | --- |
| Airport taxi | https://www.stwmovers.com/landing/airport-taxi-barcelona |
| Cab Barcelona | https://www.stwmovers.com/landing/cab-barcelona |
| Private transfer | https://www.stwmovers.com/landing/private-transfer-barcelona |
| Taxi van | https://www.stwmovers.com/landing/taxi-van-barcelona |
| Chauffeur Barcelona | https://www.stwmovers.com/landing/chauffeur-barcelona |

These are website destinations, not confirmation that campaigns have been created or approved. Actual pricing and availability still come from the existing booking services.

## Verification and Release Gate

- `npm run check`: lint, Nuxt typecheck and 63 frontend tests passed. Seven pre-existing lint warnings remain.
- `npm run seo:sprint-check`: passed.
- Production Nuxt build: passed.
- Complete backend suite with Java 21: 20 tests passed, including three attribution safeguards.
- Browser checks covered 320px, 390px, 768px and desktop widths, mobile CTA scrolling, and the two-field WhatsApp dialog without sending a message or creating a booking.
- The production-rendered crawl initially checked 91 URLs: 88 passed; three CMS articles had missing local metadata while their CMS/API dependency was unavailable. The error-status fix avoids presenting those outages as successful article pages. Recheck those articles with the real backend/CMS connected before release.
- The final rendered crawl again passed 88 URLs; the same three unavailable CMS articles now correctly returned HTTP 503. This remains a release verification dependency, not a fully passing whole-site crawl.
- Run backend tests with Java 21, not the machine's Maven-default Java 27: `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home mvn test` on this Mac. Use your own Java 21 location elsewhere.
- Flyway migration `V21__booking_marketing_attribution.sql` adds a nullable booking column. Apply it through the normal backend deployment process; do not deploy new persistence code against an unmigrated schema. A database migration and authenticated booking/payment test have not been executed here.
- Rendered check: start the production server, then run `npm run seo:rendered-check -- http://127.0.0.1:3003 /landing/airport-taxi-barcelona /landing/cab-barcelona /landing/private-transfer-barcelona /landing/taxi-van-barcelona /landing/chauffeur-barcelona`. It checks all sitemap URLs plus supplied paths and exits nonzero on failures.

## Deferred By Request

The user chose to skip verified legal/operator details, waiting and cancellation rules, genuine review-profile links, a monitored branded email, and the Google Ads conversion action choice for now. These have not been invented or labelled complete.

Further work requiring business/account evidence:

1. Verify business identity, licences, address and booking policies; obtain operational approval of public claims.
2. Add genuine review evidence and real fleet/driver photographs with permission, without fabricated review schema or ratings.
3. Select one primary purchase conversion approach in Google Ads (GA4 import or direct Ads action), verify transaction deduplication, and test it with consent. Do not count both actions as primary purchases.
4. Validate the entire guest/authenticated booking, payment, receipt and cancellation flow against staging services.
5. Connect Search Console and Ads reporting, submit the updated sitemap, and monitor canonical selection and lead quality after release.
6. Collect the existing AI prompt-panel observations with dates, engines, citations and referral/conversion outcomes. No AI recommendation or ranking guarantee is implied by adding schema or content.
7. Build local partnerships and consistent third-party business listings; these cannot be completed through website code alone.
8. Add Spanish only when translation, support, booking messages and policy review can be maintained end to end.

Production rollout and database migration status must be verified against the deployment workflows and live services after merging to `main`.
