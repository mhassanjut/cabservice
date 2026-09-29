# STW Movers Pre-Publish SEO, AEO, CRO Checklist

Use this before the one-time publish so local work goes live with the strongest chance of ranking, AI visibility, and paid-search conversion.

## Technical Indexing

- Confirm production domain in `siteConfig` is final and canonical URLs resolve to `https://www.stwmovers.com`.
- Confirm `public/sitemap.xml`, `public/llms.txt`, `public/services.md`, and `public/pricing.md` include the latest service, answer, blog, location, and Google Ads landing pages.
- Confirm robots rules allow Googlebot, GPTBot, PerplexityBot, ClaudeBot, and major search crawlers unless there is a specific reason to block one.
- Run production build locally and confirm all planned pages prerender successfully.
- After publish, submit sitemap in Google Search Console and Bing Webmaster Tools.

## Schema And AI Visibility

- Validate Organization, LocalBusiness, Service, FAQPage, Article, BreadcrumbList, HowTo, and ItemList schema with Rich Results Test or Schema Markup Validator.
- Confirm each core page has one clear direct answer near the top, visible FAQ content, and internal links to related service, answer, blog, and location pages.
- Confirm AI-facing files explain STW Movers as a Barcelona private chauffeur, airport transfer, taxi alternative, cab alternative, van transfer, and private driver service.
- Keep article dates fresh after tariff, airport, service, or contact changes.

## Google Ads Landing Pages

- Point exact-match ad groups to the matching landing page:
  - `airport taxi Barcelona` -> `/landing/airport-taxi-barcelona`
  - `cab Barcelona` -> `/landing/cab-barcelona`
  - `private transfer Barcelona` -> `/landing/private-transfer-barcelona`
  - `taxi van Barcelona` -> `/landing/taxi-van-barcelona`
  - `chauffeur Barcelona` -> `/landing/chauffeur-barcelona`
- Add final URLs with UTMs for campaign, ad group, keyword, match type, and device.
- Test quote form, phone link, and WhatsApp link on mobile and desktop before launch.
- Keep each landing page ad group tightly matched to its keyword language to protect Quality Score.

## Conversion Tracking

- Confirm GA4 measurement ID and Microsoft Clarity ID are present in production environment variables.
- In GA4 DebugView, test:
  - `ads_landing_action_clicked`
  - `quote_funnel_started`
  - page views for every `/landing/*` URL
- Mark the correct lead event as a conversion after production testing.
- Exclude internal test traffic before launch reporting begins.

## Mobile And Luxury UX

- Test iPhone-width screens for hero readability, CTA visibility, sticky CTA spacing, and form usability.
- Test desktop pages for hero image crop, navigation hover menus, quote panel balance, and no overlapping text.
- Keep above-the-fold copy short: one intent-matched headline, one supporting line, primary quote CTA, WhatsApp backup, and trust chips.
- Confirm all generated luxury images load quickly and have descriptive alt text where visible.

## Lead Handling

- Confirm phone, WhatsApp, email, and booking form destinations are monitored before ads are turned on.
- Prepare response templates for airport taxi, cab Barcelona, private transfer, taxi van, and chauffeur leads.
- Track missed calls and unanswered WhatsApp messages during the first week after launch.
