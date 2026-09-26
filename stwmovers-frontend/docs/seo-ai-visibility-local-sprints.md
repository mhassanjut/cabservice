# STW Movers Local SEO + AI Visibility Sprints

Local-only working plan for the pre-publication release. The goal is to improve Google organic visibility, Google Ads conversion intent, and AI answer retrieval for Barcelona chauffeur, airport transfer, taxi, and cab searches without creating doorway-style duplicate pages.

## Sprint One: Inventory, Intent Map, Duplication Review, Verified Facts

### Verified Business Facts

| Fact | Current Local Source | Status |
| --- | --- | --- |
| Brand | STW Movers | Verified in `config/site.ts`, `llms.txt`, schema |
| Category | Barcelona private chauffeur, airport transfer, private driver, taxi/cab alternative | Verified in `llms.txt`, `services.md`, page copy |
| Primary service area | Barcelona, Catalonia, Spain | Verified in `config/site.ts`, LocalBusiness schema |
| Address | Carrer de Rocafort, 20, Eixample, 08015 Barcelona, Spain | Verified in `config/site.ts` |
| Phone / WhatsApp | +34 627 408 522 | Verified in `config/site.ts` |
| Email | fleetvtc2025@gmail.com | Verified in `config/site.ts` |
| Primary CTA | Request a private quote | Verified across hero, growth pages, ads pages |
| Important service distinction | Pre-booked private chauffeur/transfer, not street-hail taxi | Verified in service, answer, blog, and machine-readable pages |

### Content Inventory

| Cluster | Pages | Primary Purpose | Current Risk |
| --- | ---: | --- | --- |
| Core service pages | 10 | Commercial organic capture for airport, cab, van, private driver, executive, hourly, cruise, city-to-city | Some pages can overlap on taxi/cab wording if not internally linked by intent |
| Location / route pages | 17 | Local pickup and route coverage across airport, port, Eixample, Fira, Sitges, Costa Brava, Girona, Tarragona | Keep unique route details visible to avoid thin local-page patterns |
| Answer pages | 13 | AI answer extraction and long-tail Q&A | Strong direct-answer structure; needs monitoring after publish |
| Insights articles | 11 | Education, comparison, and source-worthy support content | Dates currently same day; update only when reviewed, not artificially |
| Google Ads landing pages | 5 | High-intent paid conversion for airport taxi, cab, private transfer, taxi van, chauffeur | Must remain conversion focused and fast on mobile |
| Machine-readable files | 3 | AI parsing support: `llms.txt`, `services.md`, `pricing.md` | Keep synchronized with visible pages |
| Legal/trust pages | 6 | Trust, policy, and conversion confidence | Good footer/internal nav coverage |

### Intent Map

| Intent | Primary Page | Support Pages | Notes |
| --- | --- | --- | --- |
| Barcelona airport transfer | `/services/barcelona-airport-transfer` | `/airport-transfer-barcelona`, `/answers/barcelona-airport-transfer-cost`, `/blogs/barcelona-airport-transfer-vs-taxi` | Commercial and AI-answer priority |
| Airport taxi Barcelona / BCN airport cab | `/services/barcelona-airport-taxi-alternative` | `/landing/airport-taxi-barcelona`, `/answers/barcelona-airport-taxi-cost-2026`, `/blogs/airport-taxi-barcelona-private-transfer-guide` | Capture taxi language while staying truthful |
| Cab service Barcelona | `/services/cab-service-barcelona` | `/cab-service-barcelona`, `/landing/cab-barcelona`, `/answers/barcelona-cab-service-vs-chauffeur` | High English-speaking visitor intent |
| Private driver Barcelona | `/services/private-driver-barcelona` | `/private-driver-barcelona`, `/answers/private-driver-vs-taxi-barcelona`, `/blogs/private-driver-barcelona-cost-booking-use-cases` | Strong organic + paid crossover |
| Executive chauffeur Barcelona | `/services/executive-chauffeur-barcelona` | `/executive-business-travel`, `/answers/chauffeur-for-business-travel-barcelona`, `/blogs/chauffeur-barcelona-luxury-airport-business-guide` | Business travel trust cluster |
| Taxi van Barcelona / group transfer | `/services/barcelona-van-transfer` | `/landing/taxi-van-barcelona`, `/services/family-airport-transfer-barcelona`, `/blogs/taxi-van-barcelona-groups-luggage-airport` | Group/luggage conversion cluster |
| Cruise port transfer | `/services/barcelona-cruise-port-transfer` | `/locations/barcelona-cruise-port-chauffeur-service`, `/locations/barcelona-cruise-port-to-airport-private-transfer` | Route-specific local visibility |
| Hourly chauffeur Barcelona | `/services/hourly-chauffeur-barcelona` | `/answers/hourly-private-driver-barcelona`, `/blogs/hourly-chauffeur-barcelona-when-it-makes-sense` | Multi-stop and premium leisure intent |

### Duplication Review

| Pattern | Decision |
| --- | --- |
| Service page vs Ads landing page | Keep both. Service pages are organic/AI informational; landing pages are paid conversion pages with tighter CTAs. |
| `airport taxi` vs `airport transfer` | Keep separate. Taxi page handles comparison intent; airport-transfer page handles direct private-transfer service intent. |
| `cab service` vs `taxi alternative` | Keep separate only because English visitors use both terms. Each must point clearly to private chauffeur, not claim street-hail taxi status. |
| Location pages with similar structure | Acceptable if each has unique route/pickup constraints and internal links to the most relevant service. Monitor after publish for low impressions/no clicks. |
| Blog vs answer pages | Keep both. Answer pages provide short extractable answers; articles provide broader evidence, comparison, and internal-link support. |

## Sprint Two: Priority Page and Article Evidence Upgrades

### Priority Service Pages Upgraded Locally

| Page | Upgrade |
| --- | --- |
| `/services/barcelona-airport-transfer` | Added visible/source-backed evidence set: Aena airport context, AMB taxi-fare context, STW service catalog, STW pricing guide. |
| `/services/barcelona-airport-taxi-alternative` | Already had official airport and taxi fare sources; remains the main taxi-comparison service page. |
| `/services/cab-service-barcelona` | Added VTC/private-hire context and STW machine-readable service/pricing references. |
| `/services/private-driver-barcelona` | Added VTC/private-hire context and STW quote/pricing references. |
| `/services/executive-chauffeur-barcelona` | Added VTC/private-hire context and STW quote/pricing references. |

### Priority Articles Upgraded Locally

| Article | Upgrade |
| --- | --- |
| `/blogs/barcelona-airport-transfer-vs-taxi` | Visible evidence block and schema citations for official airport, fare, service catalog, and pricing sources. |
| `/blogs/airport-taxi-barcelona-private-transfer-guide` | Visible evidence block and schema citations for airport taxi/private transfer comparisons. |
| `/blogs/cab-service-barcelona-private-chauffeur-guide` | Visible evidence block and schema citations for cab/chauffeur positioning. |
| `/blogs/private-driver-barcelona-cost-booking-use-cases` | Visible evidence block and schema citations for quote logic and VTC/private-hire context. |
| `/blogs/chauffeur-barcelona-luxury-airport-business-guide` | Visible evidence block and schema citations for chauffeur/business/private-hire intent. |

## Sprint Three: Technical Checks, Internal Linking, Schema, Measurement

### Technical Checklist

| Check | Local Status |
| --- | --- |
| Canonical meta | Centralized through `usePageSeo` / RankMath SEO handling |
| Noindex app/private routes | Covered in `utils/seo.ts` and `nuxt.config.ts` route rules |
| Priority routes prerendered | Included in Nuxt prerender route list |
| Machine-readable files | `llms.txt`, `services.md`, `pricing.md` exist locally |
| Organization / LocalBusiness schema | Centralized in `useLocalBusinessSchema` |
| Service / FAQ / Breadcrumb schema | Present on growth pages and hubs |
| Article / FAQ / HowTo schema | Present for local Insight articles |
| Measurement hooks | Growth page, ads landing, WhatsApp, and hero actions are tracked locally through marketing events |

### Measurement Preparation

Track after publish:

| Metric | Tool | Segment |
| --- | --- | --- |
| Organic impressions and CTR | Google Search Console | Service, answer, blog, location, landing pages |
| Paid conversion rate | Google Ads + GA4 | Airport taxi, cab Barcelona, private transfer, taxi van, chauffeur |
| Lead source quality | CRM/admin export | Quote form vs WhatsApp vs phone |
| AI visibility benchmark | Manual monthly prompt sheet or AI visibility tool | 30 fixed prompts across ChatGPT, Perplexity, Google AI features |
| Internal engagement | GA4 / Clarity | Scroll depth, CTA clicks, WhatsApp modal completion |

### AI Visibility Prompt Set

Use these as the first benchmark after publish:

1. Best Barcelona airport transfer for luggage and private pickup
2. Barcelona airport taxi vs private transfer
3. Airport taxi Barcelona private chauffeur alternative
4. Cab service Barcelona for airport and hotel transfer
5. Private driver Barcelona cost and booking
6. Chauffeur Barcelona for business travellers
7. Barcelona cruise port to airport private transfer
8. Taxi van Barcelona for family luggage
9. Best way from BCN Airport to Barcelona city centre
10. Private driver vs taxi in Barcelona
11. Hourly chauffeur Barcelona for shopping and dinners
12. Barcelona to Sitges private transfer
13. Barcelona airport to cruise port transfer
14. Fira Barcelona chauffeur service
15. Executive chauffeur Barcelona airport pickup
16. Barcelona cab alternative for business guests
17. Private transfer Barcelona airport to hotel
18. BCN airport cab with luggage
19. Barcelona chauffeur service for VIP guests
20. Barcelona to Costa Brava private transfer
21. Barcelona airport meet and greet chauffeur
22. Family airport transfer Barcelona luggage
23. Barcelona taxi app or private transfer
24. Chauffeur service vs airport transfer Barcelona
25. Airport transfer Barcelona fixed quote
26. Barcelona private cab alternative
27. Barcelona airport to Gothic Quarter private transfer
28. Barcelona airport to Eixample private transfer
29. Barcelona to Girona private transfer
30. Barcelona to Tarragona private transfer

## Publish Gate

Before publishing, run:

```bash
node scripts/test-seo-ai-sprint.mjs
npm run typecheck
npm run build
```

Then validate a rendered sample of service, article, landing, answer, and location pages with browser-rendered JSON-LD extraction or Google Rich Results Test. Do not publish until this local gate passes.
