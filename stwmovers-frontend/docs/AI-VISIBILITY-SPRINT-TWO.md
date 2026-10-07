# Sprint two: evidence and authority

2026-10-07. Local changes only. Sprint one remains uncommitted and is preserved.

## Implemented

Five existing articles refreshed without changing their URLs or publication dates:

| Slug | Added value |
| --- | --- |
| barcelona-airport-transfer-vs-taxi | Balanced choice, pickup distinctions, full-price comparison |
| airport-taxi-barcelona-private-transfer-guide | T1/T2 confirmation, meeting instructions, baggage delays |
| barcelona-airport-to-cruise-port-transfer-guide | Boarding-deadline planning and disembarkation distinction |
| taxi-van-barcelona-groups-luggage-airport | Seating/luggage combination, child-seat and accessibility confirmation |
| hourly-chauffeur-barcelona-when-it-makes-sense | Worked itinerary and overtime/waiting questions |

The shared article renderer exposes a separate modification date. Structured data preserves datePublished and updates dateModified. Automatic dispatch-team authorship and reviewer assertions removed; organization attribution retained. Van comparisons now have their own decision table.

## Evidence checked

- Aena taxi guidance: https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/getting-there/taxi.html
- Aena private-hire guidance: https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/getting-there/vehicles-for-hire.html
- Port terminal directory: https://www.portdebarcelona.cat/en/business-and-services/cruise-ships/information-passenger/passenger-terminals

The previous Port /en/passengers/cruises URL could not be retrieved; the source link now uses the official terminal directory. No fixed terminal assignment, fare, travel-time guarantee or STW licence claim has been inferred from these sources.

## Pending business approval

Request one owner-approved record of: waiting allowance and start point; overtime/additional-stop charges; cancellation/change rules; exact vehicle seating/luggage capacities; child-seat availability; wheelchair suitability; genuine pickup-point photos with usage permission. Do not fabricate operational review or use generated images as documentary pickup evidence.

## Measurement status

The 30-prompt benchmark in ai-visibility-prompts.csv is ready, but platform observations have NOT been collected. No AI citation rate, recommendation rate or competitor position is claimed. An ordinary web search is not a substitute for the specified AI-platform tests.

Existing referral classifier unit tests cover source identification and internal navigation. GA4 DebugView, consent configuration, real WhatsApp message receipt and CRM-qualified lead outcomes remain unverified. Clicks and handoffs must not be counted as bookings.

## Local authority work queue

1. Owner: supply existing Google Business Profile and other genuine business-profile URLs; compare contact/service facts against the approved register.
2. Operations: collect real vehicle/interior/luggage and approved pickup-point photos. Remove identifiable travellers unless permission exists.
3. Partnerships: shortlist actual hotels, concierges and event agencies already served. Offer useful arrival instructions, not paid ranking links.
4. Customer service: invite all eligible completed-trip customers to leave honest feedback; no reward, fabricated review or positive-only filtering.
5. Marketing: record each earned reference, source URL, date and relationship disclosure. No outreach or account changes have been performed in this sprint.

## Release gate

Run lint, typecheck, tests, SEO sprint checks and build. Review a rendered article on mobile/desktop, approve facts and privacy handling, then request staging publication permission. Complete live visibility and analytics checks separately before claiming this sprint fully measured or released.
