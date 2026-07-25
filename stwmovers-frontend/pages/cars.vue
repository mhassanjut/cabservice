<script setup lang="ts">
import { editJourneyLocation, routes } from '~/constants/routes'
import { ridesService } from '~/services/api/rides.service'

const SHOW_CUSTOM_REQUEST = false

definePageMeta({ layout: 'booking' })

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
  <div class="vehicle-page">
    <div class="vehicle-page__inner booking-shell__inner">
      <header class="vehicle-page__header">
        <p class="vehicle-page__eyebrow">Book your journey</p>
        <h1 class="vehicle-page__title">Choose Your Vehicle</h1>
        <p class="vehicle-page__lead">
          Select the vehicle that best suits your journey. Compare capacity, luggage space, and
          amenities before continuing.
        </p>
      </header>

      <div class="vehicle-page__main">
        <BookingJourneyCard class="vehicle-page__aside" />

        <div class="vehicle-page__content">
          <CarFilters v-model="booking.filters" @change="onFilter" />

          <section class="vehicle-results">
            <header class="vehicle-results__head">
              <h2 class="vehicle-results__title">Available Vehicles</h2>
              <p class="vehicle-results__count">
                {{ loading ? 'Loading vehicles…' : `Showing ${vehicleCount} premium vehicle${vehicleCount === 1 ? '' : 's'}` }}
              </p>
            </header>

            <div class="vehicle-results__list">
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
                class="vehicle-card"
                role="button"
                tabindex="0"
                @click="select('other')"
              >
                <div class="vehicle-card__body">
                  <div class="vehicle-card__title-group">
                    <h3 class="vehicle-card__name">Custom request</h3>
                    <p class="vehicle-card__category">Bespoke arrangement</p>
                  </div>
                  <p class="vehicle-card__desc">
                    Need another vehicle or special arrangements? Our team will confirm pricing.
                  </p>
                  <div class="vehicle-card__foot">
                    <button class="vehicle-card__cta" type="button" @click.stop="select('other')">
                      Request quote
                    </button>
                  </div>
                </div>
              </article>

              <p v-if="hasFetched && !loading && !booking.cars.length" class="vehicle-results__empty">
                <i class="fa-solid fa-car-side" aria-hidden="true" />
                No vehicles match your filters. Try adjusting passengers or price range.
              </p>
            </div>
          </section>

          <BookingHelpCard />
        </div>
      </div>
    </div>

    <LoadingOverlay :show="loading || selectingId === 'checkout'" label="Opening checkout…" />

    <BookingSelectionBar
      v-if="hasSelection"
      :vehicle-name="booking.otherCar ? 'Custom request' : booking.vehicle?.name ?? ''"
      :fare="booking.otherCar ? null : booking.vehicle?.priceEur"
      :busy="Boolean(selectingId)"
      @continue="goToCheckout"
      @back="router.push(editJourneyLocation)"
    />
  </div>
</template>
