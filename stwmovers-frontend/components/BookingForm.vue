<script setup lang="ts">
import type { BookingDraft } from '~/types/booking'
import { routes } from '~/constants/routes'

const booking = useBookingStore()
const router = useRouter()

const draft = computed<BookingDraft>({
  get: () => booking.draft,
  set: (v) => booking.setDraft(v),
})

const pickupQuery = ref(booking.draft.pickupLocation)
const dropoffQuery = ref(booking.draft.dropoffLocation)

const pickup = usePlacesAutocomplete()
const dropoff = usePlacesAutocomplete()

const touched = reactive({
  pickupLocation: false,
  dropoffLocation: false,
  pickupDate: false,
  pickupTime: false,
})

const errors = computed(() => {
  const e: Partial<Record<keyof BookingDraft, string>> = {}
  if (!draft.value.pickupLocation) e.pickupLocation = 'Pickup location is required.'
  if (!draft.value.dropoffLocation) e.dropoffLocation = 'Drop-off location is required.'
  if (!draft.value.pickupDate) e.pickupDate = 'Pickup date is required.'
  if (!draft.value.pickupTime) e.pickupTime = 'Pickup time is required.'
  return e
})

const canSubmit = computed(() => booking.isDraftValid)

const onSubmit = async () => {
  Object.assign(touched, {
    pickupLocation: true,
    dropoffLocation: true,
    pickupDate: true,
    pickupTime: true,
  })
  if (!canSubmit.value) return
  await router.push(routes.cars)
}

watch(pickupQuery, (q) => {
  booking.setDraft({ pickupLocation: q })
  pickup.search(q)
})
watch(dropoffQuery, (q) => {
  booking.setDraft({ dropoffLocation: q })
  dropoff.search(q)
})

const selectPickup = (label: string) => {
  pickupQuery.value = label
  pickup.clear()
}
const selectDropoff = (label: string) => {
  dropoffQuery.value = label
  dropoff.clear()
}
</script>

<template>
  <form class="card" style="padding: 16px;" @submit.prevent="onSubmit">
    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
      <div>
        <h2 style="margin:0; font-size: 18px;">Book a transfer</h2>
        <p class="help" style="margin: 6px 0 0;">
          Barcelona airport transfers, city rides, and Spain-wide cab booking.
        </p>
      </div>
      <span class="pill" aria-label="Spain-only autocomplete">
        Spain-only locations
      </span>
    </div>

    <div class="grid cols-2" style="margin-top: 14px;">
      <div class="grid" style="gap: 12px;">
        <div class="field">
          <label class="label" for="pickupLocation">Pickup Location</label>
          <input
            id="pickupLocation"
            v-model="pickupQuery"
            class="input"
            autocomplete="off"
            required
            placeholder="e.g., Barcelona El Prat Airport (BCN)"
            @blur="touched.pickupLocation = true"
          />
          <div v-if="touched.pickupLocation && errors.pickupLocation" class="err">
            {{ errors.pickupLocation }}
          </div>

          <div v-if="pickup.results.length" class="card" style="margin-top: 8px; padding: 8px;">
            <div style="display:flex; flex-direction:column; gap:6px;">
              <button
                v-for="s in pickup.results"
                :key="s.id"
                type="button"
                class="btn secondary"
                style="justify-content:flex-start; border-radius: 12px; padding: 10px 12px;"
                @click="selectPickup(s.label)"
              >
                {{ s.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label" for="dropoffLocation">Drop-off Location</label>
          <input
            id="dropoffLocation"
            v-model="dropoffQuery"
            class="input"
            autocomplete="off"
            required
            placeholder="e.g., Barcelona City Center"
            @blur="touched.dropoffLocation = true"
          />
          <div v-if="touched.dropoffLocation && errors.dropoffLocation" class="err">
            {{ errors.dropoffLocation }}
          </div>

          <div v-if="dropoff.results.length" class="card" style="margin-top: 8px; padding: 8px;">
            <div style="display:flex; flex-direction:column; gap:6px;">
              <button
                v-for="s in dropoff.results"
                :key="s.id"
                type="button"
                class="btn secondary"
                style="justify-content:flex-start; border-radius: 12px; padding: 10px 12px;"
                @click="selectDropoff(s.label)"
              >
                {{ s.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="grid" style="gap: 12px;">
        <div class="field">
          <label class="label" for="pickupDate">Pickup Date</label>
          <input
            id="pickupDate"
            v-model="draft.pickupDate"
            class="input"
            type="date"
            required
            @blur="touched.pickupDate = true"
          />
          <div v-if="touched.pickupDate && errors.pickupDate" class="err">
            {{ errors.pickupDate }}
          </div>
        </div>

        <div class="field">
          <label class="label" for="pickupTime">Pickup Time</label>
          <input
            id="pickupTime"
            v-model="draft.pickupTime"
            class="input"
            type="time"
            required
            @blur="touched.pickupTime = true"
          />
          <div v-if="touched.pickupTime && errors.pickupTime" class="err">
            {{ errors.pickupTime }}
          </div>
        </div>

        <div class="card" style="padding: 12px; border-radius: 14px;">
          <div class="help" style="margin-bottom: 10px;">
            All fields are required to continue.
          </div>
          <button class="btn" type="submit" :disabled="!canSubmit" style="width: 100%;">
            Book Now
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

