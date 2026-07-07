import type { CarFilter, CarWithFare } from '~/types/api'
import {
  VEHICLE_IMAGE_PLACEHOLDER,
  type BookingDraft,
  type GuestDetails,
  type Vehicle,
} from '~/types/booking'

const STORAGE_KEY = 'stwmovers.booking.v2'
const CHECKOUT_COMPLETE_KEY = 'stwmovers.checkout.completedRef'

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
        imagePath: c.imageUrl || VEHICLE_IMAGE_PLACEHOLDER,
        priceEur: Number(c.calculatedFare),
        seats: c.passengerCapacity,
      }
    },
    clearGuestDetails() {
      this.guest = null
      if (import.meta.client) this.persistToStorage()
    },
    beginNewTrip() {
      this.bookingReference = ''
      this.vehicle = null
      this.otherCar = false
      if (import.meta.client) sessionStorage.removeItem(CHECKOUT_COMPLETE_KEY)
    },
    completeCheckout(_reference: string) {
      this.clear()
      if (import.meta.client) {
        sessionStorage.setItem(CHECKOUT_COMPLETE_KEY, _reference)
      }
    },
    isCheckoutComplete() {
      if (!import.meta.client) return false
      return Boolean(sessionStorage.getItem(CHECKOUT_COMPLETE_KEY))
    },
    clear() {
      this.draft = emptyDraft()
      this.vehicle = null
      this.otherCar = false
      this.cars = []
      this.filters = {}
      this.bookingReference = ''
      this.guest = null
      if (import.meta.client) {
        localStorage.removeItem(STORAGE_KEY)
        sessionStorage.removeItem(CHECKOUT_COMPLETE_KEY)
      }
    },
    hydrateFromStorage() {
      if (!import.meta.client) return
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      try {
        const p = JSON.parse(raw) as Partial<BookingState>
        if (p.draft) {
          const merged = { ...emptyDraft(), ...p.draft }
          if (!merged.pickup?.lat && this.draft.pickup?.lat) merged.pickup = this.draft.pickup
          if (!merged.dropoff?.lat && this.draft.dropoff?.lat) merged.dropoff = this.draft.dropoff
          if (!merged.distanceKm && this.draft.distanceKm) merged.distanceKm = this.draft.distanceKm
          this.draft = merged
        }
        if (p.vehicle !== undefined) this.vehicle = p.vehicle
        if (p.otherCar !== undefined) this.otherCar = p.otherCar
        if (p.filters) this.filters = p.filters
        if (p.bookingReference) this.bookingReference = p.bookingReference
        if (p.guest) this.guest = p.guest
        if (p.cars?.length) this.cars = p.cars
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
