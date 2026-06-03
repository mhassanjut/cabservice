export type ApiResponse<T> = { success: boolean; message?: string; data: T; timestamp?: string }

export type RideType = 'IN_CITY' | 'CITY_TO_CITY'
export type BookingStatus =
  | 'CREATED' | 'OTP_PENDING' | 'PAYMENT_PENDING' | 'CONFIRMED' | 'DRIVER_ASSIGNED'
  | 'DRIVER_ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
export type RideStatus =
  | 'ASSIGNED' | 'ACCEPTED' | 'DRIVER_EN_ROUTE' | 'DRIVER_ARRIVED' | 'RIDE_STARTED' | 'RIDE_COMPLETED' | 'CANCELLED'
export type Role = 'CUSTOMER' | 'DRIVER' | 'ADMIN'
export type CarType = 'SEDAN' | 'VAN' | 'SUV'
export type BodyType = 'SEDAN' | 'VAN' | 'SUV'
export type CarCategory = 'STANDARD' | 'LUXURY'

export type CarFilter = {
  passengerCapacity?: number
  carType?: CarType
  bodyType?: BodyType
  category?: CarCategory
  electric?: boolean
  minPrice?: number
  maxPrice?: number
  luxury?: boolean
}

export type CarsWithFareRequest = {
  pickupLat: number
  pickupLng: number
  dropoffLat: number
  dropoffLng: number
  distanceKm: number
  rideType?: RideType
  destinationCity?: string
  filters?: CarFilter
  page?: number
  size?: number
}

export type CarWithFare = {
  id: string
  name: string
  carType: CarType
  bodyType: BodyType
  category: CarCategory
  passengerCapacity: number
  baseFare: number
  calculatedFare: number
  electric: boolean
  available: boolean
  imageUrl: string
  description: string
  rideType: RideType
}

export type Paged<T> = { content: T[]; page: number; size: number; totalElements: number; totalPages: number }

export type BookingDto = {
  id: string
  bookingReference: string
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  carId?: string
  carName?: string
  customRequest: boolean
  status: BookingStatus
  rideType: RideType
  pickupAddress: string
  dropoffAddress: string
  distanceKm: number
  passengerCount?: number
  scheduledAt: string
  calculatedFare?: number
  destinationCity?: string
  driverId?: string
  rideStatus?: RideStatus
}

export type AuthDto = {
  accessToken: string
  tokenType: string
  expiresInMs: number
  userId: string
  email: string
  fullName: string
  role: Role
}

export type PaymentSessionDto = { sessionId: string; checkoutUrl: string; bookingReference: string }

export type DashboardStats = {
  totalRides: number
  totalRevenue: number
  activeDrivers: number
  activeBookings: number
  failedPayments: number
  pendingCustomRequests: number
}
