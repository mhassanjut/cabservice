<script setup lang="ts">
import type { Vehicle } from '~/types/booking'

const props = defineProps<{
  vehicle: Vehicle
  selected?: boolean
  unavailable?: boolean
  continuing?: boolean
}>()
defineEmits<{ (e: 'select'): void }>()

const CAR_TYPE_LABELS: Record<string, string> = {
  SEDAN: 'Sedan',
  VAN: 'Van',
  SUV: 'SUV',
}

const category = computed(() => {
  const tier = props.vehicle.electric
    ? 'Electric'
    : props.vehicle.category === 'LUXURY'
      ? 'Luxury'
      : 'Business'
  return `${tier} ${CAR_TYPE_LABELS[props.vehicle.carType] ?? props.vehicle.carType}`
})

const amenities = 'Wi-Fi, Bottled Water, Phone Charger, Climate Control'

const mediaAspectRatio = ref('16 / 10')

const onMediaLoad = (event: Event) => {
  const img = event.target as HTMLImageElement | null
  if (!img?.naturalWidth || !img.naturalHeight) return
  mediaAspectRatio.value = `${img.naturalWidth} / ${img.naturalHeight}`
}

watch(
  () => props.vehicle.imagePath,
  () => {
    mediaAspectRatio.value = '16 / 10'
  },
)
</script>

<template>
  <article
    class="vehicle-card"
    :class="{ 'is-selected': selected, 'is-dimmed': unavailable }"
    role="button"
    :tabindex="unavailable ? -1 : 0"
    :aria-disabled="unavailable || undefined"
    @click="!unavailable && $emit('select')"
    @keydown.enter.prevent="!unavailable && $emit('select')"
  >
    <div
      class="vehicle-card__media"
      :style="{ '--vehicle-media-ratio': mediaAspectRatio }"
    >
      <span v-if="unavailable" class="vehicle-card__unavailable">Unavailable</span>
      <FleetVehicleImage :src="vehicle.imagePath" :alt="vehicle.name" @load="onMediaLoad" />
    </div>

    <div class="vehicle-card__body">
      <div class="vehicle-card__title-group">
        <h3 class="vehicle-card__name">{{ vehicle.name }}</h3>
        <p class="vehicle-card__category">{{ category }}</p>
      </div>

      <p v-if="vehicle.description" class="vehicle-card__desc">{{ vehicle.description }}</p>

      <ul class="vehicle-card__tags">
        <li class="vehicle-card__tag">{{ vehicle.seats }} Passengers</li>
        <li v-if="vehicle.bags" class="vehicle-card__tag">{{ vehicle.bags }} Large Bags</li>
      </ul>

      <div class="vehicle-card__amenities">
        <span class="vehicle-card__amenities-label">Complimentary Amenities</span>
        <p class="vehicle-card__amenities-list">{{ amenities }}</p>
      </div>

      <div class="vehicle-card__foot">
        <div class="vehicle-card__price">
          <span class="vehicle-card__price-label">Starting from</span>
          <span class="vehicle-card__price-value">€{{ vehicle.priceEur }}</span>
        </div>
        <button
          class="vehicle-card__cta"
          type="button"
          :disabled="unavailable || continuing"
          @click.stop="!unavailable && $emit('select')"
        >
          {{ selected ? 'Selected' : 'Book This Vehicle' }}
        </button>
      </div>
    </div>
  </article>
</template>
