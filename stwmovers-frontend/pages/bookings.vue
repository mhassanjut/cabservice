<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { bookingService } from '~/services/api/booking.service'

const list = ref<Awaited<ReturnType<typeof bookingService.mine>> | null>(null)

onMounted(async () => {
  list.value = await bookingService.mine()
})
</script>

<template>
  <section>
    <h1 class="font-serif">Your bookings</h1>
    <p v-if="!list?.content.length" class="empty">No bookings yet.</p>
    <article v-for="b in list?.content" :key="b.id" class="card card--elevated">
      <strong>{{ b.bookingReference }}</strong> — {{ b.status }} — €{{ b.calculatedFare }}
    </article>
  </section>
</template>
