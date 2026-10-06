# Frontend engineering standards

## Scope and ownership

This is a Nuxt 4 SSR application using Vue 3, TypeScript and Pinia. Keep the
existing root-level directory structure; a folder migration is not a prerequisite
for maintainability. Do not change public URLs or SEO copy during UI refactoring.

| Location | Responsibility |
| --- | --- |
| pages/ | Route composition, metadata and page-specific orchestration |
| layouts/ | Public, home, service, booking, customer and admin shells |
| components/ui/ | Reusable controls with documented variants and states |
| components/seo/ | Shared service, location and answer templates |
| composables/ | Reusable reactive behaviour and lifecycle cleanup |
| services/api/ and services/http/ | API transport and domain requests |
| stores/ | Shared application state and draft persistence |
| data/ and config/ | Content, route inventories and configuration |
| utils/ | Pure transformations and validation |
| tests/ | Component behaviour and colour-contrast contracts |

## Local setup and checks

Use an active supported Node LTS matching CI (currently the Node 24 line).
The Nuxt engine range in package.json is authoritative. The current machine was
running Node 25 during this milestone; npm reports it as unsupported.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 3002
npm run check
npm run build
```

Use the documented environment variable names with locally supplied credentials.
Never put secret values into public runtimeConfig, fixtures, screenshots or logs.
Tests in this milestone do not submit bookings or call live payment providers.
Use `/__dev/ui` on the local dev server to inspect both control themes and states.
This preview returns 404 in production and is excluded from indexing.

## Shared controls

```vue
<UiButton to="/journey#book-journey" variant="secondary">Request a quote</UiButton>
<UiButton type="submit" :loading="saving" :disabled="!valid">Continue</UiButton>
<UiTextField id="email" v-model="email" label="Email" type="email" autocomplete="email" required :error="emailError" />
```

UiButton supports primary, secondary and outline variants. Use `to` for Nuxt
navigation and `href` for external destinations; do not supply both. Native
button type defaults to button. Disabled/loading links become disabled buttons
to prevent keyboard and pointer navigation. Keep a meaningful label while loading.

UiTextField forwards native attributes to its input, connects the label and error,
and uses v-model. Keep application validation outside this presentation component.
PhoneInput retains its country-selection behaviour and consumes the same field
tokens. Do not wrap fields in extra decorative cards.

## Design contracts

`assets/styles/css/ui-tokens.css` owns new control colour pairs. Public controls
inherit dark surfaces; `.site-root--booking` sets explicit light field tokens.
Change backgrounds and foregrounds together. Tests require 4.5:1 for text pairs,
including disabled controls as an additional project convention.

Prefer scoped component CSS. Legacy page CSS remains during gradual migration;
do not add page-specific colour overrides to shared controls. The old home and
growth tokens are compatibility values, not the API for new controls.

Preserve visible keyboard focus, 48px control height, readable wrapping, and native
button/link semantics. Hover effects must not move controls inside clipped rails.
Content must be readable before hydration. Never dim already-visible content on
scroll. Respect reduced motion and clean up listeners/observers on unmount.

## Review and release

CI requires lint, TypeScript checks and component/contrast tests before the build
jobs. Existing lint warnings are baseline debt; new warnings need resolution.
Review UI changes at 390px and 1440px, plus keyboard navigation. Unit contrast
checks do not replace rendered browser accessibility and visual checks.

Before release verify staging homepage, service/location pages and an isolated
test booking journey, including reload, back navigation and API errors. Record
the deployed commit. A successful pipeline is not evidence of working payments.
Authenticated/payment end-to-end tests and automated deployment smoke checks
remain separate milestones.

Rollback: identify a known-good commit and build artifact; prefer a reviewed
revert commit through the same pipeline. Do not reset shared branches or restore
database state as part of a frontend rollback. Existing deployment scripts must
be reviewed before adding atomic releases or automated rollback.
