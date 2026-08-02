<script setup lang="ts">
import type { AutocompleteHandle } from '~/composables/useGoogleMaps'
import { routes } from '~/constants/routes'
import { contactBooking, contactChannels } from '~/data/contactContent'
import { ridesService } from '~/services/api/rides.service'
import { areSameBookingPlaces, isPastPickupDate, isPastPickupTimeToday, minPickupDateValue, minPickupTimeValue } from '~/utils/bookingValidation'
import { normalizeCarFilters } from '~/utils/carFilters'
import { resolvePickupCity, type SupportedPickupCity } from '~/utils/cities'
import { routeEndpoint, routeEndpointFromDraft } from '~/utils/routeEndpoint'

const route = useRoute()
const router = useRouter()
const booking = useBookingStore()
const toast = useToastStore()
const maps = useGoogleMaps()
const config = useRuntimeConfig()

const form = reactive({
  pickup: '',
  destination: '',
  date: '',
  time: '',
  notes: '',
})

const loading = ref(false)
const submitAttempted = ref(false)
const pickupRef = ref<HTMLInputElement | null>(null)
const destinationRef = ref<HTMLInputElement | null>(null)
const pickupPlace = ref<{ lat: number; lng: number } | null>(null)
const pickupCity = ref<SupportedPickupCity | undefined>(undefined)
const destinationPlace = ref<{ lat: number; lng: number } | null>(null)
const destinationCity = ref<string | undefined>(undefined)
const showPickupModal = ref(false)
const pickupTouched = ref(false)
const destinationTouched = ref(false)
const dateTouched = ref(false)
const timeTouched = ref(false)
const pickupAutocomplete = ref<AutocompleteHandle | null>(null)
const destinationAutocomplete = ref<AutocompleteHandle | null>(null)
const dateRef = ref<HTMLInputElement | null>(null)
const timeRef = ref<HTMLInputElement | null>(null)
const mapsWarming = ref(false)
let mapsInitPromise: Promise<void> | null = null

const placesPending = computed(
  () =>
    Boolean(config.public.googleMapsApiKey) &&
    mapsWarming.value &&
    !maps.ready.value &&
    !maps.error.value,
)

const minPickupDate = computed(() => minPickupDateValue())
const minPickupTime = computed(() => minPickupTimeValue(form.date))

const attachAutocomplete = () => {
  if (pickupRef.value && !pickupAutocomplete.value) {
    pickupAutocomplete.value = maps.autocomplete(pickupRef.value, applyPickup)
  }
  if (destinationRef.value && !destinationAutocomplete.value) {
    destinationAutocomplete.value = maps.autocomplete(destinationRef.value, (place) => {
      form.destination = place.label
      destinationPlace.value = routeEndpoint(
        { lat: place.lat, lng: place.lng },
        place.label,
        place.placeId,
      )
      destinationCity.value = place.city ?? undefined
    })
  }
}

const ensureMapsReady = () => {
  if (!config.public.googleMapsApiKey) return mapsInitPromise
  if (mapsInitPromise) return mapsInitPromise
  mapsInitPromise = (async () => {
    await maps.load()
    attachAutocomplete()
  })()
  return mapsInitPromise
}

const onPlaceFocus = (field: 'pickup' | 'destination' = 'pickup') => {
  const trigger = () => {
    if (field === 'pickup') pickupAutocomplete.value?.triggerSuggestions()
    else destinationAutocomplete.value?.triggerSuggestions()
  }
  if (!config.public.googleMapsApiKey || maps.ready.value || maps.error.value) {
    trigger()
    return
  }
  mapsWarming.value = true
  void Promise.resolve(ensureMapsReady()).finally(() => {
    mapsWarming.value = !maps.ready.value
    if (maps.ready.value) trigger()
  })
}

watch(
  () => maps.ready.value,
  (ready: boolean) => {
    if (ready) mapsWarming.value = false
  },
)

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

function applyQueryField(field: 'pickup' | 'destination', value: unknown) {
  if (typeof value !== 'string' || !value) return
  form[field] = value
  if (field === 'pickup') {
    pickupPlace.value = null
    pickupCity.value = undefined
  } else {
    destinationPlace.value = null
    destinationCity.value = undefined
  }
}

function applyPickup(place: { label: string; lat: number; lng: number; city?: string | null; placeId?: string }) {
  const resolved = resolvePickupCity(place.city, place.lat, place.lng)
  if (!resolved) {
    showPickupModal.value = true
    form.pickup = ''
    pickupPlace.value = null
    pickupCity.value = undefined
    return
  }
  form.pickup = place.label
  pickupPlace.value = routeEndpoint({ lat: place.lat, lng: place.lng }, place.label, place.placeId)
  pickupCity.value = resolved
  if (form.destination && !destinationPlace.value) {
    destinationAutocomplete.value?.triggerSuggestions()
  }
}

function onPickupModalChoose() {
  showPickupModal.value = false
  nextTick(() => pickupRef.value?.focus())
}

function applyRouteFromQuery() {
  applyQueryField('pickup', route.query.pickup)
  applyQueryField('destination', route.query.destination)
}

function fieldError(
  label: string,
  value: string,
  place: { lat: number; lng: number } | null,
  touched: boolean,
) {
  if (!touched && !submitAttempted.value) return ''
  if (!value) return `${label} is required.`
  if (!place) return 'Select a place from suggestions.'
  if (label === 'Destination' && areSameBookingPlaces(pickupPlace.value, place)) {
    return 'Pickup and destination cannot be the same.'
  }
  return ''
}

const pickupError = computed(() =>
  fieldError('Pickup location', form.pickup, pickupPlace.value, pickupTouched.value),
)

const destinationError = computed(() =>
  fieldError('Destination', form.destination, destinationPlace.value, destinationTouched.value),
)

const dateError = computed(() => {
  if (!dateTouched.value && !submitAttempted.value) return ''
  if (!form.date) return 'Travel date is required.'
  if (isPastPickupDate(form.date)) return 'Travel date cannot be in the past.'
  return ''
})

const timeError = computed(() => {
  if (!timeTouched.value && !submitAttempted.value) return ''
  if (!form.time) return 'Pickup time is required.'
  if (isPastPickupTimeToday(form.date, form.time)) return 'Pickup time cannot be in the past.'
  return ''
})

function promptNextPendingField() {
  nextTick(() => {
    if (form.pickup && !pickupPlace.value) {
      pickupAutocomplete.value?.triggerSuggestions()
      return
    }
    if (form.destination && !destinationPlace.value) {
      destinationAutocomplete.value?.triggerSuggestions()
    }
  })
}

function scrollToBookingForm() {
  if (route.hash === '#book-journey' || route.query.pickup || route.query.destination) {
    document.getElementById('book-journey')?.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  applyRouteFromQuery()
  scrollToBookingForm()
  if (!config.public.googleMapsApiKey) return

  const warm = () => {
    void Promise.resolve(ensureMapsReady()).then(() => promptNextPendingField())
  }

  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
  }
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(warm, { timeout: 800 })
  } else {
    window.setTimeout(warm, 800)
  }
})

watch(
  () => [route.query.pickup, route.query.destination] as const,
  ([pickup, destination]: readonly [unknown, unknown]) => {
    applyQueryField('pickup', pickup)
    applyQueryField('destination', destination)
    promptNextPendingField()
  },
)

const onSubmit = async () => {
  submitAttempted.value = true
  pickupTouched.value = true
  destinationTouched.value = true
  dateTouched.value = true
  timeTouched.value = true
  if (pickupError.value || destinationError.value || dateError.value || timeError.value) {
    promptNextPendingField()
    return
  }

  const resolvedPickup = resolvePickupCity(pickupCity.value, pickupPlace.value?.lat, pickupPlace.value?.lng)
  if (!resolvedPickup) {
    showPickupModal.value = true
    return
  }

  if (!destinationCity.value) {
    toast.show('Select destination from suggestions so we can detect the destination city.', 'error')
    destinationAutocomplete.value?.triggerSuggestions()
    return
  }

  loading.value = true
  try {
    const origin = routeEndpoint(pickupPlace.value!, form.pickup, pickupPlace.value!.placeId)
    const destination = routeEndpoint(destinationPlace.value!, form.destination, destinationPlace.value!.placeId)
    const tripRoute = await maps.resolveDrivingRoute(origin, destination)
    if (!tripRoute.distanceKm) {
      toast.show('Pickup and destination cannot be the same.', 'error')
      return
    }

    booking.beginNewTrip({
      pickupLocation: form.pickup,
      dropoffLocation: form.destination,
      pickupDate: form.date,
      pickupTime: form.time,
      pickup: pickupPlace.value!,
      dropoff: destinationPlace.value!,
      distanceKm: tripRoute.distanceKm,
      durationMinutes: tripRoute.durationMinutes,
      pickupCity: resolvedPickup,
      destinationCity: destinationCity.value,
      notes: form.notes.trim() || undefined,
    })
    const res = await ridesService.carsWithFare({
      pickupLat: pickupPlace.value!.lat,
      pickupLng: pickupPlace.value!.lng,
      dropoffLat: destinationPlace.value!.lat,
      dropoffLng: destinationPlace.value!.lng,
      distanceKm: tripRoute.distanceKm,
      pickupCity: resolvedPickup,
      destinationCity: destinationCity.value,
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
  <section id="book-journey" class="contact-section" aria-labelledby="contact-booking-heading">
    <PickupValidationModal
      :show="showPickupModal"
      @close="showPickupModal = false"
      @choose-pickup="onPickupModalChoose"
    />
    <div class="contact-container contact-booking__grid">
      <div class="contact-booking__info">
        <h2 id="contact-booking-heading" class="contact-heading contact-heading--sm">
          {{ contactBooking.heading }}
        </h2>
        <p class="contact-lead contact-booking__lead">{{ contactBooking.lead }}</p>

        <ul class="contact-channels">
          <li v-for="channel in contactChannels" :key="channel.label" class="contact-channel">
            <i :class="['contact-channel__icon', channel.icon]" aria-hidden="true" />
            <div>
              <p class="contact-channel__label">{{ channel.label }}</p>
              <a
                class="contact-channel__value"
                :href="channel.href"
                v-bind="channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
              >
                {{ channel.value }}
              </a>
            </div>
          </li>
        </ul>
      </div>

      <form class="contact-form-card" novalidate @submit.prevent="onSubmit">
        <p v-if="maps.error" class="err env-warn">{{ maps.error }}</p>
        <p v-else-if="!config.public.googleMapsApiKey" class="err env-warn">
          Set NUXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env to enable location autocomplete.
        </p>

        <div class="contact-form__grid">
          <div class="contact-field" :class="{ 'contact-field--maps-pending': placesPending }">
            <label class="contact-label" for="contact-pickup">
              Pickup Location
              <span v-if="placesPending" class="booking-form__maps-hint">Loading places…</span>
            </label>
            <span id="contact-pickup-hint" class="sr-only">
              Choose a pickup location from the suggestions that appear as you type.
            </span>
            <input
              id="contact-pickup"
              ref="pickupRef"
              v-model="form.pickup"
              class="contact-input"
              type="text"
              autocomplete="off"
              :placeholder="placesPending ? 'Loading places…' : 'e.g. Mandarin Oriental, Barcelona'"
              required
              aria-describedby="contact-pickup-hint"
              :aria-busy="placesPending || undefined"
              :aria-invalid="pickupError ? 'true' : undefined"
              @input="pickupPlace = null; pickupCity = undefined"
              @blur="pickupTouched = true"
              @focus="onPlaceFocus('pickup')"
            />
            <p v-if="pickupError" class="err">{{ pickupError }}</p>
          </div>
          <div class="contact-field" :class="{ 'contact-field--maps-pending': placesPending }">
            <label class="contact-label" for="contact-destination">
              Destination
              <span v-if="placesPending" class="booking-form__maps-hint">Loading places…</span>
            </label>
            <span id="contact-destination-hint" class="sr-only">
              Choose a destination from the suggestions that appear as you type.
            </span>
            <input
              id="contact-destination"
              ref="destinationRef"
              v-model="form.destination"
              class="contact-input"
              type="text"
              autocomplete="off"
              :placeholder="placesPending ? 'Loading places…' : 'e.g. Barcelona-El Prat Airport'"
              required
              aria-describedby="contact-destination-hint"
              :aria-busy="placesPending || undefined"
              :aria-invalid="destinationError ? 'true' : undefined"
              @input="destinationPlace = null; destinationCity = undefined"
              @blur="destinationTouched = true"
              @focus="onPlaceFocus('destination')"
            />
            <p v-if="destinationError" class="err">{{ destinationError }}</p>
          </div>
          <div class="contact-field">
            <label class="contact-label" for="contact-date">Travel Date</label>
            <label class="contact-field__picker" for="contact-date" @click="openPicker(dateRef)">
              <input
                id="contact-date"
                ref="dateRef"
                v-model="form.date"
                class="contact-input contact-input--picker"
                type="date"
                required
                :min="minPickupDate"
                :aria-invalid="dateError ? 'true' : undefined"
                @blur="dateTouched = true"
                @click="openPicker(dateRef)"
              />
            </label>
            <p v-if="dateError" class="err">{{ dateError }}</p>
          </div>
          <div class="contact-field">
            <label class="contact-label" for="contact-time">Pickup Time</label>
            <label class="contact-field__picker" for="contact-time" @click="openPicker(timeRef)">
              <input
                id="contact-time"
                ref="timeRef"
                v-model="form.time"
                class="contact-input contact-input--picker"
                type="time"
                required
                :min="minPickupTime"
                :aria-invalid="timeError ? 'true' : undefined"
                @blur="timeTouched = true"
                @click="openPicker(timeRef)"
              />
            </label>
            <p v-if="timeError" class="err">{{ timeError }}</p>
          </div>
          <div class="contact-field contact-field--full">
            <label class="contact-label" for="contact-notes">Additional Notes or Requests</label>
            <textarea
              id="contact-notes"
              v-model="form.notes"
              class="contact-textarea"
              placeholder="e.g. child seats required, flight number, extra luggage room"
            />
          </div>
        </div>

        <button
          type="submit"
          class="contact-btn contact-btn--gold contact-btn--block contact-form__submit"
          :disabled="loading"
        >
          {{ contactBooking.submitLabel }}
        </button>
      </form>
    </div>
  </section>
</template>
