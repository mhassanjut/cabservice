<script setup lang="ts">
import { routes } from '~/constants/routes'
import { paymentService } from '~/services/api/payment.service'

usePageSeo({ title: 'Payment', path: '/payment' })

const booking = useBookingStore()
const router = useRouter()
const loading = ref(false)

onMounted(async () => {
  if (!booking.bookingReference) await router.replace(routes.booking)
})

const pay = async () => {
  if (!confirm('Leave this page? Payment may be interrupted.')) return
  loading.value = true
  try {
    const s = await paymentService.session(booking.bookingReference)
    if (import.meta.client && s.checkoutUrl) window.location.href = s.checkoutUrl
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section>
    <BookingSummary />
    <article class="card card--elevated">
      <p>Secure checkout powered by Stripe.</p>
      <button class="btn btn--solid-gold" :disabled="loading" @click="pay">Pay Now</button>
    </article>
    <LoadingOverlay :show="loading" label="Redirecting to Stripe…" />
  </section>
</template>
