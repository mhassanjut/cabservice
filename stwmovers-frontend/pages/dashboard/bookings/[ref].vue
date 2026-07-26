<script setup lang="ts">
definePageMeta({
  layout: 'booking',
  middleware: ['customer', 'no-guest-dashboard'],
  ssr: false,
})

import type { BookingDto } from '~/types/api'
import { bookingService } from '~/services/api/booking.service'
import { paymentService } from '~/services/api/payment.service'

const auth = useAuthStore()
const route = useRoute()
const refId = computed(() => route.params.ref as string)
const booking = ref<BookingDto | null>(null)
const paymentStatus = ref<string | null>(null)
const loading = ref(true)

onMounted(async () => {
  auth.hydrate()
  if (!auth.isLoggedIn || !auth.token) {
    loading.value = false
    return
  }
  try {
    booking.value = await bookingService.get(refId.value)
    try {
      const payment = await paymentService.get(refId.value)
      paymentStatus.value = payment.status
    } catch {
      paymentStatus.value = null
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <LoadingOverlay :show="loading" label="Loading booking…" />
    <article v-if="booking" class="card card--elevated booking-detail">
      <p class="eyebrow">Booking detail</p>
      <h1 class="font-serif">{{ booking.bookingReference }}</h1>
      <BookingStateTracker :status="booking.status" />
      <dl class="summary-grid">
        <div><dt>Route</dt><dd>{{ booking.pickupAddress }} → {{ booking.dropoffAddress }}</dd></div>
        <div><dt>Scheduled</dt><dd>{{ booking.scheduledAt }}</dd></div>
        <div><dt>Fare</dt><dd>€{{ booking.calculatedFare ?? '—' }}</dd></div>
        <div><dt>Driver</dt><dd>{{ booking.driverId ? 'Assigned' : 'Pending assignment' }}</dd></div>
        <div v-if="paymentStatus"><dt>Payment</dt><dd>{{ paymentStatus }}</dd></div>
      </dl>
    </article>
  </section>
</template>

<style scoped>
.booking-detail {
  padding: 1.25rem;
}
</style>
