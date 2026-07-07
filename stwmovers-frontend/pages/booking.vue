<script setup lang="ts">
import { routes } from '~/constants/routes'
import { bookingService } from '~/services/api/booking.service'
import { authService } from '~/services/api/auth.service'

definePageMeta({ middleware: ['checkout-guard'] })

usePageSeo({ title: 'Booking details', path: '/booking' })

const booking = useBookingStore()
const auth = useAuthStore()
const router = useRouter()
const toast = useToastStore()

const step = ref<'auth' | 'done'>('auth')
const loading = ref(false)
const googleLoading = ref(false)
const otpLoading = ref(false)
const showOtpModal = ref(false)
const otpError = ref('')
const guest = reactive({ fullName: '', email: '', phone: '' })
const resendIn = ref(0)
let resendTimer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  auth.hydrate()
  await nextTick()
  if (booking.guest) {
    guest.fullName = booking.guest.fullName
    guest.email = booking.guest.email
    guest.phone = booking.guest.phone
  } else if (auth.guestSession) {
    guest.fullName = auth.guestSession.fullName
    guest.email = auth.guestSession.email
    guest.phone = auth.guestSession.phone
  }
  if (!booking.isDraftValid) {
    toast.show('Your trip details are incomplete. Please start from the home page.', 'error')
    await router.replace(routes.home)
    return
  }
  if (!booking.vehicle && !booking.otherCar) {
    await router.replace(routes.cars)
    return
  }
  if (auth.isLoggedIn) step.value = 'done'
})

watch(guest, (value) => {
  if (auth.isLoggedIn) return
  const payload = {
    fullName: value.fullName.trim(),
    email: value.email.trim(),
    phone: value.phone.trim(),
    bookingReference: booking.bookingReference || auth.guestSession?.bookingReference,
  }
  if (payload.fullName && payload.email && payload.phone) {
    booking.guest = { fullName: payload.fullName, email: payload.email, phone: payload.phone }
    auth.setGuestSession(payload)
    booking.persistToStorage()
  }
}, { deep: true })

onUnmounted(() => {
  stopResendTimer()
})

const guestValid = computed(
  () => guest.fullName.trim() && guest.email.trim() && guest.phone.trim(),
)

const detailsActive = computed(() => !auth.isLoggedIn && step.value === 'auth' && !showOtpModal.value)
const detailsDone = computed(() => auth.isLoggedIn || showOtpModal.value || step.value === 'done')
const paymentActive = computed(() => auth.isLoggedIn || showOtpModal.value || step.value === 'done')

const stopResendTimer = () => {
  if (resendTimer) {
    clearInterval(resendTimer)
    resendTimer = null
  }
}

const startResendTimer = (seconds: number) => {
  stopResendTimer()
  resendIn.value = seconds
  resendTimer = setInterval(() => {
    if (resendIn.value <= 1) {
      resendIn.value = 0
      stopResendTimer()
      return
    }
    resendIn.value -= 1
  }, 1000)
}

const createBooking = async () => {
  auth.hydrate()
  loading.value = true
  try {
    const basePayload = {
      carId: booking.otherCar ? undefined : booking.vehicle?.id,
      otherCar: booking.otherCar,
      pickupAddress: booking.draft.pickupLocation,
      dropoffAddress: booking.draft.dropoffLocation,
      pickupLat: booking.draft.pickup!.lat,
      pickupLng: booking.draft.pickup!.lng,
      dropoffLat: booking.draft.dropoff!.lat,
      dropoffLng: booking.draft.dropoff!.lng,
      distanceKm: booking.draft.distanceKm!,
      pickupCity: booking.draft.pickupCity!,
      scheduledAt: booking.scheduledAtIso,
      destinationCity: booking.draft.destinationCity,
    }

    if (auth.isLoggedIn) {
      if (!auth.token) {
        toast.show('Session expired. Please sign in again.', 'error')
        await router.push({ path: routes.login, query: { redirect: useRoute().fullPath } })
        return
      }
      booking.clearGuestDetails()
      const b = await bookingService.create(basePayload, { auth: true })
      booking.bookingReference = b.bookingReference
      booking.persistToStorage()
      await router.push(routes.payment)
      return
    }

    if (!guestValid.value) {
      toast.show('Please enter your contact details to continue as guest.', 'error')
      return
    }

    const b = await bookingService.create(
      {
        ...basePayload,
        guestName: guest.fullName.trim(),
        guestEmail: guest.email.trim(),
        guestPhone: guest.phone.trim(),
      },
      { auth: false },
    )
    booking.bookingReference = b.bookingReference
    booking.persistToStorage()
    if (b.status === 'OTP_PENDING') {
      auth.setGuestSession({
        fullName: guest.fullName,
        email: guest.email,
        phone: guest.phone,
        bookingReference: b.bookingReference,
      })
      const sent = await authService.sendOtp(guest.email, b.bookingReference)
      otpError.value = ''
      startResendTimer(sent.ttlSeconds || 60)
      showOtpModal.value = true
    } else {
      await router.push(routes.payment)
    }
  } catch (e: unknown) {
    const err = e as { status?: number; statusCode?: number; data?: { message?: string }; message?: string }
    const status = err.status ?? err.statusCode
    const msg = err.data?.message ?? err.message ?? 'Booking failed. Please try again.'
    if (status === 401 && auth.isLoggedIn) {
      toast.show('Session expired. Please sign in again.', 'error')
      await router.push({ path: routes.login, query: { redirect: useRoute().fullPath } })
      return
    }
    toast.show(msg, 'error')
  } finally {
    loading.value = false
  }
}

const verifyOtp = async (otp: string) => {
  otpLoading.value = true
  otpError.value = ''
  try {
    await authService.verifyOtp(guest.email, otp, booking.bookingReference)
    showOtpModal.value = false
    stopResendTimer()
    await router.push(routes.payment)
  } catch {
    otpError.value = 'Invalid or expired OTP. Please try again.'
  } finally {
    otpLoading.value = false
  }
}

const resendOtp = async () => {
  if (resendIn.value > 0 || otpLoading.value || !booking.bookingReference) return
  otpLoading.value = true
  otpError.value = ''
  try {
    const sent = await authService.sendOtp(guest.email, booking.bookingReference)
    startResendTimer(sent.ttlSeconds || 60)
  } catch {
    otpError.value = 'Could not resend code. Please try again.'
  } finally {
    otpLoading.value = false
  }
}

const continueLoggedIn = async () => {
  await createBooking()
}

const onGoogleSuccess = async (idToken: string) => {
  googleLoading.value = true
  try {
    const session = await authService.googleLogin(idToken)
    auth.setSession(session)
    auth.clearGuestSession()
    step.value = 'done'
    if (booking.bookingReference) {
      await router.push(routes.payment)
    } else {
      await continueLoggedIn()
    }
  } catch {
    toast.show('Google sign-in failed. Please try again.', 'error')
  } finally {
    googleLoading.value = false
  }
}

const onGoogleError = (message: string) => {
  toast.show(message, 'error')
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
            Booking as <strong>{{ auth.fullName }}</strong>. Continue to complete your transfer.
          </p>
          <button class="btn btn--solid-gold booking-panel__cta" type="button" :disabled="loading" @click="continueLoggedIn">
            Continue to payment
            <i class="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
        </article>

        <!-- Guest auth -->
        <article v-else-if="step === 'auth' && !showOtpModal" class="booking-panel__card card card--elevated reveal">
          <div class="booking-panel__icon booking-panel__icon--blue" aria-hidden="true">
            <i class="fa-solid fa-user-pen" />
          </div>
          <h2 class="booking-panel__title font-serif">Guest checkout</h2>
          <p class="booking-panel__lead">Enter your contact details. We will send a verification code to your email.</p>

          <GoogleSignInButton
            class="booking-panel__google"
            @success="onGoogleSuccess"
            @error="onGoogleError"
          />

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

        <article v-else-if="showOtpModal" class="booking-panel__card card card--elevated reveal">
          <div class="booking-panel__icon booking-panel__icon--green" aria-hidden="true">
            <i class="fa-solid fa-envelope" />
          </div>
          <h2 class="booking-panel__title font-serif">Check your email</h2>
          <p class="booking-panel__lead">
            We sent a verification code to
            <strong class="booking-panel__email">{{ guest.email }}</strong>.
            Enter it in the dialog to continue.
          </p>
        </article>
      </div>
    </div>

    <OtpVerifyModal
      :show="showOtpModal"
      :email="guest.email"
      :loading="otpLoading"
      :error="otpError"
      :resend-in="resendIn"
      @verify="verifyOtp"
      @resend="resendOtp"
    />

    <LoadingOverlay :show="loading || googleLoading" label="Processing your booking…" />
  </section>
</template>
