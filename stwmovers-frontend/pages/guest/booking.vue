<script setup lang="ts">
import type { BookingDto } from '~/types/api'
import { journeyIcons } from '~/constants/journeyIcons'
import { routes } from '~/constants/routes'
import { bookingService } from '~/services/api/booking.service'
import { authService } from '~/services/api/auth.service'

definePageMeta({ layout: 'booking', ssr: false })

usePageSeo({ title: 'Your booking', path: '/guest/booking' })

const auth = useAuthStore()
const router = useRouter()
const toast = useToastStore()
const booking = ref<BookingDto | null>(null)
const loading = ref(true)
const googleLoading = ref(false)

let pollTimer: ReturnType<typeof setInterval> | null = null

const terminalStatuses = ['COMPLETED', 'CANCELLED', 'REFUNDED'] as const

const scheduledLabel = computed(() => {
  if (!booking.value?.scheduledAt) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(booking.value.scheduledAt))
})

const confirmedStatuses = ['CONFIRMED', 'COMPLETED', 'DRIVER_ASSIGNED', 'DRIVER_ACCEPTED', 'IN_PROGRESS'] as const

const isConfirmed = computed(() =>
  booking.value
    ? confirmedStatuses.includes(booking.value.status as (typeof confirmedStatuses)[number])
    : false,
)

const driverLabel = computed(() => {
  if (!booking.value) return '—'
  if (booking.value.driverId) return 'Chauffeur assigned'
  if (isConfirmed.value) return 'Matching your chauffeur…'
  return 'Pending confirmation'
})

const statusBadge = computed(() => {
  if (!booking.value) return 'Processing'
  const labels: Record<string, string> = {
    CREATED: 'Created',
    OTP_PENDING: 'Verification pending',
    PAYMENT_PENDING: 'Payment pending',
    CONFIRMED: 'Confirmed',
    DRIVER_ASSIGNED: 'Driver assigned',
    DRIVER_ACCEPTED: 'Driver en route',
    IN_PROGRESS: 'Ride in progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
  }
  return labels[booking.value.status] ?? booking.value.status.replace(/_/g, ' ').toLowerCase()
})

const fareLabel = computed(() =>
  booking.value?.status === 'PAYMENT_PENDING' ? 'Total fare' : 'Total fare (paid)',
)

const load = async () => {
  const refId = auth.guestSession?.bookingReference
  if (!refId) return
  booking.value = await bookingService.get(refId)
}

onMounted(async () => {
  auth.hydrate()
  const refId = auth.guestSession?.bookingReference
  if (!auth.isGuestSession || !refId) {
    await router.replace(routes.home)
    return
  }
  try {
    await load()
  } finally {
    loading.value = false
  }

  pollTimer = setInterval(async () => {
    if (!booking.value || terminalStatuses.includes(booking.value.status as (typeof terminalStatuses)[number])) {
      if (pollTimer) {
        clearInterval(pollTimer)
        pollTimer = null
      }
      return
    }
    try {
      await load()
    } catch {
      /* keep previous booking on poll failure */
    }
  }, 10000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

const onGoogleSuccess = async (idToken: string) => {
  googleLoading.value = true
  try {
    const session = await authService.googleLogin(idToken)
    auth.setSession(session)
    await router.push(routes.dashboard)
  } catch {
    toast.show('Google sign-in failed.', 'error')
  } finally {
    googleLoading.value = false
  }
}
</script>

<template>
  <div class="vehicle-page guest-booking-page" :aria-busy="loading">
    <div class="vehicle-page__inner">
      <GuestBookingSkeleton v-if="loading" />

      <template v-else>
        <header class="vehicle-page__header">
          <p class="vehicle-page__eyebrow">Guest booking</p>
          <h1 v-if="booking" class="vehicle-page__title checkout-page__title">
            {{ booking.bookingReference }}
          </h1>
          <h1 v-else class="vehicle-page__title checkout-page__title">
            Your booking
          </h1>
          <p v-if="booking" class="vehicle-page__lead">
            <span
              class="guest-booking-page__badge"
              :class="{ 'guest-booking-page__badge--success': isConfirmed }"
            >
              {{ statusBadge }}
            </span>
            Track your transfer and live updates below. We&apos;ll keep you updated by email and WhatsApp.
          </p>
        </header>

        <div class="confirm-page__stack">
          <div v-if="booking" class="confirm-grid">
          <article class="confirm-details booking-card">
            <header class="confirm-details__head">
              <p class="confirm-details__eyebrow">Trip details</p>
              <h2 class="confirm-details__title">Your transfer</h2>
            </header>

            <hr class="booking-card__divider confirm-details__divider" />

            <ul class="booking-journey__list confirm-details__list">
              <li class="booking-journey__item">
                <span class="booking-journey__icon" aria-hidden="true">
                  <img :src="journeyIcons.pickup" alt="" width="20" height="20" />
                </span>
                <div class="booking-journey__text">
                  <span class="booking-journey__label">Pickup</span>
                  <p class="booking-journey__value">{{ booking.pickupAddress }}</p>
                </div>
              </li>
              <li class="booking-journey__item">
                <span class="booking-journey__icon" aria-hidden="true">
                  <img :src="journeyIcons.dropoff" alt="" width="20" height="20" />
                </span>
                <div class="booking-journey__text">
                  <span class="booking-journey__label">Drop-off</span>
                  <p class="booking-journey__value">{{ booking.dropoffAddress }}</p>
                </div>
              </li>
              <li class="booking-journey__item">
                <span class="booking-journey__icon" aria-hidden="true">
                  <img :src="journeyIcons.travelDate" alt="" width="20" height="20" />
                </span>
                <div class="booking-journey__text">
                  <span class="booking-journey__label">Date &amp; Time</span>
                  <p class="booking-journey__value">{{ scheduledLabel }}</p>
                </div>
              </li>
              <li v-if="booking.carName || booking.customRequest" class="booking-journey__item">
                <span class="booking-journey__icon" aria-hidden="true"><i class="fa-solid fa-car" /></span>
                <div class="booking-journey__text">
                  <span class="booking-journey__label">Vehicle</span>
                  <p class="booking-journey__value">{{ booking.carName || 'Custom request' }}</p>
                </div>
              </li>
              <li class="booking-journey__item">
                <span class="booking-journey__icon" aria-hidden="true"><i class="fa-solid fa-user-tie" /></span>
                <div class="booking-journey__text">
                  <span class="booking-journey__label">Chauffeur</span>
                  <p class="booking-journey__value">{{ driverLabel }}</p>
                </div>
              </li>
            </ul>

            <hr class="booking-card__divider confirm-details__divider" />

            <footer class="confirm-details__fare-row">
              <span class="confirm-details__fare-label">{{ fareLabel }}</span>
              <span class="confirm-details__fare-value">€{{ booking.calculatedFare ?? '—' }}</span>
            </footer>
          </article>

          <aside class="confirm-aside">
            <article class="confirm-status booking-card">
              <header class="confirm-status__head">
                <h2 class="confirm-status__title">Live status</h2>
                <p class="confirm-status__lead">Track progress from confirmation to drop-off.</p>
              </header>
              <hr class="booking-card__divider confirm-status__divider" />
              <BookingLiveStatus :status="booking.status" />
            </article>

            <article class="booking-card confirm-upsell">
              <div class="checkout-panel__icon checkout-panel__icon--gold" aria-hidden="true">
                <i class="fa-brands fa-google" />
              </div>
              <h2 class="checkout-panel__title">Save this booking</h2>
              <p class="checkout-panel__lead">
                Link Google to track all your rides and manage bookings in one place.
              </p>
              <GoogleSignInButton @success="onGoogleSuccess" @error="(m) => toast.show(m, 'error')" />
            </article>
          </aside>
        </div>

          <div v-else class="confirm-empty booking-card">
            <p>We couldn&apos;t load your booking details. Check your reference or contact support.</p>
          </div>
        </div>
      </template>
    </div>

    <LoadingOverlay :show="googleLoading" label="Signing in with Google…" />
  </div>
</template>

<style scoped>
.guest-booking-page__badge {
  display: inline-block;
  margin-right: 8px;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(216, 178, 76, 0.14);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--bk-gold-dark);
  vertical-align: middle;
}

.guest-booking-page__badge--success {
  background: rgba(16, 185, 129, 0.07);
  color: #10b981;
}

@media (max-width: 479px) {
  .guest-booking-page__badge {
    display: block;
    width: fit-content;
    margin: 0 0 8px;
  }
}
</style>
