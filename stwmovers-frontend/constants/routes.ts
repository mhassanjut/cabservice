export const routes = {
  home: '/',
  cars: '/cars',
  booking: '/booking',
  payment: '/payment',
  confirm: '/confirm',
  bookings: '/bookings',
  login: '/login',
  dashboard: '/dashboard',
  dashboardBookings: '/dashboard/bookings',
  dashboardAccount: '/dashboard/account',
  guestBooking: '/guest/booking',
  services: '/services',
  aboutUs: '/about-us',
  journey: '/journey',
  tours: '/tours',
  blogs: '/blogs',
  faq: '/faq',
  driverLogin: '/driver/login',
  driverHome: '/driver',
  adminLogin: '/admin/login',
  adminHome: '/admin',
  adminRides: '/admin/rides',
  adminTourBookings: '/admin/tour-bookings',
  adminDrivers: '/admin/drivers',
  adminCars: '/admin/cars',
  adminTours: '/admin/tours',
  adminPricing: '/admin/pricing',
  adminCustomRequests: '/admin/custom-requests',
  adminPayments: '/admin/payments',
  adminNotifications: '/admin/notifications',
  adminSettings: '/admin/settings',
} as const

/**
 * The home booking form starts blank on every visit; this flag is the one way back into it
 * with the saved trip prefilled, so "Edit Journey" style links must use it.
 */
export const EDIT_JOURNEY_FLAG = 'journey'

export const editJourneyLocation = {
  path: routes.home,
  query: { edit: EDIT_JOURNEY_FLAG },
}

/** Journey page with pickup and/or destination prefilled in the booking form. */
export function journeyWithRoute(params: { pickup?: string; destination?: string }) {
  const query: Record<string, string> = {}
  if (params.pickup) query.pickup = params.pickup
  if (params.destination) query.destination = params.destination
  return {
    path: routes.journey,
    hash: '#book-journey',
    query,
  }
}

/** Journey page with destination prefilled in the booking form. */
export function journeyWithDestination(destination: string) {
  return journeyWithRoute({ destination })
}

/**
 * Routes that share the primary (home-style) navbar variant.
 * Keep this in sync with the marketing pages that use the `home` layout.
 */
export const PRIMARY_NAV_PATHS = [
  routes.home,
  routes.services,
  routes.aboutUs,
  routes.journey,
  routes.tours,
  routes.blogs,
] as const

/** In-page home anchors — use plain `<a>` so Nuxt does not prefetch invalid hash routes. */
export const homeAnchors = {
  booking: '/#booking-section',
  contact: '/#contact',
  experience: '/#experience',
  journeys: '/#journeys',
  fleet: '/#fleet',
  global: '/#global',
  values: '/#values',
} as const