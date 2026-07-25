<script setup lang="ts">
import { editJourneyLocation } from '~/constants/routes'

const booking = useBookingStore()

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

const passengers = computed(() => {
  const count = booking.draft.passengerCount
  if (!count) return null
  return `${count} ${count === 1 ? 'Adult' : 'Adults'}`
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
  booking.draft.distanceKm ? `${Math.round(booking.draft.distanceKm)} km` : '—',
)

/** Display-only estimate at an average city/route speed of ~40 km/h. */
const estimatedTime = computed(() => {
  const km = booking.draft.distanceKm
  if (!km) return '—'
  return `${Math.max(5, Math.round(km * 1.5))} min`
})
</script>

<template>
  <aside class="booking-journey booking-card">
    <div class="booking-journey__head">
      <h2 class="booking-journey__title">Your Journey</h2>
      <NuxtLink class="booking-journey__edit" :to="editJourneyLocation">Edit Journey</NuxtLink>
    </div>

    <hr class="booking-card__divider" />

    <ul class="booking-journey__list">
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <i class="fa-solid fa-location-dot" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Pickup</span>
          <p class="booking-journey__value">{{ booking.draft.pickupLocation || '—' }}</p>
        </div>
      </li>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <i class="fa-solid fa-map-pin" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Drop-off</span>
          <p class="booking-journey__value">{{ booking.draft.dropoffLocation || '—' }}</p>
        </div>
      </li>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <i class="fa-regular fa-calendar" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Travel Date</span>
          <p class="booking-journey__value">{{ travelDate }}</p>
        </div>
      </li>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <i class="fa-regular fa-clock" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Pickup Time</span>
          <p class="booking-journey__value">{{ pickupTime }}</p>
        </div>
      </li>
      <li v-if="passengers" class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <i class="fa-solid fa-user" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Passengers</span>
          <p class="booking-journey__value">{{ passengers }}</p>
        </div>
      </li>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <i class="fa-solid fa-note-sticky" />
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
  </aside>
</template>
