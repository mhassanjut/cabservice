# STW Movers Frontend — Architecture Overview

Nuxt 3 SSR app for a Barcelona airport transfer and chauffeur booking service, with customer checkout, driver portal, and admin dashboard.

---

## Root Files

| File | Purpose |
|------|---------|
| `app.vue` | Root Vue shell that renders the active layout and page. |
| `app.config.ts` | Exposes WhatsApp contact settings to the app at runtime. |
| `nuxt.config.ts` | Main Nuxt config: SSR, Pinia, SEO head, route rules, and env keys. |
| `package.json` | Project metadata, npm scripts, and dependency list. |
| `package-lock.json` | Locked dependency versions for reproducible installs. |
| `tsconfig.json` | TypeScript compiler options for the Nuxt project. |
| `eslint.config.mjs` | ESLint rules and lint scope for the codebase. |
| `.env.example` | Template for required environment variables (API keys, Stripe, Google). |
| `STRIPE-SETUP.md` | Notes on configuring Stripe payments for checkout. |
| `PAYMENT-BYPASS-NOTES.md` | Dev notes for skipping or bypassing payment during testing. |

---

## `assets/`

| Path | Purpose |
|------|---------|
| `assets/css/main.css` | Global styles, CSS variables, and shared UI tokens. |

---

## `components/`

Shared Vue UI building blocks used across public, customer, and booking flows.

| File | Purpose |
|------|---------|
| `AppFooter.vue` | Site-wide footer with links and contact info. |
| `AppNavbar.vue` | Top navigation bar for the public site. |
| `AppToast.vue` | Global toast notification display. |
| `AppUserMenu.vue` | Logged-in user dropdown menu in the navbar. |
| `BookingCheckoutProgress.vue` | Step indicator for the booking checkout flow. |
| `BookingForm.vue` | Main pickup/dropoff booking form with map integration. |
| `BookingStateTracker.vue` | Visual tracker for booking lifecycle states. |
| `BookingSummary.vue` | Sidebar/card summary of the current booking draft. |
| `CarFilters.vue` | Filters for vehicle type, passengers, and luggage on the cars page. |
| `ContactSection.vue` | Homepage contact section with WhatsApp and details. |
| `CustomerSignInModal.vue` | Modal wrapper for customer sign-in during checkout. |
| `CustomerSignInPanel.vue` | Sign-in panel with Google and OTP options. |
| `DashboardShell.vue` | Layout wrapper for customer dashboard pages. |
| `FleetGallery.vue` | Grid gallery of fleet vehicles on the homepage/cars page. |
| `FleetVehicleImage.vue` | Renders a fleet vehicle image with fallback placeholder. |
| `GoogleSignInButton.vue` | Google OAuth sign-in button component. |
| `HeroHome.vue` | Homepage hero section with booking CTA. |
| `LoadingOverlay.vue` | Full-screen loading spinner overlay. |
| `MobileBottomNav.vue` | Bottom navigation bar for mobile users. |
| `OtpInput.vue` | OTP digit input fields for phone verification. |
| `OtpVerifyModal.vue` | Modal for entering and verifying SMS OTP codes. |
| `PhoneRequiredModal.vue` | Prompts users to add a phone number before booking. |
| `PickupValidationModal.vue` | Warns when pickup location is outside supported zones. |
| `SectionHeading.vue` | Reusable styled section title component. |
| `UserAvatar.vue` | User profile avatar with image or initials fallback. |
| `VehicleCard.vue` | Card displaying a vehicle with price and specs. |
| `WhatsappFloatingButton.vue` | Fixed floating WhatsApp chat button. |

### `components/admin/`

| File | Purpose |
|------|---------|
| `AdminBadge.vue` | Colored status badge for admin tables and panels. |
| `AdminBookingPanel.vue` | Detail panel for viewing/editing a single admin booking. |
| `AdminBookingsPage.vue` | Reusable admin bookings list page with filters and table. |
| `AdminEmptyState.vue` | Empty-state placeholder for admin lists with no data. |
| `AdminSectionHead.vue` | Section header with title and actions for admin pages. |
| `AdminShell.vue` | Admin layout shell with sidebar navigation. |
| `AdminSkeleton.vue` | Loading skeleton placeholders for admin content. |

---

## `composables/`

Reusable Vue composition functions (auto-imported by Nuxt).

| File | Purpose |
|------|---------|
| `useAdminNav.ts` | Admin sidebar navigation items and active-route logic. |
| `useConfirmBackNavigation.ts` | Resolves where to send users after checkout or on back navigation. |
| `useCustomerSignIn.ts` | State and actions for the customer sign-in modal flow. |
| `useGoogleMaps.ts` | Loads Google Maps JS API and exposes map helpers. |
| `useGoogleSignIn.ts` | Google Identity Services sign-in integration. |
| `useIsMobile.ts` | Reactive breakpoint check for mobile layout. |
| `useLocalBusinessSchema.ts` | JSON-LD structured data for local business SEO. |
| `usePageSeo.ts` | Sets page title, meta tags, and OG data per route. |
| `usePlacesAutocomplete.ts` | Google Places autocomplete for address fields. |

---

## `config/`

| File | Purpose |
|------|---------|
| `site.ts` | Core site settings: URL, API base, WhatsApp number, tour link. |
| `seo.ts` | Default SEO copy, OG image path, and per-section meta content. |

---

## `constants/`

| File | Purpose |
|------|---------|
| `routes.ts` | Centralized route path constants and homepage anchor links. |

---

## `data/`

| File | Purpose |
|------|---------|
| `vehicles.ts` | Static fleet vehicle catalog for marketing/display pages. |
| `fleetImageManifest.ts` | Maps vehicle IDs to local image file paths in `public/`. |

---

## `features/`

| Path | Purpose |
|------|---------|
| `features/admin/.keep` | Placeholder to reserve the admin feature module folder for future splits. |

---

## `layouts/`

| File | Purpose |
|------|---------|
| `default.vue` | Public site layout with navbar, footer, toast, and WhatsApp button. |
| `admin.vue` | Admin dashboard layout wrapping `AdminShell`. |

---

## `middleware/`

Route guards applied via `definePageMeta({ middleware: [...] })`.

| File | Purpose |
|------|---------|
| `auth.ts` | Requires logged-in customer; redirects others to login. |
| `admin.ts` | Protects admin routes; redirects unauthenticated users to admin login. |
| `customer.ts` | Client-only customer auth guard to avoid SSR login flash. |
| `driver.ts` | Requires authenticated driver session for driver portal routes. |
| `checkout-guard.ts` | Blocks re-entry to checkout after completion or with invalid draft. |
| `no-guest-dashboard.ts` | Prevents guest sessions from accessing the customer dashboard. |

---

## `pages/`

File-based routing; each `.vue` file maps to a URL.

### Public

| File | Purpose |
|------|---------|
| `pages/index.vue` | Homepage with hero, fleet, booking form, and contact. |
| `pages/cars.vue` | Browse and filter available vehicles with fares. |
| `pages/booking.vue` | Vehicle selection and booking details step. |
| `pages/payment.vue` | Payment step with Stripe checkout integration. |
| `pages/confirm.vue` | Booking confirmation page after successful payment. |
| `pages/bookings.vue` | Public booking lookup or list entry point. |
| `pages/login.vue` | Customer login page with Google and OTP. |
| `pages/tours.vue` | Private tours landing page (coming soon / WhatsApp CTA). |
| `pages/faq.vue` | Frequently asked questions page. |

### Guest

| File | Purpose |
|------|---------|
| `pages/guest/booking.vue` | Guest checkout flow without a full customer account. |

### Customer Dashboard

| File | Purpose |
|------|---------|
| `pages/dashboard/index.vue` | Customer dashboard home/overview. |
| `pages/dashboard/account.vue` | Customer profile and account settings. |
| `pages/dashboard/bookings/index.vue` | List of the customer's past and upcoming bookings. |
| `pages/dashboard/bookings/[ref].vue` | Detail view for a single booking by reference. |

### Driver Portal

| File | Purpose |
|------|---------|
| `pages/driver/login.vue` | Driver login page. |
| `pages/driver/index.vue` | Driver home/dashboard after login. |

### Admin

| File | Purpose |
|------|---------|
| `pages/admin/login.vue` | Admin staff login page. |
| `pages/admin/index.vue` | Admin dashboard overview. |
| `pages/admin/rides/index.vue` | Manage ride/booking records. |
| `pages/admin/drivers/index.vue` | Manage driver accounts and assignments. |
| `pages/admin/cars/index.vue` | Manage fleet vehicles and availability. |
| `pages/admin/pricing/index.vue` | Configure pricing rules and fares. |
| `pages/admin/custom-requests/index.vue` | Handle custom transfer requests. |
| `pages/admin/payments/index.vue` | View and manage payment records. |
| `pages/admin/notifications/index.vue` | Admin notification settings and logs. |
| `pages/admin/settings/index.vue` | General admin and site settings. |

---

## `plugins/`

Client-side Nuxt plugins run on app startup (`.client.ts` = browser only).

| File | Purpose |
|------|---------|
| `init.client.ts` | Hydrates auth on load and listens for cross-tab auth changes. |
| `auth-hydrate.client.ts` | Restores auth state from localStorage before route guards run. |
| `bookingPersist.client.ts` | Persists booking draft state to localStorage across steps. |
| `checkout-history.client.ts` | Tracks checkout navigation history for back-button handling. |
| `scroll-reveal.client.ts` | Adds scroll-reveal animations on public marketing sections. |

---

## `public/`

Static files served as-is at the site root.

| Path | Purpose |
|------|---------|
| `public/favicon.svg` | Browser tab favicon. |
| `public/og-default.svg` | Default Open Graph share image. |
| `public/img/vehicles/vehicle-placeholder.svg` | Fallback image when a vehicle photo is missing. |
| `public/img/vehicles/ATTRIBUTION.md` | Image source credits and licensing notes. |
| `public/img/vehicles/*` | Downloaded fleet vehicle photos (generated by scripts). |

---

## `scripts/`

Node maintenance scripts (not part of the runtime app).

| File | Purpose |
|------|---------|
| `download-vehicle-images.mjs` | Downloads vehicle images from external sources. |
| `sync-vehicle-images.mjs` | Syncs vehicle images into `public/img/vehicles/`. |
| `vehicle-image-sources.mjs` | Source URLs and metadata for fleet image downloads. |
| `resolve-commons-thumb.mjs` | Resolves Wikimedia Commons thumbnail URLs for vehicles. |
| `vendor-pack.mjs` | Bundles vendor assets for offline/portable deployment. |
| `merge-portable-node-modules.mjs` | Merges portable Node modules into the project. |
| `install-with-portable.mjs` | Installs dependencies using the portable Node setup. |

---

## `services/`

API layer — HTTP client and domain-specific service modules.

### `services/http/`

| File | Purpose |
|------|---------|
| `client.ts` | Creates a configured `ofetch` HTTP client instance. |
| `api.ts` | Shared API instance wired to the backend base URL. |
| `useApiClient.ts` | Composable that injects auth token into API requests. |

### `services/api/`

| File | Purpose |
|------|---------|
| `auth.service.ts` | Login, OTP, Google auth, and token refresh API calls. |
| `booking.service.ts` | Create, fetch, and list booking API calls. |
| `user.service.ts` | Customer profile and account API calls. |
| `payment.service.ts` | Stripe payment intent and payment status API calls. |
| `places.service.ts` | Backend proxy for geocoding and places lookup. |
| `rides.service.ts` | Ride status and driver assignment API calls. |
| `driver.service.ts` | Driver-specific portal API calls. |
| `admin.service.ts` | Admin CRUD and management API calls. |

---

## `stores/`

Pinia state stores for global client state.

| File | Purpose |
|------|---------|
| `auth.ts` | Auth token, user profile, guest session, and role helpers. |
| `booking.ts` | Booking draft, selected vehicle, cars list, and checkout state. |
| `toast.ts` | Global toast message queue and display state. |

---

## `types/`

Shared TypeScript type definitions.

| File | Purpose |
|------|---------|
| `api.ts` | DTOs and enums returned by the backend REST API. |
| `booking.ts` | Frontend booking draft, vehicle, and guest detail types. |

---

## `utils/`

Pure helper functions (auto-imported by Nuxt).

| File | Purpose |
|------|---------|
| `adminStatus.ts` | Maps booking/payment statuses to admin badge colors and labels. |
| `cities.ts` | Supported pickup cities, bounds, and zone validation helpers. |
| `geo.ts` | Haversine distance calculation between coordinates. |
| `phone.ts` | Phone number normalization and validation. |
| `seo.ts` | Builds absolute URLs and formatted page titles/descriptions. |
| `vehicleImage.ts` | Resolves vehicle image URLs with placeholder fallback. |
| `whatsapp.ts` | Builds WhatsApp deep-link URLs with pre-filled messages. |

---

## `portable/`

| Path | Purpose |
|------|---------|
| `portable/README.txt` | Instructions for the bundled portable Node.js runtime setup. |

---

## High-Level Flow

```
Public site (/) → Booking (/booking) → Payment (/payment) → Confirm (/confirm)
                         ↓
              Guest flow (/guest/booking) — no account required
                         ↓
              Customer dashboard (/dashboard/*) — requires login
                         ↓
              Admin (/admin/*) — staff only, client-rendered (no SSR)
                         ↓
              Driver portal (/driver/*) — driver login required
```

**Backend:** All API calls go through `services/http/` to `config/site.ts → apiBaseUrl` (default `http://localhost:8080`).

**State:** Booking and auth state persist in `localStorage` via Pinia stores and client plugins.
