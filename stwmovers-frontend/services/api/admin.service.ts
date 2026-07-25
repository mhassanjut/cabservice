import type {

  AdminBookingDetailDto,

  AdminBookingQuery,

  AdminCarDto,

  AdminDriverDto,

  AdminSettingsDto,

  AdminTourDto,

  TourCarPricingDto,

  TourPricingBatchRequest,

  BookingDto,

  CityListDto,

  DashboardStats,

  DestinationCityDto,

  Paged,

  PaymentDto,

  PaymentStatus,

  PickupCityDto,

  RoutePricingBatchRequest,

  RoutePricingDto,

} from '~/types/api'

import { api } from '~/services/http/api'



function qs(params: Record<string, string | number | boolean | undefined>) {

  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {

    if (value !== undefined && value !== '') query.set(key, String(value))

  }

  const s = query.toString()

  return s ? `?${s}` : ''

}



export const adminService = {

  dashboard: () => api<DashboardStats>('/api/v1/admin/dashboard', { auth: true }),



  settings: () => api<AdminSettingsDto>('/api/v1/admin/settings', { auth: true }),



  cars: () => api<AdminCarDto[]>('/api/v1/admin/cars', { auth: true }),

  createCar: (body: Partial<AdminCarDto>) =>

    api<AdminCarDto>('/api/v1/admin/cars', { method: 'POST', body, auth: true }),

  updateCar: (id: string, body: Partial<AdminCarDto>) =>

    api<AdminCarDto>(`/api/v1/admin/cars/${id}`, { method: 'PUT', body, auth: true }),

  deleteCar: (id: string) => api<void>(`/api/v1/admin/cars/${id}`, { method: 'DELETE', auth: true }),

  uploadCarImage: async (carId: string, file: File) => {
    const config = useRuntimeConfig()
    const auth = useAuthStore()
    const toast = useToastStore()
    const body = new FormData()
    body.append('file', file)
    try {
      const res = await $fetch<import('~/types/api').ApiResponse<AdminCarDto>>(
        `/api/v1/admin/cars/${carId}/image`,
        {
          baseURL: config.public.apiBaseUrl as string,
          method: 'POST',
          body,
          headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : undefined,
        },
      )
      if (!res.success) throw new Error(res.message ?? 'Upload failed')
      return res.data
    } catch (e: unknown) {
      const err = e as { data?: { message?: string }; message?: string; status?: number; statusCode?: number }
      const msg = err.data?.message ?? err.message
      if (msg) toast.show(msg, 'error')
      else if ((err.status ?? err.statusCode) === 400) toast.show('Unsupported image type.', 'error')
      else toast.show('Could not upload image.', 'error')
      throw e
    }
  },

  uploadCarImageDraft: async (file: File) => {
    const config = useRuntimeConfig()
    const auth = useAuthStore()
    const toast = useToastStore()
    const body = new FormData()
    body.append('file', file)
    try {
      const res = await $fetch<import('~/types/api').ApiResponse<{ imageUrl: string }>>(
        '/api/v1/admin/cars/upload-image',
        {
          baseURL: config.public.apiBaseUrl as string,
          method: 'POST',
          body,
          headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : undefined,
        },
      )
      if (!res.success) throw new Error(res.message ?? 'Upload failed')
      return res.data.imageUrl
    } catch (e: unknown) {
      const err = e as { data?: { message?: string }; message?: string; status?: number; statusCode?: number }
      const msg = err.data?.message ?? err.message
      if (msg) toast.show(msg, 'error')
      else if ((err.status ?? err.statusCode) === 400) toast.show('Unsupported image type.', 'error')
      else toast.show('Could not upload image.', 'error')
      throw e
    }
  },



  tours: () => api<AdminTourDto[]>('/api/v1/admin/tours', { auth: true }),

  createTour: (body: Partial<AdminTourDto>) =>

    api<AdminTourDto>('/api/v1/admin/tours', { method: 'POST', body, auth: true }),

  updateTour: (id: string, body: Partial<AdminTourDto>) =>

    api<AdminTourDto>(`/api/v1/admin/tours/${id}`, { method: 'PUT', body, auth: true }),

  deleteTour: (id: string) => api<void>(`/api/v1/admin/tours/${id}`, { method: 'DELETE', auth: true }),

  tourPricing: (tourId: string) =>
    api<TourCarPricingDto[]>(`/api/v1/admin/tours/${tourId}/pricing`, { auth: true }),

  saveTourPricingBatch: (tourId: string, body: TourPricingBatchRequest) =>
    api<TourCarPricingDto[]>(`/api/v1/admin/tours/${tourId}/pricing/batch`, {
      method: 'POST',
      body,
      auth: true,
    }),

  uploadTourImage: async (tourId: string, file: File) => {
    const config = useRuntimeConfig()
    const auth = useAuthStore()
    const toast = useToastStore()
    const body = new FormData()
    body.append('file', file)
    try {
      const res = await $fetch<import('~/types/api').ApiResponse<AdminTourDto>>(
        `/api/v1/admin/tours/${tourId}/image`,
        {
          baseURL: config.public.apiBaseUrl as string,
          method: 'POST',
          body,
          headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : undefined,
        },
      )
      if (!res.success) throw new Error(res.message ?? 'Upload failed')
      return res.data
    } catch (e: unknown) {
      const err = e as { data?: { message?: string }; message?: string; status?: number; statusCode?: number }
      const msg = err.data?.message ?? err.message
      if (msg) toast.show(msg, 'error')
      else if ((err.status ?? err.statusCode) === 400) toast.show('Unsupported image type.', 'error')
      else toast.show('Could not upload image.', 'error')
      throw e
    }
  },

  uploadTourImageDraft: async (file: File) => {
    const config = useRuntimeConfig()
    const auth = useAuthStore()
    const toast = useToastStore()
    const body = new FormData()
    body.append('file', file)
    try {
      const res = await $fetch<import('~/types/api').ApiResponse<{ imageUrl: string }>>(
        '/api/v1/admin/tours/upload-image',
        {
          baseURL: config.public.apiBaseUrl as string,
          method: 'POST',
          body,
          headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : undefined,
        },
      )
      if (!res.success) throw new Error(res.message ?? 'Upload failed')
      return res.data.imageUrl
    } catch (e: unknown) {
      const err = e as { data?: { message?: string }; message?: string; status?: number; statusCode?: number }
      const msg = err.data?.message ?? err.message
      if (msg) toast.show(msg, 'error')
      else if ((err.status ?? err.statusCode) === 400) toast.show('Unsupported image type.', 'error')
      else toast.show('Could not upload image.', 'error')
      throw e
    }
  },

  drivers: () => api<AdminDriverDto[]>('/api/v1/admin/drivers', { auth: true }),

  driver: (id: string) => api<AdminDriverDto>(`/api/v1/admin/drivers/${id}`, { auth: true }),

  createDriver: (body: {

    email: string

    password: string

    fullName: string

    phone?: string

    licenseNumber: string

  }) => api<AdminDriverDto>('/api/v1/admin/drivers', { method: 'POST', body, auth: true }),

  updateDriver: (

    id: string,

    body: { fullName: string; phone?: string; licenseNumber: string; active?: boolean },

  ) => api<AdminDriverDto>(`/api/v1/admin/drivers/${id}`, { method: 'PUT', body, auth: true }),



  bookings: (query: AdminBookingQuery = {}) =>

    api<Paged<BookingDto>>(`/api/v1/admin/bookings${qs(query)}`, { auth: true, silent: true }),

  booking: (id: string) => api<AdminBookingDetailDto>(`/api/v1/admin/bookings/${id}`, { auth: true }),

  updateBookingStatus: (id: string, status: string) =>

    api<BookingDto>(`/api/v1/admin/bookings/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),

  cancelBooking: (id: string, reason?: string) =>

    api<BookingDto>(`/api/v1/admin/bookings/${id}/cancel`, { method: 'POST', body: { reason }, auth: true }),

  setCustomFare: (id: string, fare: number) =>

    api<BookingDto>(`/api/v1/admin/bookings/${id}/custom-fare`, { method: 'PATCH', body: { fare }, auth: true }),

  assignDriver: (bookingId: string, driverId: string, force = false) =>

    api<BookingDto>(`/api/v1/admin/bookings/${bookingId}/assign-driver`, {

      method: 'POST',

      body: { driverId, force },

      auth: true,

    }),



  payments: (page = 0, size = 20, status?: PaymentStatus) =>

    api<Paged<PaymentDto>>(`/api/v1/admin/payments${qs({ page, size, status })}`, { auth: true }),

  refundPayment: (id: string) =>

    api<PaymentDto>(`/api/v1/admin/payments/${id}/refund`, { method: 'POST', auth: true }),



  cities: () => api<CityListDto>('/api/v1/admin/cities', { auth: true }),

  pickupCities: () => api<PickupCityDto[]>('/api/v1/admin/cities/pickup', { auth: true }),

  allPickupCities: () => api<PickupCityDto[]>('/api/v1/admin/cities/pickup/all', { auth: true }),

  addPickupCity: (name: string) =>

    api<PickupCityDto>('/api/v1/admin/cities/pickup', { method: 'POST', body: { name }, auth: true }),

  updatePickupCity: (id: string, active: boolean) =>

    api<PickupCityDto>(`/api/v1/admin/cities/pickup/${id}?active=${active}`, { method: 'PATCH', auth: true }),

  deletePickupCity: (id: string) =>

    api<void>(`/api/v1/admin/cities/pickup/${id}`, { method: 'DELETE', auth: true }),

  destinationCities: () => api<DestinationCityDto[]>('/api/v1/admin/cities/destinations', { auth: true }),

  addDestinationCity: (name: string) =>

    api<DestinationCityDto>('/api/v1/admin/cities/destinations', { method: 'POST', body: { name }, auth: true }),

  deleteDestinationCity: (id: string) =>

    api<void>(`/api/v1/admin/cities/destinations/${id}`, { method: 'DELETE', auth: true }),



  routePricing: () => api<RoutePricingDto[]>('/api/v1/admin/pricing/routes', { auth: true }),

  routePricingForRoute: (fromCity: string, toCity: string) =>

    api<RoutePricingDto[]>(

      `/api/v1/admin/pricing/routes${qs({ fromCity, toCity })}`,

      { auth: true },

    ),

  saveRoutePricingBatch: (body: RoutePricingBatchRequest) =>

    api<RoutePricingDto[]>('/api/v1/admin/pricing/routes/batch', { method: 'POST', body, auth: true }),

  createRoutePricing: (body: {

    fromCity: string

    toCity: string

    carId: string

    price: number

    active?: boolean

  }) => api<RoutePricingDto>('/api/v1/admin/pricing/routes', { method: 'POST', body, auth: true }),

  updateRoutePricing: (

    id: string,

    body: { fromCity: string; toCity: string; carId: string; price: number; active?: boolean },

  ) => api<RoutePricingDto>(`/api/v1/admin/pricing/routes/${id}`, { method: 'PUT', body, auth: true }),

  deleteRoutePricing: (id: string) =>

    api<void>(`/api/v1/admin/pricing/routes/${id}`, { method: 'DELETE', auth: true }),

}

