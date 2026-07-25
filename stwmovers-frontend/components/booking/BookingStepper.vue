<script setup lang="ts">
const props = withDefaults(defineProps<{ current?: number }>(), { current: 1 })

// The final step reads as a single combined "Payment Confirmation" label while it is still
// upcoming/current, but splits into its own distinct "Confirmed" step once actually reached.
const steps = computed(() =>
  props.current > 3
    ? ['Select Vehicle', 'Details', 'Payment', 'Confirmed']
    : ['Select Vehicle', 'Details', 'Payment Confirmation'],
)

const stateOf = (index: number) => {
  const step = index + 1
  if (step < props.current) return 'is-done'
  if (step === props.current) return 'is-current'
  return ''
}
</script>

<template>
  <nav class="booking-stepper" aria-label="Booking progress">
    <ol class="booking-stepper__list booking-shell__inner">
      <template v-for="(label, index) in steps" :key="label">
        <li
          class="booking-stepper__item"
          :class="stateOf(index)"
          :aria-current="index + 1 === current ? 'step' : undefined"
        >
          <span class="booking-stepper__badge">
            <i v-if="index + 1 < current" class="fa-solid fa-check" aria-hidden="true" />
            <template v-else>{{ index + 1 }}</template>
          </span>
          <span class="booking-stepper__label">{{ label }}</span>
        </li>
        <li
          v-if="index < steps.length - 1"
          class="booking-stepper__line"
          aria-hidden="true"
        />
      </template>
    </ol>
  </nav>
</template>
