<script setup lang="ts">
import type { BookingStatus } from '~/types/api'

const props = defineProps<{ status: BookingStatus }>()

const steps: { key: BookingStatus; label: string }[] = [
  { key: 'CREATED', label: 'Created' },
  { key: 'OTP_PENDING', label: 'Verify' },
  { key: 'PAYMENT_PENDING', label: 'Payment' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'DRIVER_ASSIGNED', label: 'Driver' },
  { key: 'IN_PROGRESS', label: 'In progress' },
  { key: 'COMPLETED', label: 'Complete' },
]

const idx = computed(() => {
  const order = steps.map((s) => s.key)
  const i = order.indexOf(props.status)
  return Math.max(0, i)
})
</script>

<template>
  <ol class="state-tracker" aria-label="Booking status progress">
    <li
      v-for="(step, i) in steps"
      :key="step.key"
      :class="{ active: i === idx, done: i < idx }"
    >
      <span class="state-tracker__dot" aria-hidden="true" />
      {{ step.label }}
    </li>
  </ol>
</template>
