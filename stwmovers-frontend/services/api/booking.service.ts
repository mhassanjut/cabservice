import type { BookingDraft, Vehicle } from '~/types/booking'

export type CreateBookingRequest = {
  draft: BookingDraft
  vehicle: Vehicle
}

export type CreateBookingResponse = {
  bookingId: string
  status: 'created'
}

export const bookingService = {
  async create(_req: CreateBookingRequest): Promise<CreateBookingResponse> {
    // Placeholder: Spring Boot endpoint integration
    return { bookingId: 'placeholder', status: 'created' }
  },
}

