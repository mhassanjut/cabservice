export const siteConfig = {
  siteUrl: 'https://stwmovers.com',
  apiBaseUrl: 'http://localhost:8080',
  /** Headless WordPress CMS (admin + REST API only; public blogs live on Nuxt /blogs). */
  wordpressUrl: 'https://cms.stwmovers.com',
  /** E.164 format — used for tel: links and structured data. */
  contactPhone: '+34627408522',
  /** Human-readable format shown on contact pages. */
  contactPhoneDisplay: '+34 627 408 522',
  /** Digits only — used for wa.me links. */
  whatsappNumber: '34627408522',
  contactEmail: 'fleetvtc2025@gmail.com',
  /** Full address shown on contact pages, footers, and marketing content. */
  contactAddressDisplay: 'Carrer de Rocafort, 20, Eixample, 08015 Barcelona, Spain',
  /** Structured address fields for JSON-LD PostalAddress. */
  contactAddressPostal: {
    streetAddress: 'Carrer de Rocafort, 20, Eixample',
    addressLocality: 'Barcelona',
    postalCode: '08015',
    addressCountry: 'ES',
  },
  whatsappDefaultMessage: 'Hello STW Movers, I want to book a transfer.',
  toursWhatsappMessage:
    'Hello STW Movers, I would like to build a custom private tour itinerary. Could you help me plan one?',
  externalTourUrl: '/tours',
} as const
