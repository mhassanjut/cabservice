<script setup lang="ts">
import { vehicles } from '~/data/vehicles'

const filter = ref('all')

const filtered = computed(() => {
  if (filter.value === 'all') return vehicles
  return vehicles.filter((v) => v.id === filter.value)
})
</script>

<template>
  <div>
    <div class="filter-row" role="tablist" aria-label="Filter fleet">
      <button
        type="button"
        class="filter-btn"
        :class="{ 'is-active': filter === 'all' }"
        role="tab"
        :aria-selected="filter === 'all'"
        @click="filter = 'all'"
      >
        All
      </button>
      <button
        v-for="v in vehicles"
        :key="v.id"
        type="button"
        class="filter-btn"
        :class="{ 'is-active': filter === v.id }"
        role="tab"
        :aria-selected="filter === v.id"
        @click="filter = v.id"
      >
        {{ v.name.replace(' Sedan', '').replace(' Van', '') }}
      </button>
    </div>
    <div class="gallery-grid">
      <article v-for="v in filtered" :key="v.id" class="gallery-item reveal">
        <img
          class="gallery-item__media"
          :src="v.imagePath"
          :alt="`${v.name} — ${v.description}`"
          width="400"
          height="300"
          loading="lazy"
        />
        <div class="gallery-item__overlay">
          <p class="gallery-item__title">{{ v.name }}</p>
          <p style="margin: 4px 0 0; font-size: 0.8125rem; color: rgba(255,255,255,0.75)">
            From €{{ v.priceEur }}
          </p>
        </div>
      </article>
    </div>
  </div>
</template>
