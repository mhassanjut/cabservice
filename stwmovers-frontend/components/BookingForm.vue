<script setup lang="ts">
import { routes } from '~/constants/routes'
import { distanceKm } from '~/utils/geo'
import { ridesService } from '~/services/api/rides.service'

const booking = useBookingStore()
const toast = useToastStore()
const router = useRouter()
const maps = useGoogleMaps()
const config = useRuntimeConfig()

const loading = ref(false)
const pickupRef = ref<HTMLInputElement | null>(null)
const dropoffRef = ref<HTMLInputElement | null>(null)
const pickupQuery = ref(booking.draft.pickupLocation)
const dropoffQuery = ref(booking.draft.dropoffLocation)
const touched = reactive({ pickupLocation: false, dropoffLocation: false, pickupDate: false, pickupTime: false })

const errors = computed(() => {
  const e: Record<string, string> = {}
  if (!booking.draft.pickupLocation) e.pickupLocation = 'Pickup is required.'
  if (!booking.draft.dropoffLocation) e.dropoffLocation = 'Drop-off is required.'
  if (!booking.draft.pickupDate) e.pickupDate = 'Date is required.'
  if (!booking.draft.pickupTime) e.pickupTime = 'Time is required.'
  if (!booking.draft.pickup?.lat) e.pickupLocation = 'Select a place from suggestions.'
  return e
})

onMounted(async () => {
  if (!config.public.googleMapsApiKey) return
  await maps.load()
  if (pickupRef.value) maps.autocomplete(pickupRef.value, (p) => {
    pickupQuery.value = p.label
    booking.setDraft({ pickupLocation: p.label, pickup: { lat: p.lat, lng: p.lng } })
    syncDistance()
  })
  if (dropoffRef.value) maps.autocomplete(dropoffRef.value, (p) => {
    dropoffQuery.value = p.label
    booking.setDraft({ dropoffLocation: p.label, dropoff: { lat: p.lat, lng: p.lng } })
    syncDistance()
  })
})

const syncDistance = () => {
  if (booking.draft.pickup && booking.draft.dropoff) {
    booking.setDraft({ distanceKm: distanceKm(booking.draft.pickup, booking.draft.dropoff) })
  }
}

const onSubmit = async () => {
  Object.assign(touched, { pickupLocation: true, dropoffLocation: true, pickupDate: true, pickupTime: true })
  if (!booking.isDraftValid || Object.keys(errors.value).length) return
  loading.value = true
  try {
    const res = await ridesService.carsWithFare({
      pickupLat: booking.draft.pickup!.lat,
      pickupLng: booking.draft.pickup!.lng,
      dropoffLat: booking.draft.dropoff!.lat,
      dropoffLng: booking.draft.dropoff!.lng,
      distanceKm: booking.draft.distanceKm!,
      filters: booking.filters,
      page: 0,
      size: 50,
    })
    booking.setCars(res.content)
    if (res.content[0]) booking.setDraft({ rideType: res.content[0].rideType })
    booking.persistToStorage()
    await router.push(routes.cars)
  } catch {
    toast.show('Could not load vehicles. Please retry.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="card card--elevated booking-form" @submit.prevent="onSubmit">
    <p v-if="maps.error" class="err env-warn">{{ maps.error }}</p>
    <p v-else-if="!config.public.googleMapsApiKey" class="err env-warn">
      Set NUXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env to enable location autocomplete.
    </p>
    <h3 class="font-serif">Book your transfer</h3>
    <div class="grid cols-2">
      <div class="field">
        <label class="label" for="pickup">Pickup</label>
        <input id="pickup" ref="pickupRef" v-model="pickupQuery" class="input" required @blur="touched.pickupLocation = true" />
        <p v-if="touched.pickupLocation && errors.pickupLocation" class="err">{{ errors.pickupLocation }}</p>
      </div>
      <div class="field">
        <label class="label" for="dropoff">Drop-off</label>
        <input id="dropoff" ref="dropoffRef" v-model="dropoffQuery" class="input" required @blur="touched.dropoffLocation = true" />
        <p v-if="touched.dropoffLocation && errors.dropoffLocation" class="err">{{ errors.dropoffLocation }}</p>
      </div>
      <div class="field">
        <label class="label" for="date">Date</label>
        <input id="date" v-model="booking.draft.pickupDate" class="input" type="date" required @blur="touched.pickupDate = true" />
        <p v-if="touched.pickupDate && errors.pickupDate" class="err">{{ errors.pickupDate }}</p>
      </div>
      <div class="field">
        <label class="label" for="time">Time</label>
        <input id="time" v-model="booking.draft.pickupTime" class="input" type="time" required @blur="touched.pickupTime = true" />
        <p v-if="touched.pickupTime && errors.pickupTime" class="err">{{ errors.pickupTime }}</p>
      </div>
    </div>
    <p v-if="booking.draft.distanceKm" class="help">Distance ≈ {{ booking.draft.distanceKm }} km</p>
    <button class="btn btn--solid-gold" type="submit" :disabled="loading">Book Now</button>
    <LoadingOverlay :show="loading" label="Finding premium vehicles…" />
  </form>
</template>
