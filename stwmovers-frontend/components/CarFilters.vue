<script setup lang="ts">
import type { CarFilter, CarType } from '~/types/api'

const emit = defineEmits<{ (e: 'change', f: CarFilter): void }>()
const model = defineModel<CarFilter>({ required: true })

const carTypes: { value: CarType; label: string; icon: string }[] = [
  { value: 'SEDAN', label: 'Sedan', icon: 'fa-car-side' },
  { value: 'VAN', label: 'Van', icon: 'fa-van-shuttle' },
  { value: 'SUV', label: 'SUV', icon: 'fa-truck' },
]

const passengerOptions = [null, 4, 5, 6, 7, 8] as const

const activeCount = computed(() => {
  let n = 0
  const f = model.value
  if (f.passengerCapacity) n++
  if (f.carType) n++
  if (f.minPrice != null && f.minPrice > 0) n++
  if (f.maxPrice != null && f.maxPrice > 0) n++
  if (f.electric) n++
  if (f.luxury) n++
  return n
})

const toggleCarType = (t: CarType) => {
  model.value = { ...model.value, carType: model.value.carType === t ? undefined : t }
}

const setPassengers = (n: number | null) => {
  model.value = { ...model.value, passengerCapacity: n ?? undefined }
}

const toggleFlag = (key: 'electric' | 'luxury') => {
  model.value = { ...model.value, [key]: !model.value[key] || undefined }
}

const clearAll = () => {
  model.value = {}
  emit('change', {})
}

const apply = () => emit('change', { ...model.value })
</script>

<template>
  <aside class="car-filters card card--elevated">
    <header class="car-filters__head">
      <div>
        <h2 class="car-filters__title font-serif">Refine fleet</h2>
        <p class="car-filters__sub">Narrow options to match your trip</p>
      </div>
      <button
        v-if="activeCount"
        type="button"
        class="car-filters__clear"
        @click="clearAll"
      >
        Clear
      </button>
    </header>

    <section class="filter-block filter-block--passengers">
      <h3 class="filter-block__label">
        <i class="fa-solid fa-users" aria-hidden="true" />
        Passengers
      </h3>
      <div class="filter-chips" role="group" aria-label="Passenger count">
        <button
          v-for="n in passengerOptions"
          :key="n ?? 'any'"
          type="button"
          class="filter-chip filter-chip--passengers"
          :class="{ 'is-active': (n == null && !model.passengerCapacity) || model.passengerCapacity === n }"
          @click="setPassengers(n)"
        >
          {{ n == null ? 'Any' : `${n}+` }}
        </button>
      </div>
    </section>

    <section class="filter-block filter-block--type">
      <h3 class="filter-block__label">
        <i class="fa-solid fa-car" aria-hidden="true" />
        Vehicle type
      </h3>
      <div class="filter-chips" role="group" aria-label="Vehicle type">
        <button
          v-for="t in carTypes"
          :key="t.value"
          type="button"
          class="filter-chip filter-chip--type"
          :class="{ 'is-active': model.carType === t.value }"
          @click="toggleCarType(t.value)"
        >
          <i class="fa-solid" :class="t.icon" aria-hidden="true" />
          {{ t.label }}
        </button>
      </div>
    </section>

    <section class="filter-block filter-block--price">
      <h3 class="filter-block__label">
        <i class="fa-solid fa-euro-sign" aria-hidden="true" />
        Price range
      </h3>
      <div class="filter-price-row">
        <label class="filter-field">
          <span class="filter-field__hint">Min</span>
          <input
            v-model.number="model.minPrice"
            class="input filter-input"
            type="number"
            min="0"
            placeholder="0"
          />
        </label>
        <span class="filter-price-sep" aria-hidden="true">–</span>
        <label class="filter-field">
          <span class="filter-field__hint">Max</span>
          <input
            v-model.number="model.maxPrice"
            class="input filter-input"
            type="number"
            min="0"
            placeholder="Any"
          />
        </label>
      </div>
    </section>

    <section class="filter-block filter-block--features">
      <h3 class="filter-block__label">
        <i class="fa-solid fa-sliders" aria-hidden="true" />
        Features
      </h3>
      <div class="filter-chips filter-chips--stack">
        <button
          type="button"
          class="filter-chip filter-chip--electric"
          :class="{ 'is-active': model.electric }"
          @click="toggleFlag('electric')"
        >
          <i class="fa-solid fa-bolt" aria-hidden="true" />
          Electric only
        </button>
        <button
          type="button"
          class="filter-chip filter-chip--luxury"
          :class="{ 'is-active': model.luxury }"
          @click="toggleFlag('luxury')"
        >
          <i class="fa-solid fa-gem" aria-hidden="true" />
          Luxury
        </button>
      </div>
    </section>

    <footer class="car-filters__foot">
      <button class="btn btn--solid-gold car-filters__apply" type="button" @click="apply">
        <i class="fa-solid fa-check" aria-hidden="true" />
        Apply filters
        <span v-if="activeCount" class="car-filters__badge">{{ activeCount }}</span>
      </button>
    </footer>
  </aside>
</template>
