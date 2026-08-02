import type { ServiceSplitSection } from '~/data/servicesContent'

export type ServiceLandingPage = {
  id: string
  path: string
  seo: {
    title: string
    description: string
  }
  hero: {
    eyebrow: string
    title: string
    body: string
    image: string
  }
  section: ServiceSplitSection
  schema: Record<string, unknown>
}

export const airportTransferSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': 'https://stwmovers.com/airport-transfer#service',
  name: 'Barcelona Airport Transfer',
  alternateName: 'Private Airport Transfer Barcelona',
  description:
    'STW Movers provides reliable private airport transfers to and from Barcelona Airport (BCN). Our professional chauffeur service offers fixed pricing, flight monitoring, meet and greet, and 24/7 availability for individuals, families, and business travelers.',
  serviceType: 'Airport Transfer',
  provider: {
    '@type': 'TravelAgency',
    '@id': 'https://stwmovers.com/#organization',
    name: 'STW Movers',
    url: 'https://stwmovers.com/',
  },
  url: 'https://stwmovers.com/airport-transfer',
  image: 'https://stwmovers.com/_nuxt/Logo.CAzUtKks.svg',
  areaServed: [
    { '@type': 'City', name: 'Barcelona' },
    { '@type': 'City', name: 'Girona' },
    { '@type': 'City', name: 'Tarragona' },
  ],
  availableLanguage: ['English', 'Spanish'],
  offers: {
    '@type': 'Offer',
    url: 'https://www.stwmovers.com/journey',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Airport Transfer Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Barcelona Airport Transfer' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Private Airport Transfer' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Airport Shuttle' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Meet and Greet Service' } },
    ],
  },
  keywords: [
    'Barcelona Airport Transfer',
    'Barcelona Airport Taxi',
    'Private Airport Transfer Barcelona',
    'Airport Shuttle Barcelona',
    'Taxi from Barcelona Airport',
    'BCN Airport Transfer',
  ],
} as const

export const executiveBusinessTravelSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': 'https://stwmovers.com/executive-business-travel#service',
  name: 'Executive Business Travel',
  alternateName: 'Corporate Chauffeur Service Barcelona',
  description:
    'STW Movers provides premium executive business travel and corporate chauffeur services in Barcelona, Girona, and Tarragona. Our professional chauffeurs ensure punctual, comfortable, and reliable transportation for business meetings, conferences, corporate events, roadshows, and VIP clients.',
  serviceType: 'Executive Business Travel',
  provider: {
    '@type': 'TravelAgency',
    '@id': 'https://stwmovers.com/#organization',
    name: 'STW Movers',
    url: 'https://stwmovers.com/',
  },
  url: 'https://stwmovers.com/executive-business-travel',
  image: 'https://stwmovers.com/_nuxt/Logo.CAzUtKks.svg',
  areaServed: [
    { '@type': 'City', name: 'Barcelona' },
    { '@type': 'City', name: 'Girona' },
    { '@type': 'City', name: 'Tarragona' },
  ],
  availableLanguage: ['English', 'Spanish'],
  offers: {
    '@type': 'Offer',
    url: 'https://www.stwmovers.com/journey',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Executive Business Travel Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Executive Business Travel' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Corporate Chauffeur Service' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Business Meeting Transportation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'VIP Executive Transfer' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Conference & Event Transportation' } },
    ],
  },
  keywords: [
    'Executive Business Travel Barcelona',
    'Corporate Chauffeur Barcelona',
    'Business Travel Barcelona',
    'Executive Chauffeur Service',
    'Corporate Transportation Barcelona',
    'VIP Chauffeur Barcelona',
    'Business Meeting Transport',
    'Luxury Executive Transfer',
  ],
} as const

export const chauffeurServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': 'https://stwmovers.com/chauffeur-service#service',
  name: 'Chauffeur Service Barcelona',
  alternateName: 'Private Chauffeur Service',
  description:
    'STW Movers provides premium chauffeur services in Barcelona, Girona, and Tarragona. Travel in comfort with professional chauffeurs for airport transfers, business meetings, corporate travel, sightseeing tours, special events, and private transportation.',
  serviceType: 'Chauffeur Service',
  provider: {
    '@type': 'TravelAgency',
    '@id': 'https://stwmovers.com/#organization',
    name: 'STW Movers',
    url: 'https://stwmovers.com/',
  },
  url: 'https://stwmovers.com/chauffeur-service',
  image: 'https://stwmovers.com/_nuxt/Logo.CAzUtKks.svg',
  areaServed: [
    { '@type': 'City', name: 'Barcelona' },
    { '@type': 'City', name: 'Girona' },
    { '@type': 'City', name: 'Tarragona' },
  ],
  availableLanguage: ['English', 'Spanish'],
  offers: {
    '@type': 'Offer',
    url: 'https://www.stwmovers.com/journey',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Chauffeur Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Private Chauffeur Service' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Luxury Chauffeur Service' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Executive Chauffeur' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Corporate Chauffeur' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'VIP Chauffeur Service' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Event Chauffeur' } },
    ],
  },
  keywords: [
    'Chauffeur Service Barcelona',
    'Private Chauffeur Barcelona',
    'Luxury Chauffeur Barcelona',
    'Executive Chauffeur Barcelona',
    'Corporate Chauffeur Barcelona',
    'VIP Chauffeur Barcelona',
    'Professional Chauffeur Barcelona',
    'Private Driver Barcelona',
  ],
} as const

export const serviceLandingPages = {
  'airport-transfer': {
    id: 'airport-transfer',
    path: '/airport-transfer',
    seo: {
      title: 'Barcelona Airport Transfer',
      description: airportTransferSchema.description,
    },
    hero: {
      eyebrow: 'AIRPORT TRANSFER',
      title: 'Barcelona Airport Transfer',
      body: 'Professional meet & greet, real-time flight tracking, and fixed-price transfers to and from Barcelona Airport (BCN).',
      image: '/img/services/airport.png',
    },
    section: {
      id: 'airport-transfer-detail',
      imageSide: 'left',
      image: '/img/services/airport.png',
      imageAlt: 'Chauffeur assisting a traveller with airport transfer luggage',
      imageWidth: 680,
      imageHeight: 560,
      heading: 'Seamless Airport Arrivals & Departures',
      body: 'Enjoy a seamless arrival with professional meet & greet, real-time flight tracking, fixed pricing, and comfortable transfers to your destination across Barcelona, Girona, and Tarragona.',
      highlights: ['Flight Monitoring', 'Meet & Greet', 'Fixed Pricing', '24/7 Availability'],
      cta: { label: 'Book Airport Transfer', href: '/#booking-section', variant: 'gold' },
    },
    schema: airportTransferSchema,
  },
  'executive-business-travel': {
    id: 'executive-business-travel',
    path: '/executive-business-travel',
    seo: {
      title: 'Executive Business Travel',
      description: executiveBusinessTravelSchema.description,
    },
    hero: {
      eyebrow: 'EXECUTIVE BUSINESS TRAVEL',
      title: 'Executive Business Travel',
      body: 'Reliable chauffeur services for executives, meetings, conferences, and corporate travel across Barcelona and Spain.',
      image: '/img/services/business.png',
    },
    section: {
      id: 'executive-business-detail',
      imageSide: 'right',
      image: '/img/services/business.png',
      imageAlt: 'Executive stepping into a chauffeured luxury vehicle',
      imageWidth: 680,
      imageHeight: 560,
      heading: 'Corporate Chauffeur Service You Can Rely On',
      body: 'Reliable chauffeur services for executives, meetings, conferences, and corporate travel, allowing you to focus on business while we handle the journey.',
      highlights: ['Executive Meetings', 'Conferences', 'Roadshows', 'Corporate Accounts'],
      cta: { label: 'Open Corporate Account', href: '/#contact', variant: 'outline' },
    },
    schema: executiveBusinessTravelSchema,
  },
  'chauffeur-service': {
    id: 'chauffeur-service',
    path: '/chauffeur-service',
    seo: {
      title: 'Chauffeur Service Barcelona',
      description: chauffeurServiceSchema.description,
    },
    hero: {
      eyebrow: 'PRIVATE CHAUFFEUR',
      title: 'Chauffeur Service Barcelona',
      body: 'A dedicated professional chauffeur whenever your plans require flexibility — for business, events, or private travel.',
      image: '/img/services/hourly.png',
    },
    section: {
      id: 'chauffeur-service-detail',
      imageSide: 'left',
      image: '/img/services/hourly.png',
      imageAlt: 'Private chauffeur waiting beside a luxury vehicle in Barcelona',
      imageWidth: 680,
      imageHeight: 560,
      heading: 'Your Private Chauffeur, On Demand',
      body: 'Keep a dedicated chauffeur by your side for shopping, dining, meetings, appointments, or a full day of travel. Benefit from maximum flexibility with a luxury vehicle ready whenever you are.',
      highlights: ['Hourly Hire', 'Full-Day Availability', 'Luxury Fleet', 'Discreet Service'],
      cta: { label: 'Book Your Chauffeur', href: '/#booking-section', variant: 'gold' },
    },
    schema: chauffeurServiceSchema,
  },
} as const satisfies Record<string, ServiceLandingPage>

export type ServiceLandingPageId = keyof typeof serviceLandingPages
