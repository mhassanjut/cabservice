import type { CarWithFare, CarFilter } from '~/types/api'

export type LatLng = { lat: number; lng: number }

export type BookingDraft = {
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string
  pickupTime: string
  pickup?: LatLng
  dropoff?: LatLng
  distanceKm?: number
  pickupCity?: string
  destinationCity?: string
  passengerCount?: number
  /** Client-side only: the bookings API has no notes field yet, so this is not submitted. */
  notes?: string
}

export type GuestDetails = { fullName: string; email: string; phone: string }

export type Vehicle = CarWithFare & { imagePath: string; priceEur: number; seats: number; bags?: number }

export const VEHICLE_IMAGE_PLACEHOLDER = '/img/vehicles/vehicle-placeholder.svg'
