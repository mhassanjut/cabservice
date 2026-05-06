<script setup lang="ts">
import type { Vehicle } from '~/types/booking'

defineProps<{
  vehicle: Vehicle
  selected?: boolean
}>()

defineEmits<{
  (e: 'select', vehicle: Vehicle): void
}>()
</script>

<template>
  <article
    class="card"
    :style="{
      padding: '14px',
      borderColor: selected ? 'rgba(11,95,255,.75)' : 'var(--border)',
      background: selected ? 'rgba(11,95,255,.10)' : 'var(--surface)',
    }"
  >
    <div style="display:flex; gap:12px; align-items:flex-start;">
      <img
        :src="vehicle.imagePath"
        :alt="vehicle.name"
        width="56"
        height="56"
        loading="lazy"
        style="border-radius: 14px; border: 1px solid var(--border); background: rgba(0,0,0,0.18); padding: 8px;"
      />
      <div style="flex:1;">
        <header style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
          <div>
            <h3 style="margin:0; font-size: 16px;">{{ vehicle.name }}</h3>
            <div class="help" style="margin-top: 4px;">
              {{ vehicle.description }}
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-weight: 800; font-size: 18px;">€{{ vehicle.priceEur }}</div>
            <div class="help">starting price</div>
          </div>
        </header>

        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top: 10px;">
          <span class="pill">{{ vehicle.seats }} seats</span>
          <span class="pill">{{ vehicle.bags }} bags</span>
        </div>

        <div style="margin-top: 12px; display:flex; justify-content:flex-end;">
          <button class="btn secondary" type="button" @click="$emit('select', vehicle)">
            Select
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

