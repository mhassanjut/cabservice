# AI visibility: evidence and measurement sprint

Prepared 2026-10-07. Local implementation, not a production audit or measured visibility claim.

## Status and ownership

| Deliverable | Status | Owner / next step |
| --- | --- | --- |
| Five existing service pages | Updated locally; no new duplicate URLs | Developer: checks and staging review |
| Business facts register | Repository evidence separated from external verification | Business owner: approve operational facts |
| Thirty bilingual prompts | Ready; no platform observations collected | Marketing: run controlled baseline |
| Referral classification | Added to existing marketing events; memory only | Analytics owner: validate consent and GA4 configuration |
| Qualified leads and booking attribution | Not implemented end-to-end | CRM/backend owner: approved identifier and consent design |
| Production indexing/crawler access | Not verified | Search Console / hosting owner |
| Independent mentions, reviews, original photographs | Not collected | Operations and partnerships |

## Business facts register

Repository consistency does not verify real-world facts. Do not treat the old sprint document's "verified" labels as independent checks.

| Fact | Current evidence | Verification status / publication rule |
| --- | --- | --- |
| Brand: STW Movers | config/site.ts and site copy | Repository-consistent; legal/trading-name relationship needs owner confirmation |
| Phone: +34 627 408 522 | config/site.ts | Existing published contact; owner must confirm control and hours |
| Email: fleetvtc2025@gmail.com | config/site.ts | Existing published contact; delivery not tested |
| Rocafort 20, 08015 Barcelona | config/site.ts | Not proof of staffed premises or Business Profile eligibility |
| Pre-booked private chauffeur positioning | Existing service copy | Retained; do not imply official street-hail taxi status |
| BCN T1/T2 taxi and private-hire arrangements | Aena links below checked 2026-10-07 | External transport context only; not an endorsement of STW |
| Vehicle capacity / actual fleet | Booking data and generated imagery | Require actual vehicle specifications and genuine fleet photos |
| Child seats / accessibility | Requests in page copy | Availability and suitability must be explicitly confirmed; no blanket guarantee |
| Waiting, overtime, cancellation | Existing policies need operational reconciliation | Do not invent allowance, cutoff or price |
| Insurance / licences | No documents reviewed | Do not add licence numbers or regulated-service claims without evidence |
| Dispatch review / author expertise | No signed review evidence | Automatic dispatch-review attribution removed from growth pages |
| Review scores / punctuality / trip counts | No verified dataset | Do not publish invented ratings, statistics or testimonials |

Approval record: fact, evidence location, approver, approval date, scope, next review date. Keep private supporting documents outside the public repository.

## Intent and duplication decisions

| Primary URL | Owns | Supporting intent / decision |
| --- | --- | --- |
| /services/barcelona-airport-transfer | Private BCN transfer booking | Airport locations describe route/access; articles compare options |
| /services/private-driver-barcelona | Point-to-point and multi-stop private driver | Hourly page owns duration-specific service terms |
| /services/executive-chauffeur-barcelona | Meetings and corporate itinerary planning | Business article explains planning; not another identical sales page |
| /services/barcelona-cruise-port-transfer | Cruise transfer booking | Direction-specific airport/port pages need distinct connection guidance |
| /services/barcelona-van-transfer | Group seating and luggage fit | Family article explains child/luggage requirements without promising capacity |
| /services/barcelona-airport-taxi-alternative | Taxi versus pre-booked alternative | Retain only as a genuinely useful comparison, not keyword substitution |
| /services/cab-service-barcelona | Potential overlap with private driver | Review query data before merging; terminology alone is not sufficient distinction |

Do not redirect or change canonicals without checking production indexing, inbound links and queries. Paid landing pages do not automatically need organic indexing. Inventory all existing page families before deciding their indexability.

Existing inventory: docs/seo-ai-visibility-local-sprints.md; data/growthSeoPages.ts; data/localBlogArticles.ts; data/adsLandingPages.ts; config/prerenderRoutes.ts. Earlier page counts are historical, not a fresh crawl.

## Benchmark protocol

Use ai-visibility-prompts.csv: 15 intents in English and Spanish (30 prompts). Run on ChatGPT Search, Perplexity and available Google AI features. A normal web search by the developer is not a ChatGPT/Perplexity visibility observation.

Record each run separately: prompt_id, UTC timestamp, platform, product/model if visible, search enabled, language, actual test location, signed-in state, run number, AI answer shown, brand mentioned, owned-domain citation URL, third-party brand source URL, explicit recommendation, competing brands, cited competitor URLs, factual errors, evidence/screenshot path. Use fresh conversations; never seed the prompt with the brand for non-branded tests.

Repeat the same sample weekly, with two independent runs when feasible. Report results by platform and language, including unavailable/failed tests; never treat missing results as zero visibility. Recommendation rate and owned-citation rate = qualifying observations / valid answered observations. Separately report how often Google actually shows an AI answer. Do not compare different samples as a trend.

Baseline status: NOT COLLECTED. No ranking, mention rate or competitor leadership is established by this document. Set numerical growth targets after the baseline.

## Measurement implementation and limits

- Existing marketing events now carry ai_referral_source only for recognized source parameters or referring hosts.
- Attribution is retained in browser memory during SPA navigation, not cookies or local storage. Refresh/direct returns may lose it.
- No raw referrer, query, name, email, phone, pickup or destination is added by this classifier.
- whatsapp_lead_handoff means the WhatsApp handoff was attempted, not that a message was sent or a qualified lead received.
- CTA clicks are not generate_lead events. Confirmed backend/CRM outcomes are needed for lead quality and revenue reporting.
- In GA4, register ai_referral_source as an event-scoped custom dimension only after analytics/consent review. Do not enable new live integrations in this sprint.
- Test a landing URL with ?utm_source=chatgpt.com, navigate internally, then trigger a quote CTA; inspect the existing event payload and GA4 DebugView when configured.
- Test ordinary Google/referrerless traffic: no AI label should be emitted. Google AI traffic cannot be isolated from all organic traffic using this classifier.
- Audit the existing analytics consent policy before production approval; this sprint does not certify compliance.

## Evidence checked

- https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/getting-there/taxi.html
- https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/getting-there/vehicles-for-hire.html
- https://developers.google.com/search/docs/appearance/ai-features
- https://help.openai.com/en/articles/12627856-publishers-and-developers-faq

Aena supports airport transport distinctions, not STW operational promises. Google requires ordinary search eligibility, not special AI schema or llms.txt. OAI-SearchBot discovery is separate from GPTBot training permissions; existing robots settings were not expanded.

## Next gates

1. Run npm run check, npm run seo:sprint-check and npm run build.
2. Review mobile/desktop samples and rendered schema; preserve URLs and H1s.
3. Obtain business-fact sign-off and analytics/consent approval.
4. With permission, deploy staging; then inspect production eligibility separately.
5. Collect the platform benchmark and GSC/GA4 baseline; no fabricated measurements.
6. Upgrade five existing articles using original photos and verified facts; pursue genuine partner references. Do not mass-publish location clones or buy links.
