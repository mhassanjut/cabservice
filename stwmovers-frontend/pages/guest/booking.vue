<script setup lang="ts">
import { routes } from '~/constants/routes'
import { bookingService } from '~/services/api/booking.service'
import { authService } from '~/services/api/auth.service'

usePageSeo({ title: 'Your booking', path: '/guest/booking' })

const auth = useAuthStore()
const router = useRouter()
const toast = useToastStore()
const booking = ref<Awaited<ReturnType<typeof bookingService.get>> | null>(null)
const loading = ref(true)
const googleLoading = ref(false)

onMounted(async () => {
  auth.hydrate()
  const refId = auth.guestSession?.bookingReference
  if (!auth.isGuestSession || !refId) {
    await router.replace(routes.home)
    return
  }
  try {
    booking.value = await bookingService.get(refId)
  } finally {
    loading.value = false
  }
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
  <section class="guest-booking-page">
    <LoadingOverlay :show="loading || googleLoading" label="Loading your booking…" />

    <article v-if="booking" class="card card--elevated">
      <p class="eyebrow">Guest booking</p>
      <h1 class="font-serif">Ref {{ booking.bookingReference }}</h1>
      <BookingStateTracker :status="booking.status" />
      <dl class="summary-grid">
        <div><dt>Route</dt><dd>{{ booking.pickupAddress }} → {{ booking.dropoffAddress }}</dd></div>
        <div><dt>Fare</dt><dd>€{{ booking.calculatedFare ?? '—' }}</dd></div>
      </dl>
    </article>

    <article class="card card--elevated guest-upsell">
      <p class="guest-upsell__lead">Link your Google account to track all your rides and manage bookings in one place.</p>
      <GoogleSignInButton @success="onGoogleSuccess" @error="(m) => toast.show(m, 'error')" />
    </article>
  </section>
</template>

<style scoped>
.guest-booking-page {
  display: grid;
  gap: 1rem;
}

.guest-upsell {
  display: grid;
  gap: 12px;
  border-color: rgba(201, 162, 39, 0.35);
}

.guest-upsell__lead {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-muted);
  line-height: 1.55;
}
</style>
