import type { TourDto } from '~/types/api'
import { api } from '~/services/http/api'

export const toursService = {
  list: () => api<TourDto[]>('/api/v1/tours', { auth: false, silent: true }),
  get: (id: string) => api<TourDto>(`/api/v1/tours/${id}`, { auth: false, silent: true }),
}
