<script setup lang="ts">
import type { BookingStatus } from '~/types/api'

const props = defineProps<{ status: BookingStatus }>()

const steps: BookingStatus[] = [
  'CREATED', 'OTP_PENDING', 'PAYMENT_PENDING', 'CONFIRMED', 'DRIVER_ASSIGNED', 'IN_PROGRESS', 'COMPLETED',
]

const idx = computed(() => Math.max(0, steps.indexOf(props.status)))
</script>

<template>
  <ol class="state-tracker">
    <li
      v-for="(s, i) in steps"
      :key="s"
      :class="{ active: i === idx, done: i < idx }"
    >
      {{ s.replace(/_/g, ' ') }}
    </li>
  </ol>
</template>
