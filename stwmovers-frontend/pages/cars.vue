<script setup lang="ts">
import { routes } from '~/constants/routes'
import { ridesService } from '~/services/api/rides.service'

usePageSeo({ title: 'Choose your car', path: '/cars' })

const booking = useBookingStore()
const router = useRouter()
const loading = ref(false)

onMounted(async () => {
  if (!booking.isDraftValid) await router.replace(routes.home)
  if (!booking.cars.length) await fetchCars()
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
      filters: booking.filters,
      page: booking.carsPage,
      size: 20,
    })
    booking.setCars(res.content)
  } finally {
    loading.value = false
  }
}

const onFilter = async (f: typeof booking.filters) => {
  booking.setFilters(f)
  await fetchCars()
}

const select = async (id: string) => {
  if (id === 'other') {
    booking.setVehicle(null, true)
  } else {
    const c = booking.cars.find((x) => x.id === id)
    if (!c) return
    booking.setVehicle(booking.toVehicle(c), false)
  }
  booking.persistToStorage()
  await router.push(routes.booking)
}

const vehicleCount = computed(() => booking.cars.filter((c) => c.available).length)

const rideLabel = computed(() => {
  const rt = booking.cars[0]?.rideType ?? booking.draft.rideType
  if (rt === 'CITY_TO_CITY') return 'City to city'
  if (rt === 'IN_CITY') return 'In city'
  return 'Transfer'
})
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
        <li>
          <i class="fa-solid fa-map-pin" aria-hidden="true" />
          {{ rideLabel }}
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
            :selected="booking.vehicle?.id === c.id"
            @select="select(c.id)"
          />

          <article class="vehicle-card-lux card card--elevated custom-car" role="button" tabindex="0" @click="select('other')">
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

          <p v-if="!loading && !booking.cars.length" class="cars-empty">
            <i class="fa-solid fa-car-side" aria-hidden="true" />
            No vehicles match your filters. Try adjusting passengers or price range.
          </p>
        </div>
      </div>
    </div>

    <LoadingOverlay :show="loading" label="Finding premium vehicles…" />
  </section>
</template>
