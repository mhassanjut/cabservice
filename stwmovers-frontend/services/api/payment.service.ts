import type { BookingDto, PaymentSessionDto } from '~/types/api'
import { api } from '~/services/http/api'

export type PaymentInfo = {
  bookingReference: string
  amount: number
  currency: string
  status: string
}

export const paymentService = {
  session(bookingReference: string) {
    return api<PaymentSessionDto>('/api/v1/payments/session', {
      method: 'POST',
      body: { bookingReference },
      auth: false,
    })
  },
  completeSession(sessionId: string) {
    return api<BookingDto>('/api/v1/payments/session/complete', {
      method: 'POST',
      body: { sessionId },
      auth: false,
    })
  },
  get(bookingReference: string) {
    return api<PaymentInfo>(`/api/v1/payments/${bookingReference}`, { auth: false })
  },
}
