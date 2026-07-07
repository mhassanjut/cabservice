<script setup lang="ts">
import { routes } from '~/constants/routes'
import { bookingService } from '~/services/api/booking.service'
import { paymentService } from '~/services/api/payment.service'
import { authService } from '~/services/api/auth.service'
import type { BookingDto } from '~/types/api'

usePageSeo({ title: 'Booking confirmed', path: '/confirm' })

useConfirmBackNavigation()

const route = useRoute()
const booking = useBookingStore()
const auth = useAuthStore()
const toast = useToastStore()

const data = ref<BookingDto | null>(null)
const googleLoading = ref(false)
const confirming = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const refId = computed(
  () => (route.query.ref as string) || booking.bookingReference || '',
)
const sessionId = computed(() => (route.query.session_id as string) || '')

const confirmedStatuses = ['CONFIRMED', 'COMPLETED', 'DRIVER_ASSIGNED', 'DRIVER_ACCEPTED', 'IN_PROGRESS'] as const

const isConfirmed = computed(() =>
  data.value ? confirmedStatuses.includes(data.value.status as (typeof confirmedStatuses)[number]) : false,
)

const scheduledLabel = computed(() => {
  if (!data.value?.scheduledAt) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(data.value.scheduledAt))
})

const driverLabel = computed(() => {
  if (!data.value) return '—'
  if (data.value.driverId) return 'Chauffeur assigned'
  if (isConfirmed.value) return 'Matching your chauffeur…'
  return 'Pending confirmation'
})

const statusBadge = computed(() => {
  if (!data.value) return 'Processing'
  const labels: Record<string, string> = {
    PAYMENT_PENDING: 'Processing payment',
    CONFIRMED: 'Confirmed',
    DRIVER_ASSIGNED: 'Driver assigned',
    DRIVER_ACCEPTED: 'Driver en route',
    IN_PROGRESS: 'Ride in progress',
    COMPLETED: 'Completed',
  }
  return labels[data.value.status] ?? data.value.status.replace(/_/g, ' ').toLowerCase()
})

const load = async () => {
  if (!refId.value) return
  data.value = await bookingService.get(refId.value)
}

const isConfirmedStatus = (status: BookingDto['status']) =>
  confirmedStatuses.includes(status as (typeof confirmedStatuses)[number])

const finalizeCheckout = async () => {
  if (!data.value?.bookingReference || !isConfirmedStatus(data.value.status)) return

  booking.completeCheckout(data.value.bookingReference)

  if (sessionId.value) {
    await navigateTo({ path: routes.confirm, query: { ref: data.value.bookingReference } }, { replace: true })
  }
}

onMounted(async () => {
  auth.hydrate()

  if (sessionId.value) {
    confirming.value = true
    try {
      data.value = await paymentService.completeSession(sessionId.value)
    } catch {
      await load()
    } finally {
      confirming.value = false
    }
  } else {
    await load()
  }

  await finalizeCheckout()

  if (data.value && !auth.isLoggedIn && data.value.guestEmail) {
    auth.setGuestSession({
      fullName: data.value.guestName ?? 'Guest',
      email: data.value.guestEmail,
      phone: data.value.guestPhone ?? '',
      bookingReference: data.value.bookingReference,
    })
  }

  timer = setInterval(async () => {
    await load()
    if (data.value && isConfirmedStatus(data.value.status)) {
      await finalizeCheckout()
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }
  }, sessionId.value ? 3000 : 10000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const onGoogleSuccess = async (idToken: string) => {
  googleLoading.value = true
  try {
    const session = await authService.googleLogin(idToken)
    auth.setSession(session)
    await navigateTo(routes.dashboard)
  } catch {
    toast.show('Google sign-in failed. Please try again.', 'error')
  } finally {
    googleLoading.value = false
  }
}

const newRide = () => {
  booking.clear()
  navigateTo(routes.home, { replace: true })
}
</script>

<template>
  <section class="booking-page confirm-page">
    <LoadingOverlay :show="confirming" label="Confirming your payment…" />

    <SectionHeading
      title-level="h1"
      eyebrow="Confirmation"
      :title="isConfirmed ? 'You\'re all set' : 'Payment received'"
      :lead="isConfirmed
        ? 'Your chauffeur transfer is confirmed. We\'ll keep you updated by email and WhatsApp.'
        : 'Finalizing your booking — this usually takes a few seconds.'"
    />

    <BookingCheckoutProgress details-done payment-done confirmed-done />

    <div class="confirm-layout">
      <article class="confirm-panel card card--elevated reveal">
        <div class="confirm-hero">
          <div
            class="confirm-hero__icon"
            :class="isConfirmed ? 'confirm-hero__icon--success' : 'confirm-hero__icon--pending'"
            aria-hidden="true"
          >
            <i v-if="isConfirmed" class="fa-solid fa-circle-check" />
            <i v-else class="fa-solid fa-spinner fa-spin" />
          </div>

          <span v-if="data" class="confirm-hero__badge pill pill--gold">{{ statusBadge }}</span>

          <p v-if="data" class="confirm-hero__ref">
            <span class="confirm-hero__ref-label">Booking reference</span>
            <strong>{{ data.bookingReference }}</strong>
          </p>

          <ul class="confirm-hero__trust">
            <li><i class="fa-solid fa-envelope" aria-hidden="true" /> Confirmation email sent</li>
            <li><i class="fa-brands fa-whatsapp" aria-hidden="true" /> Updates on WhatsApp</li>
          </ul>
        </div>

        <div class="confirm-actions">
          <NuxtLink v-if="auth.isLoggedIn" class="btn secondary" :to="routes.dashboardBookings" replace>
            <i class="fa-solid fa-list" aria-hidden="true" />
            My bookings
          </NuxtLink>
          <button class="btn btn--solid-gold" type="button" @click="newRide">
            Book another ride
            <i class="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </article>

      <div v-if="data" class="confirm-grid">
        <article class="confirm-details card card--elevated reveal">
          <header class="confirm-details__head">
            <p class="eyebrow">Trip details</p>
            <h2 class="confirm-details__title font-serif">Your transfer</h2>
          </header>

          <div class="confirm-details__route">
            <div class="confirm-details__point">
              <span class="confirm-details__dot confirm-details__dot--pickup" aria-hidden="true" />
              <div>
                <span class="confirm-details__label">Pickup</span>
                <p>{{ data.pickupAddress }}</p>
              </div>
            </div>
            <div class="confirm-details__point">
              <span class="confirm-details__dot confirm-details__dot--dropoff" aria-hidden="true" />
              <div>
                <span class="confirm-details__label">Drop-off</span>
                <p>{{ data.dropoffAddress }}</p>
              </div>
            </div>
          </div>

          <dl class="confirm-details__meta">
            <div>
              <dt>Date &amp; time</dt>
              <dd>{{ scheduledLabel }}</dd>
            </div>
            <div v-if="data.carName">
              <dt>Vehicle</dt>
              <dd>{{ data.carName }}</dd>
            </div>
            <div v-else-if="data.customRequest">
              <dt>Vehicle</dt>
              <dd>Custom request</dd>
            </div>
            <div>
              <dt>Chauffeur</dt>
              <dd>{{ driverLabel }}</dd>
            </div>
            <div>
              <dt>Total fare</dt>
              <dd class="confirm-details__fare">€{{ data.calculatedFare ?? '—' }}</dd>
            </div>
          </dl>
        </article>

        <aside class="confirm-aside">
          <article class="confirm-status card card--elevated reveal">
            <header class="confirm-status__head">
              <h2 class="confirm-status__title font-serif">Live status</h2>
              <p class="confirm-status__lead">Track progress from confirmation to drop-off.</p>
            </header>
            <BookingStateTracker :status="data.status" />
          </article>

          <article
            v-if="auth.isGuestSession && !auth.isLoggedIn"
            class="confirm-upsell card card--elevated reveal"
          >
            <div class="confirm-upsell__icon booking-panel__icon booking-panel__icon--blue" aria-hidden="true">
              <i class="fa-brands fa-google" />
            </div>
            <h2 class="confirm-upsell__title font-serif">Save this booking</h2>
            <p class="confirm-upsell__lead">
              Link Google to track all your rides and manage bookings in one place.
            </p>
            <GoogleSignInButton @success="onGoogleSuccess" @error="(m) => toast.show(m, 'error')" />
            <NuxtLink class="btn secondary confirm-upsell__link" :to="routes.guestBooking" replace>
              View booking as guest
            </NuxtLink>
          </article>
        </aside>
      </div>

      <div v-else-if="!confirming" class="confirm-empty card card--elevated reveal">
        <p>We couldn&apos;t load your booking details. Check your reference or contact support.</p>
      </div>
    </div>

    <LoadingOverlay :show="googleLoading" label="Signing in with Google…" />
  </section>
</template>

<style scoped>
.confirm-page {
  padding-bottom: 0;
}

.confirm-layout {
  display: grid;
  gap: clamp(1rem, 2.5vw, 1.5rem);
  max-width: 920px;
  margin-inline: auto;
}

.confirm-panel {
  padding: clamp(1.5rem, 4vw, 2.25rem);
  border-color: rgba(201, 162, 39, 0.28);
}

.confirm-hero {
  text-align: center;
}

.confirm-hero__icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 1.25rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 2rem;
}

.confirm-hero__icon--success {
  color: var(--color-success);
  background: rgba(76, 175, 130, 0.12);
  border: 1px solid rgba(76, 175, 130, 0.35);
  box-shadow: 0 0 0 6px rgba(76, 175, 130, 0.08);
}

.confirm-hero__icon--pending {
  color: var(--color-gold-bright);
  background: rgba(201, 162, 39, 0.12);
  border: 1px solid rgba(201, 162, 39, 0.35);
}

.confirm-hero__badge {
  margin-bottom: 1rem;
}

.confirm-hero__ref {
  margin: 0 0 1.25rem;
  display: grid;
  gap: 6px;
}

.confirm-hero__ref-label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.confirm-hero__ref strong {
  font-family: var(--font-serif);
  font-size: clamp(1.35rem, 4vw, 1.75rem);
  letter-spacing: 0.04em;
  color: var(--color-gold-bright);
}

.confirm-hero__trust {
  list-style: none;
  margin: 0;
  padding: 1rem 0 0;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 24px;
  font-size: 0.875rem;
  color: var(--color-muted);
}

.confirm-hero__trust i {
  color: var(--color-gold-bright);
  margin-right: 8px;
}

.confirm-grid {
  display: grid;
  gap: clamp(1.25rem, 3vw, 1.75rem);
  align-items: start;
}

@media (min-width: 860px) {
  .confirm-grid {
    grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.85fr);
  }
}

.confirm-details,
.confirm-status,
.confirm-upsell,
.confirm-empty {
  padding: clamp(1.25rem, 3vw, 1.75rem);
}

.confirm-details__head {
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.confirm-details__title {
  margin: 6px 0 0;
  font-size: clamp(1.2rem, 2.5vw, 1.45rem);
}

.confirm-details__route {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.confirm-details__point {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
}

.confirm-details__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 5px;
}

.confirm-details__dot--pickup {
  background: var(--color-gold-bright);
  box-shadow: 0 0 0 4px var(--color-gold-subtle);
}

.confirm-details__dot--dropoff {
  background: var(--color-text);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08);
}

.confirm-details__label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 4px;
}

.confirm-details__point p {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--color-text);
}

.confirm-details__meta {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 1rem 1.1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg-elevated);
}

.confirm-details__meta dt {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 4px;
}

.confirm-details__meta dd {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-text);
}

.confirm-details__fare {
  font-size: 1.35rem !important;
  font-weight: 700;
  color: var(--color-gold-light) !important;
}

.confirm-aside {
  display: grid;
  gap: clamp(1.25rem, 3vw, 1.75rem);
}

.confirm-status__head {
  margin-bottom: 1rem;
}

.confirm-status__title {
  margin: 0 0 6px;
  font-size: 1.15rem;
}

.confirm-status__lead {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--color-muted);
}

.confirm-upsell {
  border-color: rgba(201, 162, 39, 0.28);
}

.confirm-upsell__icon {
  margin-bottom: 1rem;
}

.confirm-upsell__title {
  margin: 0 0 8px;
  font-size: 1.15rem;
}

.confirm-upsell__lead {
  margin: 0 0 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--color-muted);
}

.confirm-upsell__link {
  margin-top: 10px;
  width: 100%;
  justify-content: center;
}

.confirm-empty {
  text-align: center;
  color: var(--color-muted);
}

.confirm-empty p {
  margin: 0;
}

.confirm-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
}

.confirm-actions .btn {
  min-height: 48px;
}

@media (max-width: 599px) {
  .confirm-actions {
    flex-direction: column;
  }

  .confirm-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
