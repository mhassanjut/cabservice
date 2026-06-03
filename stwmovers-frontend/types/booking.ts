import type { CarWithFare, CarFilter, RideType } from '~/types/api'

export type LatLng = { lat: number; lng: number }

export type BookingDraft = {
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string
  pickupTime: string
  pickup?: LatLng
  dropoff?: LatLng
  distanceKm?: number
  rideType?: RideType
  destinationCity?: string
}

export type GuestDetails = { fullName: string; email: string; phone: string }

export type Vehicle = CarWithFare & { imagePath: string; priceEur: number; seats: number; bags?: number }
