export type ApiResponse<T> = { success: boolean; message?: string; data: T; timestamp?: string }

export type RideType = 'STANDARD' | 'IN_CITY' | 'CITY_TO_CITY'
export type BookingStatus =
  | 'CREATED' | 'OTP_PENDING' | 'PAYMENT_PENDING' | 'CONFIRMED' | 'DRIVER_ASSIGNED'
  | 'DRIVER_ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
export type RideStatus =
  | 'ASSIGNED' | 'ACCEPTED' | 'DRIVER_EN_ROUTE' | 'DRIVER_ARRIVED' | 'RIDE_STARTED' | 'RIDE_COMPLETED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
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
  pickupCity: string
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
  createdAt?: string
  updatedAt?: string
}

export type AuthDto = {
  accessToken: string
  tokenType: string
  expiresInMs: number
  userId: string
  email: string
  fullName: string
  role: Role
  profilePictureUrl?: string
}

export type UserProfileDto = {
  userId: string
  email: string
  fullName: string
  phone?: string
  role: Role
  googleId?: string
  profilePictureUrl?: string
  createdAt: string
}

export type CustomerStatsDto = {
  totalRides: number
  totalSpent: number
  upcomingBooking?: BookingDto | null
  activeRide?: BookingDto | null
}

export type PaymentSessionDto = { sessionId: string; checkoutUrl: string; bookingReference: string }

export type DashboardStats = {
  totalRides: number
  activeRides: number
  totalRevenue: number
  revenueToday: number
  revenueThisMonth: number
  activeDrivers: number
  activeBookings: number
  failedPayments: number
  pendingCustomRequests: number
  recentBookings: BookingDto[]
}

export type AdminCarDto = {
  id: string
  name: string
  carType: CarType
  bodyType: BodyType
  category: CarCategory
  passengerCapacity: number
  baseFare: number
  electric: boolean
  available: boolean
  active: boolean
  supportsInCity: boolean
  supportsCityToCity: boolean
  imageUrl?: string
  description?: string
  displayPriority: number
  createdAt?: string
  updatedAt?: string
}

export type TourItineraryItemDto = {
  dayNumber: number
  time?: string
  activity: string
}

export type TourCarPricingDto = {
  id: string
  tourId: string
  carId: string
  carName: string
  price: number
  active: boolean
}

export type TourPricingBatchRequest = {
  active?: boolean
  carPrices: { carId: string; price: number }[]
}

/** Public-facing tour shape returned by `/api/v1/tours` — no pricing-admin fields. */
export type TourDto = {
  id: string
  title: string
  location?: string
  durationLabel?: string
  durationHours?: number | null
  guestMin?: number | null
  guestMax?: number | null
  category?: string
  shortDescription?: string
  aboutDescription?: string
  startingPrice?: number | null
  imageUrl?: string
  active: boolean
  displayPriority: number
  highlights: string[]
  included: string[]
  excluded: string[]
  itinerary: TourItineraryItemDto[]
}

export type AdminTourDto = {
  id: string
  title: string
  location?: string
  durationLabel?: string
  durationHours?: number | null
  guestMin?: number | null
  guestMax?: number | null
  category?: string
  shortDescription?: string
  aboutDescription?: string
  startingPrice?: number | null
  carPrices?: TourCarPricingDto[]
  imageUrl?: string
  active: boolean
  displayPriority: number
  highlights: string[]
  included: string[]
  excluded: string[]
  itinerary: TourItineraryItemDto[]
  createdAt?: string
  updatedAt?: string
}

export type AdminDriverDto = {
  id: string
  userId: string
  email: string
  fullName: string
  phone?: string
  licenseNumber: string
  active: boolean
  activeRidesCount?: number
  onRide?: boolean
  createdAt?: string
}

export type RoutePricingDto = {
  id: string
  fromCity: string
  toCity: string
  carId: string
  carName: string
  price: number
  active: boolean
}

export type RoutePricingBatchRequest = {
  fromCity: string
  toCity: string
  active?: boolean
  carPrices: { carId: string; price: number }[]
}

export type PickupCityDto = {
  id: string
  name: string
  active: boolean
}

export type DestinationCityDto = {
  id: string
  name: string
  active: boolean
}

export type PaymentDto = {
  id: string
  bookingId: string
  bookingReference: string
  amount: number
  currency: string
  status: PaymentStatus
  stripeSessionId?: string
  stripePaymentIntentId?: string
  createdAt?: string
}

export type AdminBookingDetailDto = {
  booking: BookingDto
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  driverName?: string
  paymentStatus?: PaymentStatus
  stripeSessionId?: string
  stripePaymentIntentId?: string
  paymentAmount?: number
  allowedNextStatuses: string[]
}

export type AdminSettingsDto = {
  inCityBaseKm: number
  inCityExtraEurPerKm: number
  adminEmail: string
}

export type CityListDto = { cities: string[] }

export type AdminBookingQuery = {
  page?: number
  size?: number
  status?: BookingStatus
  rideType?: RideType
  customRequest?: boolean
  search?: string
  fromDate?: string
  toDate?: string
  sortBy?: 'createdAt' | 'scheduledAt' | 'fare' | 'status' | 'reference'
  sortDir?: 'asc' | 'desc'
}
