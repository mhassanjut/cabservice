# Design consistency and booking QA

## Fixed locally

- Booking layout: exclude the original light checkout from the global dark root override. Restore its light background, dark input text, muted placeholders, and native control colour scheme.
- Navigation: resolve Home versus Fleet using both pathname and hash. Disable automatic pathname-only active classes for drawer links.
- Location inputs: preserve pickup and destination placeholders while Maps loads. Keep the loading hint available to accessibility tools without changing visible label dimensions. Applied to BookingForm and ContactBooking.

## Verification

- Production build, Nuxt typecheck, targeted ESLint, and git whitespace checks passed.
- Browser first-focus check: Select Pickup and Select Destination remained unchanged.
- Browser active-state check: Home selected at /; Our fleet selected at /#fleet.
- Public-page smoke check: services, Insights, About, Contact and Journey render. Checked widths showed no horizontal page overflow.
- Journey now uses a compact introduction with the booking form first on mobile, passenger selection, and optional luggage details.
- Latest booking-form checks: Nuxt typecheck, targeted ESLint, SEO sprint checks, and whitespace checks passed. Empty submission focuses pickup and exposes an accessible error summary; mobile form has no horizontal overflow.
- Location search was unavailable in the local preview, so a complete location-to-vehicle journey remains unverified.

## Still required before claiming full QA

- Obtain the original Figma URL and identify approved desktop/mobile frames and colour tokens. No Figma link was supplied with the screenshots.
- Compare all public templates, booking steps and account screens against those frames, including navbars, logos, text contrast, dropdowns and footer.
- Verify real Places suggestions after a cold refresh and under slow network conditions.
- Complete a test journey through vehicle selection, filters, editing, traveller details, validation and payment with a confirmed sandbox backend/payment setup. Current browser verification does not cover these steps.
- Verify checkout contrast visually with a valid trip in session; /cars redirects when a valid draft is absent.
- Check mobile menu expansion, keyboard focus, back navigation, WhatsApp lead capture and all primary CTAs on each template.
- Recheck staging after pushing; a successful Git push alone does not verify deployment.
