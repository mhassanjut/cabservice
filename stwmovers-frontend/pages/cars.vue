<script setup lang="ts">
import { routes } from '~/constants/routes'
import { ridesService } from '~/services/api/rides.service'

const SHOW_CUSTOM_REQUEST = false

usePageSeo({ title: 'Choose your car', path: '/cars' })

const booking = useBookingStore()
const router = useRouter()
const toast = useToastStore()
const loading = ref(booking.isDraftValid && !booking.cars.length)
const hasFetched = ref(booking.cars.length > 0)

onMounted(async () => {
  if (!booking.isDraftValid) {
    loading.value = false
    await router.replace(routes.home)
    return
  }
  if (!booking.cars.length) await fetchCars()
  else {
    loading.value = false
    hasFetched.value = true
  }
  if (import.meta.client) window.scrollTo(0, booking.scrollY)
})

onBeforeRouteLeave(() => {
  if (import.meta.client) booking.scrollY = window.scrollY
  booking.persistToStorage()
})

const fetchCars = async () => {
  if (!booking.draft.pickup || !booking.draft.dropoff) return
  loading.value = true
  try {
    const res = await ridesService.carsWithFare({
      pickupLat: booking.draft.pickup.lat,
      pickupLng: booking.draft.pickup.lng,
      dropoffLat: booking.draft.dropoff.lat,
      dropoffLng: booking.draft.dropoff.lng,
      distanceKm: booking.draft.distanceKm!,
      pickupCity: booking.draft.pickupCity!,
      destinationCity: booking.draft.destinationCity,
      filters: booking.filters,
      page: booking.carsPage,
      size: 20,
    })
    booking.setCars(res.content)
  } finally {
    loading.value = false
    hasFetched.value = true
  }
}

const onFilter = async (f: typeof booking.filters) => {
  booking.setFilters(f)
  await fetchCars()
}

const selectingId = ref<string | null>(null)

const navigateToCheckout = async () => {
  if (!booking.vehicle && !booking.otherCar) {
    toast.show('Select a vehicle to continue.', 'info')
    return
  }
  if (!booking.isDraftValid) {
    toast.show('Your trip details are incomplete. Edit your trip from the home page.', 'error')
    await router.replace(routes.home)
    return
  }
  booking.persistToStorage()
  await router.push(routes.booking)
}

const goToCheckout = async () => {
  if (selectingId.value) return
  selectingId.value = 'checkout'
  try {
    await navigateToCheckout()
  } catch {
    toast.show('Could not open checkout. Please try again.', 'error')
  } finally {
    selectingId.value = null
  }
}

const select = async (id: string) => {
  if (selectingId.value) return
  selectingId.value = id
  try {
    if (id === 'other') {
      booking.setVehicle(null, true)
    } else {
      const c = booking.cars.find((x) => x.id === id)
      if (!c && booking.vehicle?.id !== id) {
        toast.show('Could not select that vehicle. Please try again.', 'error')
        return
      }
      if (c) {
        booking.setVehicle(booking.toVehicle(c), false)
      }
    }
    await navigateToCheckout()
  } catch {
    toast.show('Could not open checkout. Please try again.', 'error')
  } finally {
    selectingId.value = null
  }
}

const isSelected = (id: string) => booking.vehicle?.id === id && !booking.otherCar
const hasSelection = computed(() => Boolean(booking.vehicle || booking.otherCar))

const vehicleCount = computed(() => booking.cars.filter((c) => c.available).length)
</script>

<template>
  <section class="cars-page">
    <SectionHeading
      title-level="h1"
      eyebrow="Fleet"
      title="Select your vehicle"
      lead="Compare premium vehicles for your route. Use filters to find the right fit."
    />

    <div class="cars-trip card card--elevated reveal">
      <div class="cars-trip__route">
        <div class="cars-trip__point">
          <span class="cars-trip__dot cars-trip__dot--pickup" aria-hidden="true" />
          <div>
            <span class="cars-trip__label">Pickup</span>
            <p class="cars-trip__addr">{{ booking.draft.pickupLocation }}</p>
          </div>
        </div>
        <div class="cars-trip__point">
          <span class="cars-trip__dot cars-trip__dot--dropoff" aria-hidden="true" />
          <div>
            <span class="cars-trip__label">Drop-off</span>
            <p class="cars-trip__addr">{{ booking.draft.dropoffLocation }}</p>
          </div>
        </div>
      </div>
      <ul class="cars-trip__stats">
        <li v-if="booking.draft.pickupDate">
          <i class="fa-regular fa-calendar" aria-hidden="true" />
          {{ booking.draft.pickupDate }} · {{ booking.draft.pickupTime }}
        </li>
        <li v-if="booking.draft.distanceKm">
          <i class="fa-solid fa-route" aria-hidden="true" />
          ≈ {{ booking.draft.distanceKm }} km
        </li>
      </ul>
    </div>

    <div class="cars-layout">
      <CarFilters v-model="booking.filters" @change="onFilter" />

      <div class="cars-results">
        <header class="cars-results__head">
          <div>
            <h2 class="cars-results__title font-serif">
              {{ loading ? 'Loading vehicles…' : `${vehicleCount} vehicle${vehicleCount === 1 ? '' : 's'} available` }}
            </h2>
            <p class="cars-results__sub">Tap a card to continue your booking</p>
          </div>
          <NuxtLink :to="routes.home" class="cars-results__edit">
            <i class="fa-solid fa-pen" aria-hidden="true" />
            Edit trip
          </NuxtLink>
        </header>

        <div class="cars-results__list">
          <VehicleCard
            v-for="c in booking.cars"
            :key="c.id"
            :vehicle="booking.toVehicle(c)"
            :unavailable="!c.available"
            :selected="isSelected(c.id)"
            :continuing="selectingId === c.id || selectingId === 'checkout'"
            @select="select(c.id)"
          />

          <article
            v-show="SHOW_CUSTOM_REQUEST"
            class="vehicle-card-lux card card--elevated custom-car"
            role="button"
            tabindex="0"
            @click="select('other')"
          >
            <div class="custom-car__icon" aria-hidden="true">
              <i class="fa-solid fa-comments" />
            </div>
            <div class="custom-car__body">
              <h3 class="font-serif">Custom request</h3>
              <p>Need another vehicle or special arrangements? Our team will confirm pricing.</p>
              <span class="custom-car__link">
                Request quote
                <i class="fa-solid fa-arrow-right" aria-hidden="true" />
              </span>
            </div>
          </article>

          <p v-if="hasFetched && !loading && !booking.cars.length" class="cars-empty">
            <i class="fa-solid fa-car-side" aria-hidden="true" />
            No vehicles match your filters. Try adjusting passengers or price range.
          </p>
        </div>
      </div>
    </div>

    <LoadingOverlay :show="loading || selectingId === 'checkout'" label="Opening checkout…" />

    <div v-if="hasSelection" class="cars-continue card card--elevated">
      <p>
        <template v-if="booking.otherCar">Custom request selected</template>
        <template v-else>{{ booking.vehicle?.name }} selected</template>
      </p>
      <button class="btn btn--solid-gold" type="button" :disabled="Boolean(selectingId)" @click="goToCheckout">
        Continue to checkout
        <i class="fa-solid fa-arrow-right" aria-hidden="true" />
      </button>
    </div>
  </section>
</template>
