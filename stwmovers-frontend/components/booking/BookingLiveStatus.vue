<script setup lang="ts">
import type { BookingStatus } from '~/types/api'

const props = defineProps<{ status: BookingStatus }>()

const steps: { key: BookingStatus; label: string }[] = [
  { key: 'CREATED', label: 'Started' },
  { key: 'OTP_PENDING', label: 'Depart' },
  { key: 'PAYMENT_PENDING', label: 'Payment' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'DRIVER_ASSIGNED', label: 'Driver' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'COMPLETED', label: 'Complete' },
]

const idx = computed(() => {
  const order = steps.map((s) => s.key)
  const i = order.indexOf(props.status)
  return Math.max(0, i)
})
</script>

<template>
  <ol class="live-status" aria-label="Booking status progress">
    <li
      v-for="(step, i) in steps"
      :key="step.key"
      class="live-status__item"
      :class="{ 'is-done': i < idx, 'is-current': i === idx }"
    >
      <span class="live-status__marker" aria-hidden="true">
        <span class="live-status__circle">
          <!-- <i v-if="i < idx" class="fa-solid fa-check" /> -->
          <img
            v-if="i < idx"
            src="/status-circle-green.svg"
            alt=""
            width="24"
            height="24"
            class="live-status__icon"
          >
          <img
            v-else-if="i === idx"
            src="/status-circle-yellow.svg"
            alt=""
            width="24"
            height="24"
            class="live-status__icon"
          >
        </span>
        <span v-if="i < steps.length - 1" class="live-status__line" />
      </span>
      <span class="live-status__label">{{ step.label }}</span>
    </li>
  </ol>
</template>
