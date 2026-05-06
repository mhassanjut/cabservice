import type { BookingDraft, Vehicle } from '~/types/booking'

const STORAGE_KEY = 'stwmovers.booking.v1'

type BookingState = {
  draft: BookingDraft
  vehicle: Vehicle | null
}

const emptyDraft = (): BookingDraft => ({
  pickupLocation: '',
  dropoffLocation: '',
  pickupDate: '',
  pickupTime: '',
})

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    draft: emptyDraft(),
    vehicle: null,
  }),
  getters: {
    isDraftValid: (s) =>
      Boolean(
        s.draft.pickupLocation &&
          s.draft.dropoffLocation &&
          s.draft.pickupDate &&
          s.draft.pickupTime,
      ),
    isReadyForConfirm: (s) =>
      Boolean(
        s.draft.pickupLocation &&
          s.draft.dropoffLocation &&
          s.draft.pickupDate &&
          s.draft.pickupTime &&
          s.vehicle,
      ),
  },
  actions: {
    setDraft(partial: Partial<BookingDraft>) {
      this.draft = { ...this.draft, ...partial }
    },
    setVehicle(vehicle: Vehicle) {
      this.vehicle = vehicle
    },
    clear() {
      this.draft = emptyDraft()
      this.vehicle = null
      if (process.client) localStorage.removeItem(STORAGE_KEY)
    },
    hydrateFromStorage() {
      if (!process.client) return
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      try {
        const parsed = JSON.parse(raw) as Partial<BookingState>
        if (parsed.draft) this.draft = { ...emptyDraft(), ...parsed.draft }
        if (parsed.vehicle) this.vehicle = parsed.vehicle
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
    persistToStorage() {
      if (!process.client) return
      const payload: BookingState = { draft: this.draft, vehicle: this.vehicle }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    },
  },
})

