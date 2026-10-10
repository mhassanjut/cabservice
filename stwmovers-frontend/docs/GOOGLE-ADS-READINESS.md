# Google Ads Readiness

## Website-side status

- Dedicated landing pages exist for airport taxi, cab, private transfer, taxi van, and chauffeur intent under `/landing/`.
- Each landing page leads to the live vehicle-and-fare booking flow; the page does not promise an unverified fixed price.
- Optional measurement is consent-gated. Declining it does not block browsing or booking.
- GA4 `purchase` and the optional Google Ads purchase conversion fire only after a confirmed booking, and are deduplicated by booking reference in the browser session.
- Campaign parameters and Google click IDs are retained in session storage only after optional measurement consent. Do not treat client-side attribution as a substitute for backend/CRM capture.

## Runtime configuration

Set these in the deployment environment, never in source code:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NUXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Recommended | GA4 measurement ID (`G-...`) |
| `NUXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` | For direct Ads conversion | Google Ads tag ID (`AW-...`) |
| `NUXT_PUBLIC_GOOGLE_ADS_PURCHASE_CONVERSION_LABEL` | For direct Ads conversion | Conversion label for the confirmed-booking action |
| `NUXT_PUBLIC_MICROSOFT_CLARITY_ID` | Optional | Clarity project ID; loads only after optional measurement consent |

Create a dedicated Google Ads conversion action for a completed paid/confirmed booking. Use EUR as the value currency, `transaction_id` as the order identifier, and configure the action as the account's primary conversion only after confirming the business definition with the booking/payment owner. Do not make CTA clicks primary conversions.

## Account and operations work still required

1. Link Google Ads and GA4, enable auto-tagging, and confirm the correct production web stream/property.
2. In Google Ads, map the landing pages to tightly themed Search ad groups. Start with airport taxi/airport transfer and brand protection; keep cab, private transfer, van, and chauffeur intent separate. Use exact/phrase match initially and review search terms frequently.
3. Add negatives for unrelated transport intent (jobs, driver hiring, bus/train, public transport, vehicle rental, removals/moving-company queries). Review search terms before expanding broad match.
4. Target only serviceable geographies and set location presence to people in or regularly in the target locations. Exclude locations the operation cannot serve.
5. Configure call assets, business hours, language, final URLs, and campaign-level UTM conventions. Test mobile call and WhatsApp paths as secondary actions, not booked-lead proof.
6. Verify the consent prompt and tags in Tag Assistant/GA4 DebugView, then complete a real low-risk end-to-end booking in staging. Confirm one purchase event with correct EUR value and booking reference; test reject and accept consent separately.
7. Connect the booking backend/CRM to persist consented click IDs and qualified lead outcomes, then import offline qualified-lead/booking conversions. This is needed to optimize to sales quality instead of form starts or messaging clicks.
8. Add call reporting and conversion tracking only with an approved number/forwarding setup. Reconcile Ads conversions against confirmed bookings weekly.

## Release acceptance checks

- A visitor who rejects optional measurement creates no GA4, Google Ads, or Clarity measurement requests.
- A visitor who accepts optional measurement sees campaign attribution retained for the session and page events in GA4.
- A confirmed booking emits one GA4 `purchase`; when Ads ID and label are configured, it emits one Ads `conversion` with EUR value and booking reference.
- Pending, failed, and unconfirmed bookings emit no purchase conversion.
- Booking remains functional with consent declined, scripts blocked, or analytics IDs absent.
- Ads final URLs resolve directly, render the correct unique page title/H1, and reach the same tested booking flow on mobile and desktop.

## Current limitation

This code does not configure the Google Ads account, campaigns, billing, keywords, budgets, conversion-action settings, GA4 links, or backend/CRM offline conversion imports. Those require account access and operational confirmation. Client-side purchase measurement is not verified until the deployment IDs are configured and a real booking is tested in the connected accounts.
