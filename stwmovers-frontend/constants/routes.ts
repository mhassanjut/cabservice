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
  faq: '/faq',
  driverLogin: '/driver/login',
  driverHome: '/driver',
  adminLogin: '/admin/login',
  adminHome: '/admin',
  adminRides: '/admin/rides',
  adminDrivers: '/admin/drivers',
  adminCars: '/admin/cars',
  adminPricing: '/admin/pricing',
  adminCustomRequests: '/admin/custom-requests',
  adminPayments: '/admin/payments',
  adminNotifications: '/admin/notifications',
  adminSettings: '/admin/settings',
} as const

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