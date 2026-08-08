<script setup lang="ts">
import { routes } from '~/constants/routes'
import { journeyIcons } from '~/constants/journeyIcons'
import { bookingService } from '~/services/api/booking.service'
import { paymentService } from '~/services/api/payment.service'
import { authService } from '~/services/api/auth.service'
import type { BookingDto } from '~/types/api'

definePageMeta({ layout: 'booking' })

usePageSeo({ title: 'Booking confirmed', path: '/confirm' })

useConfirmBackNavigation()

const route = useRoute()
const booking = useBookingStore()
const auth = useAuthStore()
const toast = useToastStore()
const { downloading: receiptDownloading, download: downloadReceipt } = useBookingReceipt()

const receiptEl = ref<HTMLElement | null>(null)

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

const onDownloadReceipt = async () => {
  if (!data.value) return
  try {
    await downloadReceipt(receiptEl.value, data.value)
  } catch {
    toast.show('Could not generate your receipt. Please try again.', 'error')
  }
}
</script>

<template>
  <div class="vehicle-page confirm-page">
    <div class="vehicle-page__inner booking-shell__inner">
      <LoadingOverlay :show="confirming" label="Confirming your payment…" />

      <header class="vehicle-page__header">
        <p class="vehicle-page__eyebrow">Confirmation</p>
        <h1 class="vehicle-page__title checkout-page__title">
          {{ isConfirmed ? "You're all set" : 'Payment received' }}
        </h1>
        <p class="vehicle-page__lead">
          {{ isConfirmed
            ? "Your chauffeur transfer is confirmed. We'll keep you updated by email and WhatsApp."
            : 'Finalizing your booking — this usually takes a few seconds.' }}
        </p>
      </header>

      <div class="confirm-page__stack">
        <article class="confirm-hero booking-card">
          <div
            class="confirm-hero__icon"
            :class="isConfirmed ? 'confirm-hero__icon--success' : 'confirm-hero__icon--pending'"
            aria-hidden="true"
          >
            <img
              v-if="isConfirmed"
              src="/checkmark-ring.svg"
              alt=""
              width="64"
              height="64"
            >
            <AppLoader v-else size="xs" compact label="" />
          </div>

          <p v-if="data" class="confirm-hero__badge" :class="{ 'confirm-hero__badge--success': isConfirmed }">
            {{ statusBadge }}
          </p>

          <p v-if="data" class="confirm-hero__ref-label">Booking reference</p>
          <p v-if="data" class="confirm-hero__ref">{{ data.bookingReference }}</p>

          <hr class="booking-card__divider confirm-hero__divider" />

          <ul class="confirm-hero__trust">
            <li><i class="fa-regular fa-envelope" aria-hidden="true" /> Confirmation email sent</li>
            <li><i class="fa-brands fa-whatsapp" aria-hidden="true" /> Updates on WhatsApp</li>
          </ul>

          <div class="confirm-hero__actions">
            <NuxtLink
              v-if="auth.isLoggedIn"
              class="confirm-hero__btn confirm-hero__btn--outline"
              :to="routes.dashboardBookings"
              replace
            >
              <i class="fa-solid fa-list" aria-hidden="true" />
              My bookings
            </NuxtLink>
            <button
              v-if="data"
              class="confirm-hero__btn confirm-hero__btn--outline"
              type="button"
              :disabled="receiptDownloading"
              @click="onDownloadReceipt"
            >
              <i class="fa-solid fa-file-arrow-down" aria-hidden="true" />
              {{ receiptDownloading ? 'Preparing…' : 'Download receipt' }}
            </button>
            <button class="confirm-hero__btn confirm-hero__btn--gold" type="button" @click="newRide">
              Book another ride
              <i class="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
          </div>
        </article>

        <div v-if="data" class="confirm-grid">
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
                  <p class="booking-journey__value">{{ data.pickupAddress }}</p>
                </div>
              </li>
              <li class="booking-journey__item">
                <span class="booking-journey__icon" aria-hidden="true">
                  <img :src="journeyIcons.dropoff" alt="" width="20" height="20" />
                </span>
                <div class="booking-journey__text">
                  <span class="booking-journey__label">Drop-off</span>
                  <p class="booking-journey__value">{{ data.dropoffAddress }}</p>
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
              <li v-if="data.carName || data.customRequest" class="booking-journey__item">
                <span class="booking-journey__icon" aria-hidden="true"><i class="fa-solid fa-car" /></span>
                <div class="booking-journey__text">
                  <span class="booking-journey__label">Vehicle</span>
                  <p class="booking-journey__value">{{ data.carName || 'Custom request' }}</p>
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
              <span class="confirm-details__fare-label">Total fare (paid)</span>
              <span class="confirm-details__fare-value">€{{ data.calculatedFare ?? '—' }}</span>
            </footer>
          </article>

          <aside class="confirm-aside">
            <article class="confirm-status booking-card">
              <header class="confirm-status__head">
                <h2 class="confirm-status__title">Live status</h2>
                <p class="confirm-status__lead">Track progress from confirmation to drop-off.</p>
              </header>
              <hr class="booking-card__divider confirm-status__divider" />
              <BookingLiveStatus :status="data.status" />
            </article>

            <!-- Guest Google upsell — hidden for now (not in Figma sovereign-booking-confirmation); keep for later
            <article
              v-if="auth.isGuestSession && !auth.isLoggedIn"
              class="checkout-panel__card booking-card confirm-upsell"
            >
              <div class="checkout-panel__icon checkout-panel__icon--gold" aria-hidden="true">
                <i class="fa-brands fa-google" />
              </div>
              <h2 class="checkout-panel__title">Save this booking</h2>
              <p class="checkout-panel__lead">
                Link Google to track all your rides and manage bookings in one place.
              </p>
              <GoogleSignInButton @success="onGoogleSuccess" @error="(m) => toast.show(m, 'error')" />
              <NuxtLink class="confirm-hero__btn confirm-hero__btn--outline confirm-upsell__link" :to="routes.guestBooking" replace>
                View booking as guest
              </NuxtLink>
            </article>
            -->
          </aside>
        </div>

        <div v-else-if="!confirming" class="confirm-empty booking-card">
          <p>We couldn&apos;t load your booking details. Check your reference or contact support.</p>
        </div>
      </div>
    </div>

    <LoadingOverlay :show="googleLoading" label="Signing in with Google…" />

    <div v-if="data" ref="receiptEl" class="confirm-receipt-render" aria-hidden="true">
      <BookingReceiptDocument :booking="data" />
    </div>
  </div>
</template>
