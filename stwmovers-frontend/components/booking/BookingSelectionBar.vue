<script setup lang="ts">
defineProps<{
  vehicleName: string
  fare?: number | null
  busy?: boolean
  ctaLabel?: string
}>()

defineEmits<{ (e: 'continue'): void; (e: 'back'): void }>()
</script>

<template>
  <div class="booking-selection-bar">
    <div class="booking-selection-bar__inner booking-shell__inner">
      <div class="booking-selection-bar__summary">
        <div class="booking-selection-bar__group">
          <span class="booking-selection-bar__label">Selected vehicle</span>
          <p class="booking-selection-bar__value">{{ vehicleName }}</p>
        </div>

        <template v-if="fare != null">
          <span class="booking-selection-bar__sep" aria-hidden="true" />
          <div class="booking-selection-bar__group">
            <span class="booking-selection-bar__label">Estimated fare</span>
            <p class="booking-selection-bar__value booking-selection-bar__value--fare">
              €{{ fare }}
            </p>
          </div>
        </template>
      </div>

      <div class="booking-selection-bar__actions">
        <button type="button" class="booking-selection-bar__back" @click="$emit('back')">
          Back
        </button>
        <button
          type="button"
          class="booking-selection-bar__cta"
          :disabled="busy"
          @click="$emit('continue')"
        >
          {{ ctaLabel || 'Continue to Details' }}
        </button>
      </div>
    </div>
  </div>
</template>
