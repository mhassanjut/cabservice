<script setup lang="ts">
import { fleetFilters, vehicles } from '~/data/vehicles'

const filter = ref<(typeof fleetFilters)[number]['id']>('all')

const filtered = computed(() => {
  if (filter.value === 'all') return vehicles
  if (filter.value === 'van') return vehicles.filter((v) => v.bodyType === 'van')
  if (filter.value === 'sedan') return vehicles.filter((v) => v.bodyType === 'sedan')
  if (filter.value === 'luxury') return vehicles.filter((v) => v.category === 'luxury')
  if (filter.value === 'electric') return vehicles.filter((v) => v.electric)
  return vehicles
})
</script>

<template>
  <div>
    <div class="filter-row" role="tablist" aria-label="Filter fleet">
      <button
        v-for="f in fleetFilters"
        :key="f.id"
        type="button"
        class="filter-btn"
        :class="{ 'is-active': filter === f.id }"
        role="tab"
        :aria-selected="filter === f.id"
        @click="filter = f.id"
      >
        {{ f.label }}
      </button>
    </div>
    <div class="gallery-grid">
      <article v-for="v in filtered" :key="v.backendId" class="gallery-item reveal">
        <FleetVehicleImage
          class="gallery-item__media"
          :src="v.imagePath"
          :alt="`${v.name} — executive chauffeur vehicle Barcelona`"
        />
        <div class="gallery-item__overlay">
          <p class="gallery-item__title">{{ v.name }}</p>
          <p class="gallery-item__meta">
            {{ v.seats }} seats · from €{{ v.priceEur }}
            <span v-if="v.category === 'luxury'"> · Luxury</span>
            <span v-if="v.electric"> · Electric</span>
          </p>
        </div>
      </article>
    </div>
  </div>
</template>
