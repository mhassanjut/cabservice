import type { BookingDto } from '~/types/api'
import { api } from '~/services/http/api'

export const driverService = {
  rides: () => api<BookingDto[]>('/api/v1/drivers/rides'),
  completed: () => api<BookingDto[]>('/api/v1/drivers/rides/completed'),
  accept: (id: string) => api<BookingDto>(`/api/v1/drivers/rides/${id}/accept`, { method: 'POST' }),
  reject: (id: string) => api<BookingDto>(`/api/v1/drivers/rides/${id}/reject`, { method: 'POST' }),
  status: (id: string, rideStatus: string) =>
    api<BookingDto>(`/api/v1/drivers/rides/${id}/status`, { method: 'PUT', body: { rideStatus } }),
}
