import type { CarWithFare, CarFilter } from '~/types/api'

export type LatLng = { lat: number; lng: number; placeId?: string; label?: string }

export type TourCarsRequest = {
  filters?: CarFilter
  page?: number
  size?: number
}

export type BookingDraft = {
  bookingKind?: 'transfer' | 'tour'
  tourId?: string
  tourTitle?: string
  tourLocation?: string
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string
  pickupTime: string
  pickup?: LatLng
  dropoff?: LatLng
  distanceKm?: number
  /** Driving duration from Google Directions, in minutes. */
  durationMinutes?: number
  pickupCity?: string
  destinationCity?: string
  passengerCount?: number
  /** Optional trip notes from the booking funnel (journey page or vehicle selection). */
  notes?: string
}

export type GuestDetails = { fullName: string; email: string; phone: string }

export type Vehicle = CarWithFare & { imagePath: string; priceEur: number; seats: number; bags?: number }

export const VEHICLE_IMAGE_PLACEHOLDER = '/img/vehicles/vehicle-placeholder.svg'
