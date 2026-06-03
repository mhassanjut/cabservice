<script setup lang="ts">
import { routes } from '~/constants/routes'
import { bookingService } from '~/services/api/booking.service'
import type { BookingDto } from '~/types/api'

const route = useRoute()
const booking = useBookingStore()
const data = ref<BookingDto | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

const refId = computed(
  () => (route.query.ref as string) || booking.bookingReference || '',
)

const load = async () => {
  if (!refId.value) return
  data.value = await bookingService.get(refId.value)
}

onMounted(async () => {
  await load()
  timer = setInterval(load, 10000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const newRide = () => {
  booking.clear()
  navigateTo(routes.home)
}
</script>

<template>
  <section class="confirm-page">
    <div class="confirm-check"><i class="fa-solid fa-circle-check" /></div>
    <h1 class="font-serif">Booking confirmed</h1>
    <p v-if="data" class="ref">Ref {{ data.bookingReference }}</p>
    <BookingStateTracker v-if="data" :status="data.status" />
    <BookingSummary v-if="!data" />
    <dl v-if="data" class="summary-grid card card--elevated">
      <div><dt>Route</dt><dd>{{ data.pickupAddress }} → {{ data.dropoffAddress }}</dd></div>
      <div><dt>Fare</dt><dd>€{{ data.calculatedFare }}</dd></div>
      <div><dt>Driver</dt><dd>{{ data.driverId ? 'Assigned' : 'Finding your chauffeur…' }}</dd></div>
    </dl>
    <button class="btn btn--solid-gold" @click="newRide">Book another ride</button>
  </section>
</template>
