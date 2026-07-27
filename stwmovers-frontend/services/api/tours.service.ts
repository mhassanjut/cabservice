import type { CarWithFare, Paged, TourDto } from '~/types/api'
import type { TourCarsRequest } from '~/types/booking'
import { api } from '~/services/http/api'

export const toursService = {
  list: () => api<TourDto[]>('/api/v1/tours', { auth: false, silent: true }),
  get: (id: string) => api<TourDto>(`/api/v1/tours/${id}`, { auth: false, silent: true }),
  carsWithFare: (tourId: string, req: TourCarsRequest = {}) =>
    api<Paged<CarWithFare>>(`/api/v1/tours/${tourId}/cars`, { method: 'POST', body: req, auth: false }),
}
