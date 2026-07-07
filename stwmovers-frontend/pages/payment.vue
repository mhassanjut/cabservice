<script setup lang="ts">
import { routes } from '~/constants/routes'
import { bookingService } from '~/services/api/booking.service'
import { paymentService } from '~/services/api/payment.service'
import { userService } from '~/services/api/user.service'
import type { BookingDto } from '~/types/api'
import { isValidPhone } from '~/utils/phone'

definePageMeta({ middleware: ['checkout-guard'] })

usePageSeo({ title: 'Secure payment', path: '/payment' })
const booking = useBookingStore()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const loading = ref(false)
const bookingData = ref<BookingDto | null>(null)
const userPhone = ref('')
const showPhoneModal = ref(false)
const phoneSaving = ref(false)
const phoneError = ref('')

const fareLabel = computed(() => {
  if (bookingData.value?.calculatedFare != null) return `€${bookingData.value.calculatedFare}`
  if (booking.vehicle?.priceEur) return `€${booking.vehicle.priceEur}`
  return '—'
})

const loadProfilePhone = async () => {
  if (!auth.isLoggedIn || !auth.token) return
  try {
    const profile = await userService.profile()
    userPhone.value = profile.phone ?? ''
  } catch {
    /* api client handles user-facing errors */
  }
}

onMounted(async () => {
  auth.hydrate()
  booking.hydrateFromStorage()

  if (route.query.cancelled === '1') {
    toast.show('Payment was cancelled. You can try again when ready.', 'info')
  }

  if (!booking.bookingReference) {
    await router.replace(routes.home)
    return
  }

  try {
    bookingData.value = await bookingService.get(booking.bookingReference)
    const status = bookingData.value.status
    if (['CONFIRMED', 'COMPLETED', 'DRIVER_ASSIGNED', 'DRIVER_ACCEPTED', 'IN_PROGRESS'].includes(status)) {
      await router.replace({ path: routes.confirm, query: { ref: booking.bookingReference } })
      return
    }
    if (status === 'OTP_PENDING') {
      await router.replace(routes.booking)
    }
  } catch {
    toast.show('Could not load booking details.', 'error')
  }

  await loadProfilePhone()
})

const proceedToCheckout = async () => {
  if (loading.value || !booking.bookingReference) return
  loading.value = true
  try {
    const session = await paymentService.session(booking.bookingReference)
    if (!session.checkoutUrl) {
      toast.show('Could not start checkout. Check Stripe configuration on the server.', 'error')
      return
    }
    if (import.meta.client) {
      window.location.href = session.checkoutUrl
    }
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; message?: string }
    toast.show(err.data?.message ?? err.message ?? 'Payment could not be started.', 'error')
  } finally {
    loading.value = false
  }
}

const pay = async () => {
  if (loading.value || phoneSaving.value || !booking.bookingReference) return

  if (auth.isLoggedIn && !isValidPhone(userPhone.value)) {
    phoneError.value = ''
    showPhoneModal.value = true
    return
  }

  await proceedToCheckout()
}

const savePhoneAndPay = async (phone: string) => {
  phoneSaving.value = true
  phoneError.value = ''
  try {
    const profile = await userService.updateProfile(auth.fullName, phone)
    userPhone.value = profile.phone ?? phone
    showPhoneModal.value = false
    toast.show('Contact number saved.', 'success')
    await proceedToCheckout()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; message?: string }
    phoneError.value = err.data?.message ?? err.message ?? 'Could not save your number. Please try again.'
  } finally {
    phoneSaving.value = false
  }
}
</script>

<template>
  <section class="booking-page payment-page">
    <SectionHeading
      title-level="h1"
      eyebrow="Checkout"
      title="Secure payment"
      lead="Complete your transfer with Stripe. You will be redirected to a secure checkout page."
    />

    <BookingCheckoutProgress details-done payment-active />

    <div class="booking-layout">
      <BookingSummary />

      <article class="booking-panel__card card card--elevated payment-panel reveal">
        <div class="booking-panel__icon booking-panel__icon--gold" aria-hidden="true">
          <i class="fa-solid fa-lock" />
        </div>
        <h2 class="booking-panel__title font-serif">Pay for your ride</h2>
        <p class="booking-panel__lead">
          <template v-if="auth.isLoggedIn">
            Booking as <strong>{{ auth.fullName }}</strong>.
          </template>
          <template v-else-if="auth.isGuestSession">
            Guest booking for <strong>{{ auth.guestSession?.fullName }}</strong>.
          </template>
          Reference <strong>{{ booking.bookingReference }}</strong>
        </p>

        <dl class="payment-panel__summary">
          <div>
            <dt>Amount due</dt>
            <dd class="summary-fare">{{ fareLabel }}</dd>
          </div>
          <div>
            <dt>Payment method</dt>
            <dd>Card via Stripe Checkout</dd>
          </div>
        </dl>

        <ul class="payment-panel__trust">
          <li><i class="fa-solid fa-shield-halved" aria-hidden="true" /> Encrypted checkout</li>
          <li><i class="fa-brands fa-stripe" aria-hidden="true" /> Powered by Stripe</li>
        </ul>

        <button
          class="btn btn--solid-gold booking-panel__cta"
          type="button"
          :disabled="loading"
          @click="pay"
        >
          Pay now
          <i class="fa-solid fa-arrow-right" aria-hidden="true" />
        </button>
      </article>
    </div>

    <LoadingOverlay :show="loading" label="Redirecting to Stripe…" />

    <PhoneRequiredModal
      :show="showPhoneModal"
      :loading="phoneSaving"
      :error="phoneError"
      :initial-phone="userPhone"
      @save="savePhoneAndPay"
      @close="showPhoneModal = false"
    />
  </section>
</template>

<style scoped>
.payment-panel {
  padding: clamp(1.25rem, 3vw, 1.75rem);
}

.payment-panel__summary {
  display: grid;
  gap: 12px;
  margin: 1.25rem 0;
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg-elevated);
}

.payment-panel__summary dt {
  font-size: 0.75rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.payment-panel__summary dd {
  margin: 4px 0 0;
}

.payment-panel__trust {
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  color: var(--color-muted);
  font-size: 0.875rem;
}

.payment-panel__trust i {
  color: var(--color-gold-bright);
  margin-right: 6px;
}
</style>
