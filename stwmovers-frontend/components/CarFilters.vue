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

/** Filters fetch immediately, so always emit the value we just wrote to the model. */
const applyNow = (next: CarFilter) => {
  model.value = next
  emit('change', { ...next })
}

const toggleCarType = (t: CarType) => {
  applyNow({ ...model.value, carType: model.value.carType === t ? undefined : t })
}

const setPassengers = (n: number | null) => {
  applyNow({ ...model.value, passengerCapacity: n ?? undefined })
}

const toggleFlag = (key: 'electric' | 'luxury') => {
  applyNow({ ...model.value, [key]: !model.value[key] || undefined })
}

const clearAll = () => {
  applyNow({})
}

/** Price inputs commit on blur/enter so we do not fetch on every keystroke. */
const applyPrice = () => emit('change', { ...model.value })
</script>

<template>
  <section class="vehicle-filters booking-card">
    <div class="vehicle-filters__head">
      <h2 class="vehicle-filters__title">Refine Your Fleet</h2>
      <button
        v-if="activeCount"
        type="button"
        class="vehicle-filters__clear"
        @click="clearAll"
      >
        Clear all
      </button>
    </div>

    <hr class="booking-card__divider" />

    <div class="vehicle-filters__rows">
      <div class="vehicle-filters__row">
        <span id="filter-passengers-label" class="vehicle-filters__row-label">Passengers:</span>
        <div class="vehicle-filters__chips" role="group" aria-labelledby="filter-passengers-label">
          <button
            v-for="n in passengerOptions"
            :key="n ?? 'any'"
            type="button"
            class="vehicle-filters__chip"
            :class="{ 'is-active': (n == null && !model.passengerCapacity) || model.passengerCapacity === n }"
            @click="setPassengers(n)"
          >
            {{ n == null ? 'Any' : `${n}+` }}
          </button>
        </div>
      </div>

      <div class="vehicle-filters__row">
        <span id="filter-type-label" class="vehicle-filters__row-label">Vehicle Type:</span>
        <div class="vehicle-filters__chips" role="group" aria-labelledby="filter-type-label">
          <button
            v-for="t in carTypes"
            :key="t.value"
            type="button"
            class="vehicle-filters__chip"
            :class="{ 'is-active': model.carType === t.value }"
            @click="toggleCarType(t.value)"
          >
            <i class="fa-solid" :class="t.icon" aria-hidden="true" />
            {{ t.label }}
          </button>
          <button
            type="button"
            class="vehicle-filters__chip"
            :class="{ 'is-active': model.luxury }"
            @click="toggleFlag('luxury')"
          >
            <i class="fa-solid fa-gem" aria-hidden="true" />
            Luxury
          </button>
          <button
            type="button"
            class="vehicle-filters__chip"
            :class="{ 'is-active': model.electric }"
            @click="toggleFlag('electric')"
          >
            <i class="fa-solid fa-bolt" aria-hidden="true" />
            Electric
          </button>
        </div>
      </div>

      <div class="vehicle-filters__row">
        <span class="vehicle-filters__row-label">Price Range:</span>
        <div class="vehicle-filters__prices">
          <label class="vehicle-filters__field">
            <span class="sr-only">Minimum price</span>
            <input
              v-model.number="model.minPrice"
              class="vehicle-filters__input"
              type="number"
              min="0"
              placeholder="Min Range"
              @change="applyPrice"
            />
          </label>
          <label class="vehicle-filters__field">
            <span class="sr-only">Maximum price</span>
            <input
              v-model.number="model.maxPrice"
              class="vehicle-filters__input"
              type="number"
              min="0"
              placeholder="Max Range"
              @change="applyPrice"
            />
          </label>
        </div>
      </div>
    </div>
  </section>
</template>
