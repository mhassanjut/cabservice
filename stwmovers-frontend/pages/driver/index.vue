<script setup lang="ts">
definePageMeta({ middleware: 'driver' })

import { driverService } from '~/services/api/driver.service'
import type { BookingDto } from '~/types/api'

const rides = ref<BookingDto[]>([])

onMounted(async () => {
  rides.value = await driverService.rides()
})

const act = async (id: string, action: 'accept' | 'reject') => {
  if (action === 'accept') await driverService.accept(id)
  else await driverService.reject(id)
  rides.value = await driverService.rides()
}

const advance = async (id: string, status: string) => {
  await driverService.status(id, status)
  rides.value = await driverService.rides()
}
</script>

<template>
  <section>
    <h1 class="font-serif">Assigned rides</h1>
    <p v-if="!rides.length" class="empty">No active rides.</p>
    <article v-for="r in rides" :key="r.id" class="card card--elevated">
      <p>{{ r.pickupAddress }} → {{ r.dropoffAddress }}</p>
      <p>{{ r.guestName || r.guestEmail }} · €{{ r.calculatedFare }}</p>
      <div class="btn-row">
        <button class="btn secondary" @click="act(r.id, 'accept')">Accept</button>
        <button class="btn secondary" @click="act(r.id, 'reject')">Reject</button>
        <button class="btn btn--solid-gold" @click="advance(r.id, 'DRIVER_EN_ROUTE')">En route</button>
        <button class="btn btn--solid-gold" @click="advance(r.id, 'RIDE_COMPLETED')">Complete</button>
      </div>
    </article>
  </section>
</template>
