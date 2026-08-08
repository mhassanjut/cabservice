import type { BookingDto, RideType } from '~/types/api'

const rideTypeLabels: Record<RideType, string> = {
  STANDARD: 'Point-to-point transfer',
  IN_CITY: 'In-city transfer',
  CITY_TO_CITY: 'Inter-city transfer',
  TOUR: 'Private tour',
}

const statusLabels: Record<string, string> = {
  PAYMENT_PENDING: 'Payment pending',
  CONFIRMED: 'Confirmed',
  DRIVER_ASSIGNED: 'Driver assigned',
  DRIVER_ACCEPTED: 'Driver en route',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export function formatReceiptDate(iso?: string) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatReceiptShortDate(iso?: string) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatReceiptFare(fare?: number) {
  if (fare == null) return '—'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(fare)
}

export function formatReceiptDistance(km?: number) {
  if (km == null) return '—'
  return `${km.toFixed(1)} km`
}

export function getReceiptRideTypeLabel(rideType: RideType) {
  return rideTypeLabels[rideType] ?? rideType.replace(/_/g, ' ').toLowerCase()
}

export function getReceiptStatusLabel(status: BookingDto['status']) {
  return statusLabels[status] ?? status.replace(/_/g, ' ').toLowerCase()
}

export function getReceiptVehicleLabel(booking: BookingDto) {
  if (booking.tourTitle) return booking.tourTitle
  if (booking.carName) return booking.carName
  if (booking.customRequest) return 'Custom vehicle request'
  return '—'
}

export function getReceiptFilename(reference: string) {
  return `${reference}-Receipt.pdf`
}
