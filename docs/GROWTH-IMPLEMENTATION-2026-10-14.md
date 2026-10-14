# Growth sprint: 14 October 2026

## Implemented locally

- Five service pages now explain pickup, waiting, itinerary, luggage or venue requirements and link to relevant guides.
- Article contents, quote actions and related links emit consent-aware analytics events. These are interactions, not confirmed leads or purchases.
- Production deployment workflows now fail if the public API or priority website pages do not respond successfully after deployment.

## Intent ownership

| Intent | Primary destination | Supporting content |
| --- | --- | --- |
| Book BCN transfer | /services/barcelona-airport-transfer | Pickup, comparison and cost guides |
| Plan several stops | /services/private-driver-barcelona | Driver cost and hourly guides |
| Business guest transport | /services/executive-chauffeur-barcelona | Business comparison and Fira location |
| Cruise connection | /services/barcelona-cruise-port-transfer | Cruise guide and airport/port routes |
| Group vehicle fit | /services/barcelona-van-transfer | Group luggage guide and family answers |

## Measurement specification

Use article_action_clicked with article_slug, page_path, action and location. Report quote_started separately from accepted enquiries and confirmed purchases. No customer contact information is included in these events. Optional measurement remains gated by consent.

Establish Search Console and analytics baselines before setting numerical traffic targets. Compare non-brand clicks, relevant impressions, enquiries and confirmed bookings at 28 and 56 days after deployment. Record AI observations with query, engine, language, date, cited URL and whether the brand is mentioned; referral traffic cannot measure all citations.

## External dependencies and remaining work

- Public API returned HTTP 502 on this sprint's check. Server logs/access are required to establish the startup failure; adding a deployment check does not fix it.
- Three existing CMS articles returned 503 during the preceding local crawl. Verify CMS connectivity in production.
- Verified legal identity, business rules, review profiles and branded email remain pending owner input.
- Google Ads purchase action choice, account configuration and real transaction verification remain pending. Do not configure both direct Ads and GA4 imports as primary for the same purchase.
- Search Console exports are needed to validate query priorities, cannibalisation and indexation.
- Off-page work requires real partner relationships and customer reviews; none have been claimed as published.
- Obtain permitted real fleet and staff photographs before representing generated illustrations as business proof.
- Production workflow changes previously required credentials with workflow scope; these edits have not been pushed.

## Next controlled release

Resolve API availability with the server operator, run a complete booking/payment journey in a suitable test environment, review service-page rendering and deploy the verified changes. Continue with field-performance measurements and evidence-led content updates after baseline collection.
