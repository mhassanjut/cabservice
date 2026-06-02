import type { DashboardStats, CarWithFare, BookingDto, Paged } from '~/types/api'
import { api } from '~/services/http/api'

export const adminService = {
  dashboard: () => api<DashboardStats>('/api/v1/admin/dashboard'),
  cars: () => api<CarWithFare[]>('/api/v1/admin/cars'),
  bookings: (page = 0, size = 20) =>
    api<Paged<BookingDto>>(`/api/v1/admin/bookings?page=${page}&size=${size}`),
}
