<script setup lang="ts">
import { routes } from '~/constants/routes'
import { bookingService } from '~/services/api/booking.service'
import { paymentService } from '~/services/api/payment.service'
import { userService } from '~/services/api/user.service'
import type { BookingDto } from '~/types/api'
import { isValidPhone } from '~/utils/phone'

definePageMeta({ layout: 'booking', middleware: ['checkout-guard'] })

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

const isCustomerLoggedIn = computed(() => auth.isLoggedIn && auth.isCustomer)

const fareLabel = computed(() => {
  if (bookingData.value?.calculatedFare != null) return `€${bookingData.value.calculatedFare}`
  if (booking.vehicle?.priceEur) return `€${booking.vehicle.priceEur}`
  return '—'
})

const loadProfilePhone = async () => {
  if (!isCustomerLoggedIn.value) return
  try {
    const profile = await userService.profile()
    userPhone.value = profile?.phone ?? ''
  } catch {
    /* api client handles user-facing errors */
  }
}

onMounted(async () => {
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

  if (isCustomerLoggedIn.value && !isValidPhone(userPhone.value)) {
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
  <div class="vehicle-page">
    <div class="vehicle-page__inner booking-shell__inner">
      <header class="vehicle-page__header">
        <p class="vehicle-page__eyebrow">Checkout</p>
        <h1 class="vehicle-page__title checkout-page__title">Secure payment</h1>
        <p class="vehicle-page__lead">
          Complete your transfer with Stripe. You will be redirected to a secure checkout page.
        </p>
      </header>

      <div class="vehicle-page__main">
        <BookingCheckoutSummary class="vehicle-page__aside" />

        <div class="vehicle-page__content">
          <article class="checkout-panel__card booking-card">
            <div class="checkout-panel__head checkout-panel__head--icon">
              <span class="checkout-panel__icon checkout-panel__icon--gold checkout-panel__icon--compact" aria-hidden="true">
                <img class="checkout-panel__icon-img checkout-panel__icon-img--inset" src="/LockLogo.svg" alt="" />
              </span>
              <div>
                <h2 class="checkout-panel__title">Pay for your ride</h2>
                <p class="checkout-panel__lead">
                  <template v-if="isCustomerLoggedIn">
                    Booking as <strong>{{ auth.fullName }}</strong>
                  </template>
                  <template v-else-if="auth.isGuestSession">
                    Booking as <strong>{{ auth.guestSession?.fullName }}</strong>
                  </template>
                  &nbsp;· Reference <strong>{{ booking.bookingReference }}</strong>
                </p>
              </div>
            </div>

            <dl class="payment-box">
              <div class="payment-box__row">
                <dt class="payment-box__label">Amount due</dt>
                <dd class="payment-box__value payment-box__value--amount">{{ fareLabel }}</dd>
              </div>
              <div class="payment-box__row payment-box__row--divided">
                <dt class="payment-box__label">Payment method</dt>
                <dd class="payment-box__value payment-box__method">
                  <i class="fa-regular fa-credit-card" aria-hidden="true" />
                  Card via Stripe Checkout
                </dd>
              </div>
            </dl>

            <ul class="payment-trust">
              <li>
                <img class="payment-trust__icon" src="/EncryptLogo.svg" alt="" aria-hidden="true" />
                Encrypted checkout
              </li>
              <li class="payment-trust__divider" role="presentation" aria-hidden="true" />
              <li>
                <img class="payment-trust__icon" src="/ThunderLogo.svg" alt="" aria-hidden="true" />
                Powered by Stripe
              </li>
            </ul>

            <button
              class="checkout-panel__submit"
              type="button"
              :disabled="loading"
              @click="pay"
            >
              Pay now
              <i class="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
          </article>
        </div>
      </div>
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
  </div>
</template>
