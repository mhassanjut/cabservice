import type { BookingStatus, PaymentStatus } from '~/types/api'

export type AdminBadgeTone = 'gold' | 'success' | 'danger' | 'muted'

export function bookingStatusTone(status: BookingStatus): AdminBadgeTone {
  if (['CONFIRMED', 'DRIVER_ASSIGNED', 'DRIVER_ACCEPTED', 'IN_PROGRESS'].includes(status)) return 'gold'
  if (status === 'COMPLETED') return 'success'
  if (['CANCELLED', 'REFUNDED'].includes(status)) return 'danger'
  return 'muted'
}

export function paymentStatusTone(status: PaymentStatus): AdminBadgeTone {
  if (status === 'SUCCESS') return 'success'
  if (status === 'FAILED') return 'danger'
  if (status === 'REFUNDED') return 'muted'
  if (status === 'PENDING') return 'gold'
  return 'muted'
}

export function formatStatusLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
