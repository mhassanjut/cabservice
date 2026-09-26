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
  locations: '/locations',
  answers: '/answers',
  airportTransfer: '/airport-transfer',
  airportTransferBarcelona: '/airport-transfer-barcelona',
  privateDriverBarcelonaAds: '/private-driver-barcelona',
  barcelonaTaxiAlternative: '/barcelona-taxi-alternative',
  cabServiceBarcelona: '/cab-service-barcelona',
  landingAirportTaxiBarcelona: '/landing/airport-taxi-barcelona',
  landingCabBarcelona: '/landing/cab-barcelona',
  landingPrivateTransferBarcelona: '/landing/private-transfer-barcelona',
  landingTaxiVanBarcelona: '/landing/taxi-van-barcelona',
  landingChauffeurBarcelona: '/landing/chauffeur-barcelona',
  executiveBusinessTravel: '/executive-business-travel',
  chauffeurService: '/chauffeur-service',
  chauffeurService08015: '/chauffeur-service-barcelona-08015',
  barcelonaAirportTransferService: '/services/barcelona-airport-transfer',
  airportTaxiAlternativeService: '/services/barcelona-airport-taxi-alternative',
  cabServiceBarcelonaService: '/services/cab-service-barcelona',
  barcelonaVanTransferService: '/services/barcelona-van-transfer',
  familyAirportTransferService: '/services/family-airport-transfer-barcelona',
  privateDriverBarcelona: '/services/private-driver-barcelona',
  hourlyChauffeurBarcelona: '/services/hourly-chauffeur-barcelona',
  barcelonaAirportChauffeurLocation: '/locations/barcelona-airport-chauffeur-service',
  airportToCityCentreLocation: '/locations/barcelona-airport-to-city-centre-private-transfer',
  airportToCruisePortLocation: '/locations/barcelona-airport-to-cruise-port-private-transfer',
  eixampleChauffeurLocation: '/locations/eixample-chauffeur-service',
  airportTransferCostAnswer: '/answers/barcelona-airport-transfer-cost',
  airportTaxiCostAnswer: '/answers/barcelona-airport-taxi-cost-2026',
  taxiAppOrPrivateTransferAnswer: '/answers/barcelona-taxi-app-or-private-transfer',
  cabVsChauffeurAnswer: '/answers/barcelona-cab-service-vs-chauffeur',
  aboutUs: '/about-us',
  contact: '/contact',
  journey: '/journey',
  tours: '/tours',
  blogs: '/blogs',
  faq: '/faq',
  termsAndConditions: '/terms-and-conditions',
  privacyPolicy: '/privacy-policy',
  cancellationPolicy: '/cancellation-policy',
  cookiePolicy: '/cookie-policy',
  legalNotice: '/legal-notice',
  accessibilityStatement: '/accessibility-statement',
  websiteCredits: '/website-credits',
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
  adminCustomers: '/admin/customers',
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
  routes.locations,
  routes.answers,
  routes.airportTransfer,
  routes.airportTransferBarcelona,
  routes.privateDriverBarcelonaAds,
  routes.barcelonaTaxiAlternative,
  routes.cabServiceBarcelona,
  routes.landingAirportTaxiBarcelona,
  routes.landingCabBarcelona,
  routes.landingPrivateTransferBarcelona,
  routes.landingTaxiVanBarcelona,
  routes.landingChauffeurBarcelona,
  routes.executiveBusinessTravel,
  routes.chauffeurService,
  routes.aboutUs,
  routes.contact,
  routes.journey,
  routes.tours,
  routes.blogs,
  routes.faq,
  routes.termsAndConditions,
  routes.privacyPolicy,
  routes.cancellationPolicy,
  routes.cookiePolicy,
  routes.legalNotice,
  routes.accessibilityStatement,
  routes.websiteCredits,
] as const

/** In-page home anchors — use plain `<a>` so Nuxt does not prefetch invalid hash routes. */
export const homeAnchors = {
  booking: '/#booking-section',
  contact: '/contact',
  experience: '/#experience',
  journeys: '/#journeys',
  fleet: '/#fleet',
  global: '/#global',
  values: '/#values',
} as const
