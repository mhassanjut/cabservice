<script setup lang="ts">
import { editJourneyLocation, routes } from '~/constants/routes'
import { ridesService } from '~/services/api/rides.service'
import { toursService } from '~/services/api/tours.service'
import { normalizeCarFilters } from '~/utils/carFilters'
import { routeEndpointFromDraft } from '~/utils/routeEndpoint'

const SHOW_CUSTOM_REQUEST = false

definePageMeta({ layout: 'booking' })

usePageSeo({ title: 'Choose your car', path: '/cars' })

const booking = useBookingStore()
const router = useRouter()
const toast = useToastStore()
const maps = useGoogleMaps()
const config = useRuntimeConfig()
const resultsLoading = ref(booking.isDraftValid && !booking.cars.length)
const hasFetched = ref(booking.cars.length > 0)

const SKELETON_COUNT = 3

onMounted(async () => {
  booking.hydrateFromStorage()
  if (!booking.isDraftValid) {
    resultsLoading.value = false
    await router.replace(booking.isTourBooking ? routes.tours : routes.home)
    return
  }
  if (
    booking.draft.passengerCount &&
    booking.filters.passengerCapacity !== booking.draft.passengerCount
  ) {
    booking.setFilters({ ...booking.filters, passengerCapacity: booking.draft.passengerCount })
  }
  if (!booking.isTourBooking) {
    const origin = routeEndpointFromDraft(booking.draft.pickupLocation, booking.draft.pickup)
    const destination = routeEndpointFromDraft(booking.draft.dropoffLocation, booking.draft.dropoff)
    if (origin && destination && config.public.googleMapsApiKey) {
      await maps.load()
      const route = await maps.resolveDrivingRoute(origin, destination)
      const distanceChanged = route.distanceKm !== booking.draft.distanceKm
      const durationChanged = route.durationMinutes !== booking.draft.durationMinutes
      booking.setDraft({
        distanceKm: route.distanceKm,
        durationMinutes: route.durationMinutes,
      })
      if (distanceChanged || durationChanged) booking.setCars([])
    }
  } else {
    booking.setCars([])
  }
  if (!booking.cars.length) await fetchCars()
  else {
    resultsLoading.value = false
    hasFetched.value = true
    clearInvalidSelection()
  }
  if (import.meta.client) window.scrollTo(0, booking.scrollY)
})

const clearInvalidSelection = () => {
  if (!booking.vehicle) return
  const count = booking.draft.passengerCount
  if (count && booking.vehicle.seats < count) {
    booking.setVehicle(null, false)
    return
  }
  if (!booking.cars.some((c) => c.id === booking.vehicle!.id && c.available)) {
    booking.setVehicle(null, false)
  }
}

const syncPassengerFilter = (count?: number) => {
  const next = { ...booking.filters }
  if (count != null && count > 0) {
    next.passengerCapacity = count
  } else {
    delete next.passengerCapacity
  }
  booking.setFilters(next)
}

const onPassengersChange = async (count?: number) => {
  syncPassengerFilter(count)
  clearInvalidSelection()
  await fetchCars()
  booking.persistToStorage()
}

onBeforeRouteLeave(() => {
  if (import.meta.client) booking.scrollY = window.scrollY
  booking.persistToStorage()
})

const fetchCars = async () => {
  resultsLoading.value = true
  try {
    if (booking.isTourBooking && booking.draft.tourId) {
      const res = await toursService.carsWithFare(booking.draft.tourId, {
        filters: normalizeCarFilters(booking.filters),
        page: booking.carsPage,
        size: 20,
      })
      booking.setCars(res.content)
      return
    }
    if (!booking.draft.pickup || !booking.draft.dropoff) return
    const res = await ridesService.carsWithFare({
      pickupLat: booking.draft.pickup.lat,
      pickupLng: booking.draft.pickup.lng,
      dropoffLat: booking.draft.dropoff.lat,
      dropoffLng: booking.draft.dropoff.lng,
      distanceKm: booking.draft.distanceKm!,
      pickupCity: booking.draft.pickupCity!,
      destinationCity: booking.draft.destinationCity,
      filters: normalizeCarFilters(booking.filters),
      page: booking.carsPage,
      size: 20,
    })
    booking.setCars(res.content)
  } catch {
    toast.show(
      booking.isTourBooking
        ? 'Could not load vehicles for this tour. Please try again.'
        : 'Could not load vehicles. Please try again.',
      'error',
    )
    booking.setCars([])
  } finally {
    resultsLoading.value = false
    hasFetched.value = true
  }
}

const onFilter = async (f: typeof booking.filters) => {
  booking.setFilters(f)
  booking.setDraft({
    passengerCount: f.passengerCapacity != null && f.passengerCapacity > 0 ? f.passengerCapacity : undefined,
  })
  clearInvalidSelection()
  await fetchCars()
  booking.persistToStorage()
}

const checkoutBusy = ref(false)

const navigateToCheckout = async () => {
  if (!booking.vehicle && !booking.otherCar) {
    toast.show('Select a vehicle to continue.', 'info')
    return
  }
  if (!booking.isDraftValid) {
    toast.show(
      booking.isTourBooking
        ? 'Your tour details are incomplete. Please start from the tours page.'
        : 'Your trip details are incomplete. Edit your trip from the home page.',
      'error',
    )
    await router.replace(booking.isTourBooking ? routes.tours : routes.home)
    return
  }
  booking.persistToStorage()
  await router.push(routes.booking)
}

const goToCheckout = async () => {
  if (checkoutBusy.value) return
  checkoutBusy.value = true
  try {
    await navigateToCheckout()
  } catch {
    toast.show('Could not open checkout. Please try again.', 'error')
  } finally {
    checkoutBusy.value = false
  }
}

/** Select a vehicle only — stay on /cars; Continue on BookingSelectionBar advances. */
const select = (id: string) => {
  if (checkoutBusy.value) return
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
  booking.persistToStorage()
}

const isSelected = (id: string) => booking.vehicle?.id === id && !booking.otherCar
const hasSelection = computed(() => Boolean(booking.vehicle || booking.otherCar))

const backTarget = computed(() => (booking.isTourBooking ? routes.tours : editJourneyLocation))
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
        <BookingJourneyCard class="vehicle-page__aside" @passengers-change="onPassengersChange" />

        <div class="vehicle-page__content">
          <CarFilters v-model="booking.filters" @change="onFilter" />

          <section class="vehicle-results">
            <header class="vehicle-results__head">
              <h2 class="vehicle-results__title">Available Vehicles</h2>
              <p class="vehicle-results__count">
                {{
                  resultsLoading
                    ? 'Updating vehicles…'
                    : `Showing ${vehicleCount} premium vehicle${vehicleCount === 1 ? '' : 's'}`
                }}
              </p>
            </header>

            <div
              class="vehicle-results__list"
              :class="{ 'vehicle-results__list--loading': resultsLoading }"
              :aria-busy="resultsLoading"
            >
              <template v-if="resultsLoading">
                <VehicleCardSkeleton v-for="n in SKELETON_COUNT" :key="`skeleton-${n}`" />
              </template>
              <template v-else>
              <VehicleCard
                v-for="c in booking.cars"
                :key="c.id"
                :vehicle="booking.toVehicle(c)"
                :unavailable="!c.available"
                :selected="isSelected(c.id)"
                :continuing="checkoutBusy"
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

              <p v-if="hasFetched && !resultsLoading && !booking.cars.length" class="vehicle-results__empty">
                <i class="fa-solid fa-car-side" aria-hidden="true" />
                No vehicles match your filters. Try adjusting passengers or price range.
              </p>
              </template>
            </div>
          </section>

          <BookingHelpCard />
        </div>
      </div>
    </div>

    <LoadingOverlay :show="checkoutBusy" label="Opening checkout…" />

    <BookingSelectionBar
      v-if="hasSelection"
      :vehicle-name="booking.otherCar ? 'Custom request' : booking.vehicle?.name ?? ''"
      :fare="booking.otherCar ? null : booking.vehicle?.priceEur"
      :busy="checkoutBusy"
      @continue="goToCheckout"
      @back="router.push(backTarget)"
    />
  </div>
</template>
