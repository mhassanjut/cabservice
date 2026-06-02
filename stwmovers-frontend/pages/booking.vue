<script setup lang="ts">
import { routes } from '~/constants/routes'
import { bookingService } from '~/services/api/booking.service'
import { authService } from '~/services/api/auth.service'

usePageSeo({ title: 'Booking details', path: '/booking' })

const booking = useBookingStore()
const auth = useAuthStore()
const router = useRouter()
const toast = useToastStore()

const step = ref<'auth' | 'otp' | 'done'>('auth')
const loading = ref(false)
const guest = reactive({ fullName: '', email: '', phone: '' })
const otp = ref('')
const resendIn = ref(0)

onMounted(async () => {
  if (!booking.isDraftValid || (!booking.vehicle && !booking.otherCar)) {
    await router.replace(routes.cars)
  }
  if (auth.isLoggedIn) step.value = 'done'
})

const guestValid = computed(
  () => guest.fullName.trim() && guest.email.trim() && guest.phone.trim(),
)

const detailsActive = computed(() => !auth.isLoggedIn && step.value === 'auth')
const detailsDone = computed(() => auth.isLoggedIn || step.value === 'otp')
const paymentActive = computed(() => auth.isLoggedIn || step.value === 'otp')

const createBooking = async () => {
  loading.value = true
  try {
    const b = await bookingService.create({
      carId: booking.otherCar ? undefined : booking.vehicle?.id,
      otherCar: booking.otherCar,
      rideType: booking.draft.rideType,
      pickupAddress: booking.draft.pickupLocation,
      dropoffAddress: booking.draft.dropoffLocation,
      pickupLat: booking.draft.pickup!.lat,
      pickupLng: booking.draft.pickup!.lng,
      dropoffLat: booking.draft.dropoff!.lat,
      dropoffLng: booking.draft.dropoff!.lng,
      distanceKm: booking.draft.distanceKm!,
      scheduledAt: booking.scheduledAtIso,
      destinationCity: booking.draft.destinationCity,
      guestName: auth.isLoggedIn ? undefined : guest.fullName,
      guestEmail: auth.isLoggedIn ? undefined : guest.email,
      guestPhone: auth.isLoggedIn ? undefined : guest.phone,
    })
    booking.bookingReference = b.bookingReference
    booking.persistToStorage()
    if (b.status === 'OTP_PENDING') {
      await authService.sendOtp(guest.email, b.bookingReference)
      resendIn.value = 60
      step.value = 'otp'
    } else {
      await router.push(routes.payment)
    }
  } catch {
    toast.show('Booking failed. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}

const verifyOtp = async () => {
  loading.value = true
  try {
    await authService.verifyOtp(guest.email, otp.value, booking.bookingReference)
    await router.push(routes.payment)
  } catch {
    toast.show('Invalid or expired OTP.', 'error')
  } finally {
    loading.value = false
  }
}

const continueLoggedIn = async () => {
  await createBooking()
}
</script>

<template>
  <section class="booking-page">
    <SectionHeading
      title-level="h1"
      eyebrow="Checkout"
      title="Complete your booking"
      lead="Confirm your details to proceed to secure payment."
    />

    <nav class="booking-progress reveal" aria-label="Booking progress">
      <ol class="booking-progress__list">
        <li class="booking-progress__item is-done">
          <span class="booking-progress__num"><i class="fa-solid fa-check" aria-hidden="true" /></span>
          <span class="booking-progress__text">Vehicle</span>
        </li>
        <li class="booking-progress__item" :class="{ 'is-active': detailsActive, 'is-done': detailsDone }">
          <span class="booking-progress__num">
            <i v-if="detailsDone" class="fa-solid fa-check" aria-hidden="true" />
            <template v-else>2</template>
          </span>
          <span class="booking-progress__text">Details</span>
        </li>
        <li class="booking-progress__item" :class="{ 'is-active': paymentActive }">
          <span class="booking-progress__num">3</span>
          <span class="booking-progress__text">Payment</span>
        </li>
      </ol>
    </nav>

    <div class="booking-layout">
      <BookingSummary />

      <div class="booking-panel">
        <!-- Logged-in -->
        <article v-if="auth.isLoggedIn" class="booking-panel__card card card--elevated reveal">
          <div class="booking-panel__icon booking-panel__icon--gold" aria-hidden="true">
            <i class="fa-solid fa-shield-halved" />
          </div>
          <h2 class="booking-panel__title font-serif">Ready for payment</h2>
          <p class="booking-panel__lead">
            Your trip is saved under your account. Continue to pay securely and confirm your transfer.
          </p>
          <button class="btn btn--solid-gold booking-panel__cta" type="button" :disabled="loading" @click="continueLoggedIn">
            Continue to payment
            <i class="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
        </article>

        <!-- Guest auth -->
        <article v-else-if="step === 'auth'" class="booking-panel__card card card--elevated reveal">
          <div class="booking-panel__icon booking-panel__icon--blue" aria-hidden="true">
            <i class="fa-solid fa-user-pen" />
          </div>
          <h2 class="booking-panel__title font-serif">Guest checkout</h2>
          <p class="booking-panel__lead">Enter your contact details. We will send a verification code to your email.</p>

          <button
            class="btn secondary booking-panel__google"
            type="button"
            disabled
            title="Configure Google OAuth on backend"
          >
            <i class="fa-brands fa-google" aria-hidden="true" />
            Continue with Google
          </button>

          <div class="booking-panel__divider" role="separator">
            <span>or continue as guest</span>
          </div>

          <form class="booking-form" @submit.prevent="createBooking">
            <div class="field">
              <label class="label" for="guest-name">Full name</label>
              <input id="guest-name" v-model="guest.fullName" class="input" type="text" autocomplete="name" required />
            </div>
            <div class="field">
              <label class="label" for="guest-email">Email</label>
              <input id="guest-email" v-model="guest.email" class="input" type="email" autocomplete="email" required />
            </div>
            <div class="field">
              <label class="label" for="guest-phone">Phone</label>
              <input id="guest-phone" v-model="guest.phone" class="input" type="tel" autocomplete="tel" required />
            </div>
            <button class="btn btn--solid-gold booking-panel__cta" type="submit" :disabled="loading || !guestValid">
              Continue
              <i class="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
          </form>
        </article>

        <!-- OTP -->
        <article v-else-if="step === 'otp'" class="booking-panel__card card card--elevated reveal">
          <div class="booking-panel__icon booking-panel__icon--green" aria-hidden="true">
            <i class="fa-solid fa-envelope-circle-check" />
          </div>
          <h2 class="booking-panel__title font-serif">Verify your email</h2>
          <p class="booking-panel__lead">
            Enter the 6-digit code sent to
            <strong class="booking-panel__email">{{ guest.email }}</strong>
          </p>

          <OtpInput v-model="otp" class="booking-otp" />

          <button
            class="btn btn--solid-gold booking-panel__cta"
            type="button"
            :disabled="loading || otp.length < 6"
            @click="verifyOtp"
          >
            Verify &amp; continue
            <i class="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
          <p v-if="resendIn > 0" class="booking-panel__hint help">
            Resend available in {{ resendIn }}s
          </p>
        </article>
      </div>
    </div>

    <LoadingOverlay :show="loading" label="Processing your booking…" />
  </section>
</template>
