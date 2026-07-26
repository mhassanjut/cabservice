<script setup lang="ts">
import { EDIT_JOURNEY_FLAG, routes } from '~/constants/routes'

const props = withDefaults(
  defineProps<{
    variant?: 'card' | 'bar'
  }>(),
  { variant: 'card' },
)
import { distanceKm } from '~/utils/geo'
import { resolvePickupCity } from '~/utils/cities'
import { normalizeCarFilters } from '~/utils/carFilters'
import { ridesService } from '~/services/api/rides.service'
import type { BookingDraft } from '~/types/booking'

const booking = useBookingStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()
const maps = useGoogleMaps()
const config = useRuntimeConfig()

/**
 * Trip details are kept here instead of in the store so every visit to this page starts
 * blank, even though the store still restores an in-progress booking from localStorage.
 * The store is written on submit, when the booking funnel actually begins.
 */
const form = reactive<BookingDraft>({
  pickupLocation: '',
  dropoffLocation: '',
  pickupDate: '',
  pickupTime: '',
})

const loading = ref(false)
const showPickupModal = ref(false)
const pickupRef = ref<HTMLInputElement | null>(null)
const dropoffRef = ref<HTMLInputElement | null>(null)
const dateRef = ref<HTMLInputElement | null>(null)
const timeRef = ref<HTMLInputElement | null>(null)

const openPicker = (input: HTMLInputElement | null) => {
  if (!input) return
  input.focus()
  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker()
    } catch {
      /* Browser may block showPicker without a direct user gesture */
    }
  }
}
/** Largest seat count in the fleet is 8, so offer the full range. */
const PASSENGER_CHOICES = [1, 2, 3, 4, 5, 6, 7, 8] as const

const touched = reactive({ pickupLocation: false, dropoffLocation: false, pickupDate: false, pickupTime: false })

const errors = computed(() => {
  const e: Record<string, string> = {}
  if (!form.pickupLocation) e.pickupLocation = 'Pickup is required.'
  else if (!form.pickup?.lat) e.pickupLocation = 'Select a place from suggestions.'
  if (!form.dropoffLocation) e.dropoffLocation = 'Drop-off is required.'
  else if (!form.dropoff?.lat) e.dropoffLocation = 'Select a place from suggestions.'
  if (!form.pickupDate) e.pickupDate = 'Date is required.'
  if (!form.pickupTime) e.pickupTime = 'Time is required.'
  return e
})

const applyPickup = (p: { label: string; lat: number; lng: number; city?: string | null }) => {
  const resolved = resolvePickupCity(p.city, p.lat, p.lng)
  if (!resolved) {
    showPickupModal.value = true
    form.pickupLocation = ''
    form.pickup = undefined
    form.pickupCity = undefined
    return
  }
  form.pickupLocation = p.label
  form.pickup = { lat: p.lat, lng: p.lng }
  form.pickupCity = resolved
  syncDistance()
}

onMounted(async () => {
  // Returning via "Edit Journey" is the only case where the saved trip belongs in the form.
  if (route.query.edit === EDIT_JOURNEY_FLAG) Object.assign(form, booking.draft)
  if (!config.public.googleMapsApiKey) return
  await maps.load()
  if (pickupRef.value) {
    maps.autocomplete(pickupRef.value, (p) => applyPickup(p))
  }
  if (dropoffRef.value) {
    maps.autocomplete(dropoffRef.value, (p) => {
      form.dropoffLocation = p.label
      form.dropoff = { lat: p.lat, lng: p.lng }
      form.destinationCity = p.city ?? undefined
      syncDistance()
    })
  }
})

const syncDistance = () => {
  if (form.pickup && form.dropoff) {
    form.distanceKm = distanceKm(form.pickup, form.dropoff)
  }
}

const barDateLabel = computed(() => {
  if (!form.pickupDate) return 'Select Date'
  const d = new Date(`${form.pickupDate}T00:00:00`)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const barTimeLabel = computed(() => {
  if (!form.pickupTime) return 'Select Time'
  const [hours, minutes] = form.pickupTime.split(':')
  const hour = Number.parseInt(hours, 10)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${String(hour12).padStart(2, '0')}:${minutes} ${suffix}`
})

const onPickupModalChoose = () => {
  showPickupModal.value = false
  nextTick(() => pickupRef.value?.focus())
}

const onSubmit = async () => {
  Object.assign(touched, { pickupLocation: true, dropoffLocation: true, pickupDate: true, pickupTime: true })
  const e = errors.value
  const firstError = e.pickupLocation || e.dropoffLocation || e.pickupDate || e.pickupTime
  if (firstError || !form.distanceKm) {
    // The bar layout has no room for the inline messages the card variant shows.
    if (props.variant === 'bar') {
      toast.show(firstError || 'Pickup and drop-off are the same. Choose a different drop-off.', 'error')
    }
    return
  }
  const resolvedPickup = resolvePickupCity(form.pickupCity, form.pickup?.lat, form.pickup?.lng)
  if (!resolvedPickup) {
    showPickupModal.value = true
    return
  }
  form.pickupCity = resolvedPickup
  if (!form.destinationCity) {
    toast.show('Select drop-off from suggestions so we can detect the destination city.', 'error')
    return
  }
  loading.value = true
  try {
    booking.beginNewTrip({ ...form })
    const res = await ridesService.carsWithFare({
      pickupLat: form.pickup!.lat,
      pickupLng: form.pickup!.lng,
      dropoffLat: form.dropoff!.lat,
      dropoffLng: form.dropoff!.lng,
      distanceKm: form.distanceKm,
      pickupCity: resolvedPickup,
      destinationCity: form.destinationCity,
      filters: normalizeCarFilters(booking.filters),
      page: 0,
      size: 50,
    })
    booking.setCars(res.content)
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
  <form
    id="booking-section"
    class="booking-form"
    :class="props.variant === 'bar' ? 'booking-form--bar' : 'card card--elevated'"
    @submit.prevent="onSubmit"
  >
    <PickupValidationModal
      :show="showPickupModal"
      @close="showPickupModal = false"
      @choose-pickup="onPickupModalChoose"
    />
    <template v-if="props.variant === 'bar'">
      <p v-if="maps.error" class="booking-form__bar-notice err env-warn">{{ maps.error }}</p>
      <p v-else-if="!config.public.googleMapsApiKey" class="booking-form__bar-notice err env-warn">
        Set NUXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env to enable location autocomplete.
      </p>
      <div class="booking-form__bar-grid">
        <div class="booking-form__field">
          <label class="booking-form__bar-label" for="pickup">Pickup</label>
          <input
            id="pickup"
            ref="pickupRef"
            v-model="form.pickupLocation"
            class="booking-form__bar-input"
            placeholder="Select Pickup"
            required
            autocomplete="off"
            @blur="touched.pickupLocation = true"
          />
        </div>
        <div class="booking-form__field">
          <label class="booking-form__bar-label" for="dropoff">Destination</label>
          <input
            id="dropoff"
            ref="dropoffRef"
            v-model="form.dropoffLocation"
            class="booking-form__bar-input"
            placeholder="Select Destination"
            required
            autocomplete="off"
            @blur="touched.dropoffLocation = true"
          />
        </div>
        <div class="booking-form__field">
          <span class="booking-form__bar-label" id="date-label">Date</span>
          <div class="booking-form__bar-control">
            <span class="booking-form__bar-value">{{ barDateLabel }}</span>
            <input
              id="date"
              ref="dateRef"
              v-model="form.pickupDate"
              class="booking-form__bar-native"
              type="date"
              required
              aria-labelledby="date-label"
              @blur="touched.pickupDate = true"
              @click="openPicker(dateRef)"
            />
          </div>
        </div>
        <div class="booking-form__field">
          <span class="booking-form__bar-label" id="time-label">Time</span>
          <div class="booking-form__bar-control">
            <span class="booking-form__bar-value">{{ barTimeLabel }}</span>
            <input
              id="time"
              ref="timeRef"
              v-model="form.pickupTime"
              class="booking-form__bar-native"
              type="time"
              required
              aria-labelledby="time-label"
              @blur="touched.pickupTime = true"
              @click="openPicker(timeRef)"
            />
          </div>
        </div>
        <div class="booking-form__field booking-form__field--passengers">
          <label class="booking-form__bar-label" for="passengers-bar">Passengers</label>
          <select
            id="passengers-bar"
            v-model="form.passengerCount"
            class="booking-form__bar-input booking-form__bar-select"
          >
            <option :value="undefined">Select Passengers</option>
            <option v-for="n in PASSENGER_CHOICES" :key="n" :value="n">
              {{ n }} {{ n === 1 ? 'Passenger' : 'Passengers' }}
            </option>
          </select>
        </div>
        <div class="booking-form__submit-wrap">
          <button class="booking-form__bar-submit" type="submit" :disabled="loading">Get a Quote</button>
        </div>
      </div>
    </template>
    <template v-else>
    <p v-if="maps.error" class="err env-warn">{{ maps.error }}</p>
    <p v-else-if="!config.public.googleMapsApiKey" class="err env-warn">
      Set NUXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env to enable location autocomplete.
    </p>
    <h3 class="font-serif">Get your transfer quote</h3>
    <div class="grid cols-2">
      <div class="field">
        <label class="label" for="pickup-card">Pickup</label>
        <input
          id="pickup-card"
          ref="pickupRef"
          v-model="form.pickupLocation"
          class="input"
          required
          autocomplete="off"
          @blur="touched.pickupLocation = true"
        />
        <p v-if="touched.pickupLocation && errors.pickupLocation" class="err">{{ errors.pickupLocation }}</p>
      </div>
      <div class="field">
        <label class="label" for="dropoff-card">Destination</label>
        <input
          id="dropoff-card"
          ref="dropoffRef"
          v-model="form.dropoffLocation"
          class="input"
          required
          autocomplete="off"
          @blur="touched.dropoffLocation = true"
        />
        <p v-if="touched.dropoffLocation && errors.dropoffLocation" class="err">{{ errors.dropoffLocation }}</p>
      </div>
      <div class="field">
        <span class="label" id="date-label-card">Date</span>
        <label class="input-picker" aria-labelledby="date-label-card" @click="openPicker(dateRef)">
          <input
            id="date-card"
            ref="dateRef"
            v-model="form.pickupDate"
            class="input input--picker"
            type="date"
            required
            aria-labelledby="date-label-card"
            @blur="touched.pickupDate = true"
            @click="openPicker(dateRef)"
          />
          <i class="fa-regular fa-calendar input-picker__icon" aria-hidden="true" />
        </label>
        <p v-if="touched.pickupDate && errors.pickupDate" class="err">{{ errors.pickupDate }}</p>
      </div>
      <div class="field">
        <span class="label" id="time-label-card">Time</span>
        <label class="input-picker" aria-labelledby="time-label-card" @click="openPicker(timeRef)">
          <input
            id="time-card"
            ref="timeRef"
            v-model="form.pickupTime"
            class="input input--picker"
            type="time"
            required
            aria-labelledby="time-label-card"
            @blur="touched.pickupTime = true"
            @click="openPicker(timeRef)"
          />
          <i class="fa-regular fa-clock input-picker__icon" aria-hidden="true" />
        </label>
        <p v-if="touched.pickupTime && errors.pickupTime" class="err">{{ errors.pickupTime }}</p>
      </div>
    </div>
    <p v-if="form.distanceKm" class="help">Distance ≈ {{ form.distanceKm }} km</p>
    <button class="btn btn--solid-gold" type="submit" :disabled="loading">
      Book Now
    </button>
    </template>
    <LoadingOverlay :show="loading" label="Finding premium vehicles…" />
  </form>
</template>

<style>
.booking-form--bar .booking-form__bar-notice {
  position: absolute;
  top: -1.25rem;
  left: 0;
  margin: 0;
  font-size: 0.75rem;
}

.booking-form--bar {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 113px;
  min-height: 113px;
  max-height: 113px;
  background: #fff;
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.1);
  border-radius: 0;
  padding: 32px;
  border: 0;
  overflow: visible;
}

.booking-form--bar .booking-form__bar-grid {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  height: 100%;
}

@media (min-width: 1100px) {
  .booking-form--bar .booking-form__bar-grid {
    flex-direction: row;
    align-items: center;
  }
}

.booking-form--bar .booking-form__field {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
  min-height: 35px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

@media (min-width: 1100px) {
  .booking-form--bar .booking-form__field {
    flex: 1 0 0;
    padding: 0 24px 0 0;
    border-bottom: 0;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }

  .booking-form--bar .booking-form__field:first-child {
    padding-left: 0;
  }

  .booking-form--bar .booking-form__field--passengers {
    padding-right: 0;
    border-right: 0;
  }
}

.booking-form--bar .booking-form__bar-label {
  display: block;
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
}

.booking-form--bar .booking-form__bar-input,
.booking-form--bar .booking-form__bar-select {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  outline: none;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  color: #1a1a1a;
  min-height: 19px;
}

.booking-form--bar .booking-form__bar-input::placeholder {
  color: #1a1a1a;
  opacity: 1;
}

.booking-form--bar .booking-form__bar-input:focus,
.booking-form--bar .booking-form__bar-select:focus {
  outline: none;
  box-shadow: none;
}

.booking-form--bar .booking-form__bar-select {
  appearance: none;
  cursor: pointer;
  background-image: none;
  padding-right: 0;
}

.booking-form--bar .booking-form__bar-control {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 19px;
}

.booking-form--bar .booking-form__bar-value {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}

.booking-form--bar .booking-form__bar-native {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  opacity: 0;
  cursor: pointer;
}

.booking-form--bar .booking-form__submit-wrap {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  padding: 12px 0 0;
}

@media (min-width: 1100px) {
  .booking-form--bar .booking-form__submit-wrap {
    padding: 0;
    margin-left: 0;
  }
}

.booking-form--bar .booking-form__bar-submit {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 49px;
  min-height: 49px;
  margin: 0;
  padding: 16px 32px;
  border: 0;
  border-radius: 100px;
  background: #d8b24c;
  color: #fff;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
}

.booking-form--bar .booking-form__bar-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ─── Responsive booking bar ─── */
/* Tablet / small-laptop: 2-column field grid so the bar isn't a tall stack */
@media (min-width: 768px) and (max-width: 1099px) {
  .booking-form--bar .booking-form__bar-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1.5rem;
    row-gap: 0;
    align-items: stretch;
  }

  .booking-form--bar .booking-form__field {
    padding: 12px 0;
    border-right: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .booking-form--bar .booking-form__field:nth-child(odd) {
    padding-right: 1.5rem;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }

  .booking-form--bar .booking-form__submit-wrap {
    grid-column: 1 / -1;
    padding-top: 1rem;
  }

  .booking-form--bar .booking-form__bar-submit {
    width: 100%;
  }
}

/* Below 1100px the fixed 113px height clips the stacked fields */
@media (max-width: 1099px) {
  .booking-form--bar {
    height: auto;
    min-height: 0;
    max-height: none;
    padding: clamp(1rem, 3vw, 1.5rem);
    border-radius: var(--home-radius-md, 16px);
  }
}

/* Phones: full-width submit and comfortable field spacing */
@media (max-width: 767px) {
  .booking-form--bar .booking-form__bar-submit {
    width: 100%;
  }

  .booking-form--bar .booking-form__field {
    padding: 14px 0;
  }
}
</style>
