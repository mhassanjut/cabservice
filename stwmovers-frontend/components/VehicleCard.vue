<script setup lang="ts">
import type { Vehicle } from '~/types/booking'

defineProps<{ vehicle: Vehicle; selected?: boolean; unavailable?: boolean }>()
defineEmits<{ (e: 'select'): void }>()
</script>

<template>
  <article
    class="vehicle-card-lux card card--elevated"
    :class="{ 'is-selected': selected, 'is-dimmed': unavailable }"
    role="button"
    tabindex="0"
    @click="!unavailable && $emit('select')"
    @keydown.enter.prevent="!unavailable && $emit('select')"
  >
    <div v-if="unavailable" class="vehicle-unavailable">Unavailable</div>

    <div class="vehicle-card-lux__inner">
      <div class="vehicle-card-lux__thumb">
        <img :src="vehicle.imagePath" :alt="vehicle.name" width="120" height="120" loading="lazy" />
      </div>

      <div class="vehicle-card-lux__body">
        <div class="vehicle-card-lux__top">
          <h3 class="vehicle-card-lux__name font-serif">{{ vehicle.name }}</h3>
          <p v-if="vehicle.description" class="vehicle-card-lux__desc">{{ vehicle.description }}</p>
        </div>

        <div class="vehicle-card-lux__meta">
          <span class="pill pill--gold">
            <i class="fa-solid fa-user" aria-hidden="true" />
            {{ vehicle.seats }} seats
          </span>
          <span class="pill">{{ vehicle.carType }}</span>
          <span v-if="vehicle.category === 'LUXURY'" class="pill pill--luxury">Luxury</span>
          <span v-if="vehicle.electric" class="pill pill--electric">
            <i class="fa-solid fa-bolt" aria-hidden="true" />
            Electric
          </span>
        </div>

        <div class="vehicle-card-lux__foot">
          <div class="vehicle-card-lux__price">
            <span class="vehicle-card-lux__price-label">From</span>
            <span class="vehicle-fare">€{{ vehicle.priceEur }}</span>
          </div>
          <button class="btn btn--solid-gold vehicle-card-lux__cta" type="button" :disabled="unavailable">
            {{ selected ? 'Selected' : 'Select' }}
            <i class="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
