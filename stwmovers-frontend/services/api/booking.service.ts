import type { BookingDto, Paged } from '~/types/api'
import { api } from '~/services/http/api'

export type CreateBookingPayload = {
  carId?: string
  otherCar: boolean
  rideType?: string
  pickupAddress: string
  dropoffAddress: string
  pickupLat: number
  pickupLng: number
  dropoffLat: number
  dropoffLng: number
  distanceKm: number
  passengerCount?: number
  scheduledAt: string
  destinationCity?: string
  guestName?: string
  guestEmail?: string
  guestPhone?: string
}

export const bookingService = {
  create(body: CreateBookingPayload) {
    return api<BookingDto>('/api/v1/bookings', { method: 'POST', body, auth: false })
  },
  get(reference: string) {
    return api<BookingDto>(`/api/v1/bookings/${reference}`, { auth: false })
  },
  mine(page = 0, size = 20) {
    return api<Paged<BookingDto>>(`/api/v1/bookings/me?page=${page}&size=${size}`)
  },
  cancel(reference: string) {
    return api<BookingDto>(`/api/v1/bookings/${reference}/cancel`, { method: 'POST' })
  },
}
