import type { BookingDraft, GuestDetails, Vehicle } from '~/types/booking'
import type { CarFilter, CarWithFare } from '~/types/api'

const STORAGE_KEY = 'stwmovers.booking.v2'

type BookingState = {
  draft: BookingDraft
  vehicle: Vehicle | null
  otherCar: boolean
  cars: CarWithFare[]
  filters: CarFilter
  carsPage: number
  bookingReference: string
  guest: GuestDetails | null
  scrollY: number
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
    otherCar: false,
    cars: [],
    filters: {},
    carsPage: 0,
    bookingReference: '',
    guest: null,
    scrollY: 0,
  }),
  getters: {
    isDraftValid: (s) =>
      Boolean(
        s.draft.pickupLocation &&
          s.draft.dropoffLocation &&
          s.draft.pickupDate &&
          s.draft.pickupTime &&
          s.draft.pickup &&
          s.draft.dropoff &&
          s.draft.distanceKm,
      ),
    scheduledAtIso: (s) => {
      if (!s.draft.pickupDate || !s.draft.pickupTime) return ''
      return new Date(`${s.draft.pickupDate}T${s.draft.pickupTime}:00`).toISOString()
    },
  },
  actions: {
    setDraft(p: Partial<BookingDraft>) {
      this.draft = { ...this.draft, ...p }
    },
    setVehicle(v: Vehicle | null, other = false) {
      this.vehicle = v
      this.otherCar = other
    },
    setCars(c: CarWithFare[]) {
      this.cars = c
    },
    setFilters(f: CarFilter) {
      this.filters = f
    },
    toVehicle(c: CarWithFare): Vehicle {
      return {
        ...c,
        imagePath: c.imageUrl || '/img/vehicles/comfort.svg',
        priceEur: Number(c.calculatedFare),
        seats: c.passengerCapacity,
      }
    },
    clear() {
      this.draft = emptyDraft()
      this.vehicle = null
      this.otherCar = false
      this.cars = []
      this.filters = {}
      this.bookingReference = ''
      this.guest = null
      if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
    },
    hydrateFromStorage() {
      if (!import.meta.client) return
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      try {
        const p = JSON.parse(raw) as Partial<BookingState>
        if (p.draft) this.draft = { ...emptyDraft(), ...p.draft }
        if (p.vehicle) this.vehicle = p.vehicle
        if (p.otherCar) this.otherCar = p.otherCar
        if (p.filters) this.filters = p.filters
        if (p.bookingReference) this.bookingReference = p.bookingReference
        if (p.guest) this.guest = p.guest
        if (p.cars) this.cars = p.cars
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
    persistToStorage() {
      if (!import.meta.client) return
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          draft: this.draft,
          vehicle: this.vehicle,
          otherCar: this.otherCar,
          filters: this.filters,
          bookingReference: this.bookingReference,
          guest: this.guest,
          cars: this.cars,
        }),
      )
    },
  },
})
