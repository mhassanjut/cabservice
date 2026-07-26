<script setup lang="ts">
import { routes } from '~/constants/routes'
import { bookingService } from '~/services/api/booking.service'
import { authService } from '~/services/api/auth.service'
import { isValidPhone, normalizePhone } from '~/utils/phone'
import guestIconUrl from '~/assets/images/booking-page/ic_guest.svg?url'

definePageMeta({ layout: 'booking', middleware: ['checkout-guard'] })

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
const guestPhoneValid = ref(false)
const guestPhoneError = ref('')
const resendIn = ref(0)
let resendTimer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  auth.syncFromStorage()
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
  if (isCustomerLoggedIn.value) step.value = 'done'
})

watch(guest, (value: { fullName: string; email: string; phone: string }) => {
  if (isCustomerLoggedIn.value) return
  const normalizedPhone = normalizePhone(value.phone)
  const payload = {
    fullName: value.fullName.trim(),
    email: value.email.trim(),
    phone: normalizedPhone,
    bookingReference: booking.bookingReference || auth.guestSession?.bookingReference,
  }
  if (
    payload.fullName &&
    payload.email &&
    payload.phone &&
    guestPhoneValid.value &&
    isValidPhone(payload.phone)
  ) {
    booking.guest = { fullName: payload.fullName, email: payload.email, phone: payload.phone }
    auth.setGuestSession(payload)
    booking.persistToStorage()
  }
}, { deep: true })

watch(() => guest.phone, () => {
  if (guestPhoneError.value) guestPhoneError.value = ''
})

onUnmounted(() => {
  stopResendTimer()
})

const guestValid = computed(
  () =>
    guest.fullName.trim() &&
    guest.email.trim() &&
    guestPhoneValid.value &&
    isValidPhone(normalizePhone(guest.phone)),
)

const isCustomerLoggedIn = computed(() => auth.isLoggedIn && auth.isCustomer)

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
      passengerCount: booking.draft.passengerCount,
      scheduledAt: booking.scheduledAtIso,
      destinationCity: booking.draft.destinationCity,
    }

    if (isCustomerLoggedIn.value) {
      if (!auth.token) {
        toast.show('Session expired. Please sign in again.', 'error')
        await router.push({ path: routes.login, query: { redirect: useRoute().fullPath } })
        return
      }
      booking.clearGuestDetails()
      const b = await bookingService.create(basePayload, { auth: true, silent: true })
      booking.bookingReference = b.bookingReference
      booking.persistToStorage()
      await router.push(routes.payment)
      return
    }

    const normalizedPhone = normalizePhone(guest.phone)
    if (!guestValid.value || !isValidPhone(normalizedPhone)) {
      guestPhoneError.value = 'Enter a valid mobile number for the selected country.'
      toast.show('Please enter your contact details to continue as guest.', 'error')
      return
    }
    guest.phone = normalizedPhone

    const b = await bookingService.create(
      {
        ...basePayload,
        guestName: guest.fullName.trim(),
        guestEmail: guest.email.trim(),
        guestPhone: normalizedPhone,
      },
      { auth: false, silent: true },
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
    if (status === 401 && isCustomerLoggedIn.value) {
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
  <div class="vehicle-page">
    <div class="vehicle-page__inner booking-shell__inner">
      <header class="vehicle-page__header">
        <p class="vehicle-page__eyebrow">Checkout</p>
        <h1 class="vehicle-page__title checkout-page__title">Complete your booking</h1>
        <p class="vehicle-page__lead">Confirm your details to proceed to secure payment.</p>
      </header>

      <div class="vehicle-page__main">
        <BookingCheckoutSummary class="vehicle-page__aside" />

        <div class="vehicle-page__content">
          <!-- Logged-in -->
          <article v-if="isCustomerLoggedIn" class="checkout-panel__card booking-card">
            <div class="checkout-panel__head checkout-panel__head--icon">
              <span class="checkout-panel__icon checkout-panel__icon--gold" aria-hidden="true">
                <i class="fa-solid fa-shield-halved" />
              </span>
              <div>
                <h2 class="checkout-panel__title">Ready for payment</h2>
                <p class="checkout-panel__lead">
                  Booking as <strong>{{ auth.fullName }}</strong>. Continue to complete your transfer.
                </p>
              </div>
            </div>
            <button
              class="checkout-panel__submit"
              type="button"
              :disabled="loading"
              @click="continueLoggedIn"
            >
              Continue
              <i class="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
          </article>

          <!-- Guest auth -->
          <article v-else-if="step === 'auth' && !showOtpModal" class="checkout-panel__card booking-card">
            <div class="checkout-panel__head checkout-panel__head--icon">
              <img class="checkout-panel__icon-img" :src="guestIconUrl" alt="" aria-hidden="true" />
              <div>
                <h2 class="checkout-panel__title">Guest Checkout or create account</h2>
                <p class="checkout-panel__lead">
                  Enter your contact details. We will send a verification code to your email.
                </p>
              </div>
            </div>

            <GoogleSignInButton
              class="checkout-panel__google"
              @success="onGoogleSuccess"
              @error="onGoogleError"
            />

            <div class="checkout-panel__divider" role="separator">
              <span>Or continue as guest</span>
            </div>

            <form class="checkout-panel__form" @submit.prevent="createBooking">
              <div class="checkout-panel__field">
                <label class="checkout-panel__label" for="guest-name">Full Name</label>
                <input
                  id="guest-name"
                  v-model="guest.fullName"
                  class="checkout-panel__input"
                  type="text"
                  autocomplete="name"
                  required
                />
              </div>
              <div class="checkout-panel__field">
                <label class="checkout-panel__label" for="guest-email">Email</label>
                <input
                  id="guest-email"
                  v-model="guest.email"
                  class="checkout-panel__input"
                  type="email"
                  autocomplete="email"
                  required
                />
              </div>
              <div class="checkout-panel__field">
                <label class="checkout-panel__label" for="guest-phone">Phone</label>
                <PhoneInput
                  id="guest-phone"
                  v-model="guest.phone"
                  :invalid="Boolean(guestPhoneError)"
                  @validate="guestPhoneValid = $event"
                />
                <p v-if="guestPhoneError" class="err" role="alert">{{ guestPhoneError }}</p>
              </div>
              <button
                class="checkout-panel__submit"
                type="submit"
                :disabled="loading || !guestValid"
              >
                Continue
                <i class="fa-solid fa-arrow-right" aria-hidden="true" />
              </button>
            </form>
          </article>

          <article v-else-if="showOtpModal" class="checkout-panel__card booking-card">
            <div class="checkout-panel__head checkout-panel__head--icon">
              <span class="checkout-panel__icon checkout-panel__icon--green" aria-hidden="true">
                <i class="fa-solid fa-envelope" />
              </span>
              <div>
                <h2 class="checkout-panel__title">Check your email</h2>
                <p class="checkout-panel__lead">
                  We sent a verification code to
                  <strong>{{ guest.email }}</strong>. Enter it in the dialog to continue.
                </p>
              </div>
            </div>
          </article>
        </div>
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
  </div>
</template>
