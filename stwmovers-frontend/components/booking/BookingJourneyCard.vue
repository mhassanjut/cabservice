<script setup lang="ts">
import { editJourneyLocation, routes } from '~/constants/routes'
import { journeyIcons } from '~/constants/journeyIcons'
import { PASSENGER_CAPACITY_CHOICES, passengerCapacityLabel } from '~/constants/passengers'
import { formatDistanceKm } from '~/utils/geo'

const emit = defineEmits<{ (e: 'passengers-change', count?: number): void }>()

const booking = useBookingStore()
const isTour = computed(() => booking.isTourBooking)
const editLink = computed(() => (isTour.value ? routes.tours : editJourneyLocation))

const travelDate = computed(() => {
  const raw = booking.draft.pickupDate
  if (!raw) return '—'
  const parsed = new Date(`${raw}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return raw
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
})

const pickupTime = computed(() => {
  const raw = booking.draft.pickupTime
  if (!raw) return '—'
  const [hours, minutes] = raw.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return raw
  const suffix = hours < 12 ? 'AM' : 'PM'
  const display = hours % 12 || 12
  return `${display}:${String(minutes).padStart(2, '0')} ${suffix}`
})

const passengerCount = computed({
  get: () => booking.draft.passengerCount ?? '',
  set: (value: number | string) => {
    const count = value === '' ? undefined : Number(value)
    booking.setDraft({ passengerCount: count })
    emit('passengers-change', count)
  },
})

const notes = computed({
  get: () => booking.draft.notes ?? '',
  set: (value: string) => booking.setDraft({ notes: value }),
})

const notesEl = ref<HTMLTextAreaElement | null>(null)

const syncNotesHeight = () => {
  const el = notesEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

watch(notes, () => nextTick(syncNotesHeight), { flush: 'post' })
onMounted(syncNotesHeight)

const distance = computed(() =>
  booking.draft.distanceKm ? formatDistanceKm(booking.draft.distanceKm) : '—',
)

const estimatedTime = computed(() => {
  const mins = booking.draft.durationMinutes
  if (mins) return `${mins} min`
  const km = booking.draft.distanceKm
  if (!km) return '—'
  return `${Math.max(5, Math.round(km * 1.5))} min`
})
</script>

<template>
  <aside class="booking-journey booking-card">
    <div class="booking-journey__head">
      <h2 class="booking-journey__title">Your Journey</h2>
      <NuxtLink class="booking-journey__edit" :to="editLink">Edit Journey</NuxtLink>
    </div>

    <hr class="booking-card__divider" />

    <ul class="booking-journey__list">
      <template v-if="isTour">
        <li class="booking-journey__item">
          <span class="booking-journey__icon" aria-hidden="true">
            <img :src="journeyIcons.travelDate" alt="" width="20" height="20" />
          </span>
          <div class="booking-journey__text">
            <span class="booking-journey__label">Tour</span>
            <p class="booking-journey__value">{{ booking.draft.tourTitle || '—' }}</p>
          </div>
        </li>
      </template>
      <template v-else>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <img :src="journeyIcons.pickup" alt="" width="20" height="20" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Pickup</span>
          <p class="booking-journey__value">{{ booking.draft.pickupLocation || '—' }}</p>
        </div>
      </li>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <img :src="journeyIcons.dropoff" alt="" width="20" height="20" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Drop-off</span>
          <p class="booking-journey__value">{{ booking.draft.dropoffLocation || '—' }}</p>
        </div>
      </li>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <img :src="journeyIcons.travelDate" alt="" width="20" height="20" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Travel Date</span>
          <p class="booking-journey__value">{{ travelDate }}</p>
        </div>
      </li>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <img :src="journeyIcons.pickupTime" alt="" width="20" height="20" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Pickup Time</span>
          <p class="booking-journey__value">{{ pickupTime }}</p>
        </div>
      </li>
      </template>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <img :src="journeyIcons.passengers" alt="" width="20" height="20" />
        </span>
        <div class="booking-journey__text">
          <label class="booking-journey__label" for="journey-passengers">Passengers</label>
          <select
            id="journey-passengers"
            v-model="passengerCount"
            class="booking-journey__notes booking-journey__select"
          >
            <option value="">Select passengers</option>
            <option v-for="n in PASSENGER_CAPACITY_CHOICES" :key="n" :value="n">
              {{ passengerCapacityLabel(n) }}
            </option>
          </select>
        </div>
      </li>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <img :src="journeyIcons.notes" alt="" width="20" height="20" />
        </span>
        <div class="booking-journey__text">
          <label class="booking-journey__label" for="journey-notes">Notes</label>
          <textarea
            id="journey-notes"
            ref="notesEl"
            v-model="notes"
            class="booking-journey__notes"
            rows="1"
            maxlength="500"
            placeholder="Add a note for your chauffeur"
            @input="syncNotesHeight"
          />
        </div>
      </li>
    </ul>

    <template v-if="!isTour">
    <hr class="booking-card__divider" />

    <div class="booking-journey__metrics">
      <div class="booking-journey__metric">
        <span class="booking-journey__metric-label">Distance</span>
        <p class="booking-journey__metric-value">{{ distance }}</p>
      </div>
      <div class="booking-journey__metric">
        <span class="booking-journey__metric-label">Est. time</span>
        <p class="booking-journey__metric-value">{{ estimatedTime }}</p>
      </div>
    </div>
    </template>
  </aside>
</template>
