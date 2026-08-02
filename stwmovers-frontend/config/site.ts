export const siteConfig = {
  siteUrl: 'https://stwmovers.com',
  apiBaseUrl: 'http://localhost:8080',
  /** Headless WordPress CMS (admin + REST API only; public blogs live on Nuxt /blogs). */
  wordpressUrl: 'https://cms.stwmovers.com',
  whatsappNumber: '34632047888',
  contactEmail: 'fleetvtc2025@gmail.com',
  whatsappDefaultMessage: 'Hello STW Movers, I want to book a transfer.',
  toursWhatsappMessage:
    'Hello STW Movers, I would like to build a custom private tour itinerary. Could you help me plan one?',
  externalTourUrl: '/tours',
} as const
