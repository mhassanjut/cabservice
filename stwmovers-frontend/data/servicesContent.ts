/**
 * Content for the Services page (Figma: sovereign-services-page, node 82:491).
 * All copy, imagery, and section data live here so the section components stay
 * presentational. Images are served from `public/img/services/`.
 */

export type ServiceHighlight = string

export type ServiceSplitSection = {
  id: string
  /** Puts the image on the left (default) or right of the copy. */
  imageSide: 'left' | 'right'
  image: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  heading: string
  body: string
  highlights?: ServiceHighlight[]
  cta: {
    label: string
    href: string
    variant: 'gold' | 'outline'
  }
}

export type ServiceFeature = {
  title: string
  text: string
}

export type ServiceStep = {
  step: string
  title: string
  text: string
}

/* ─── Hero (82:492) ─── */
export const servicesHero = {
  eyebrow: 'EXECUTIVE CHAUFFEUR SERVICES',
  title: 'Every Journey, Thoughtfully Planned.',
  body:
    "Whether you're arriving for business, catching a flight, or celebrating a special occasion, every journey is carefully planned to deliver comfort, reliability, and complete peace of mind.",
  cta: { label: 'Book Your Journey', href: '/#booking-section' },
  image: '/img/services/hero.png',
} as const

/* ─── Introduction (82:514) ─── */
export const servicesIntro = {
  heading: 'Travel, Designed Around You.',
  body:
    'No two journeys are alike. That\u2019s why every service is tailored around your destination, schedule, and personal preferences\u2014so you can simply enjoy the experience.',
  image: '/img/services/intro.png',
} as const

/* ─── Split content sections (82:519, 82:536, 82:569) ─── */
export const servicesSplitSections: ServiceSplitSection[] = [
  {
    id: 'airport-transfers',
    imageSide: 'left',
    image: '/img/services/airport.png',
    imageAlt: 'Chauffeur assisting a traveller with airport transfer luggage',
    imageWidth: 680,
    imageHeight: 560,
    heading: 'Airport Transfers',
    body:
      'Enjoy a seamless arrival with professional meet & greet, real-time flight tracking, fixed pricing, and comfortable transfers to your destination.',
    highlights: ['Flight Monitoring', 'Meet & Greet', 'Fixed Pricing', '24/7 Availability'],
    cta: { label: 'Book Airport Transfer', href: '/#booking-section', variant: 'gold' },
  },
  {
    id: 'executive-business',
    imageSide: 'right',
    image: '/img/services/business.png',
    imageAlt: 'Executive stepping into a chauffeured luxury vehicle',
    imageWidth: 680,
    imageHeight: 560,
    heading: 'Executive Business Travel',
    body:
      'Reliable chauffeur services for executives, meetings, conferences, and corporate travel, allowing you to focus on business while we handle the journey.',
    highlights: ['Executive Meetings', 'Conferences', 'Roadshows', 'Corporate Accounts'],
    cta: { label: 'Open Corporate Account', href: '/#contact', variant: 'outline' },
  },
  {
    id: 'special-events',
    imageSide: 'left',
    image: '/img/services/events.png',
    imageAlt: 'Elegant arrival at a special event by chauffeured car',
    imageWidth: 640,
    imageHeight: 540,
    heading: 'Special Events',
    body:
      "Whether it's a wedding, gala dinner, sporting event, or private celebration, arrive with elegance and complete confidence. Our premium fleet and pristine preparation ensure your event transport is spectacular.",
    cta: { label: 'Plan Your Event', href: '/#contact', variant: 'gold' },
  },
]

/* ─── Hourly Chauffeur (82:553) ─── */
export const servicesHourly = {
  heading: 'Hourly Chauffeur',
  body:
    'Keep a dedicated chauffeur by your side for shopping, dining, meetings, appointments, or a full day of travel. Benefit from maximum flexibility with a luxury vehicle ready whenever you are.',
  image: '/img/services/hourly.png',
} as const

/* ─── Private Experiences (82:558) ─── */
export const servicesExperiences = {
  heading: 'Private Experiences',
  body:
    "Discover iconic landmarks, coastal escapes, wine regions, and hidden gems through personalized journeys designed exclusively for you. Your chauffeur acts as a knowledgeable guide to the region's finest sights.",
  collage: [
    { image: '/img/services/collage-1.png', alt: 'Coastal scenic drive experience', span: 'short' },
    { image: '/img/services/collage-2.png', alt: 'Guided landmark tour experience', span: 'tall' },
    { image: '/img/services/collage-3.png', alt: 'Wine region private journey', span: 'tall' },
    { image: '/img/services/collage-4.png', alt: 'Hidden gem sightseeing experience', span: 'short' },
  ],
} as const

/* ─── Why Choose (82:577) ─── */
export const servicesWhyChooseHeading = 'Why The Journey Feels Different.'

export const servicesFeatures: ServiceFeature[] = [
  {
    title: 'Professional Chauffeurs',
    text: 'Rigorous standards, exceptional local knowledge, and absolute discretion.',
  },
  {
    title: 'Luxury Fleet',
    text: 'Meticulously maintained premium sedans, SUVs, and spacious executive vans.',
  },
  {
    title: 'Worldwide Standards',
    text: 'Flawless consistency and elite hospitality wherever you travel.',
  },
  {
    title: 'Flexible Scheduling',
    text: 'Seamless adjustments to your dynamic itinerary with 24/7 support.',
  },
  {
    title: 'Transparent Pricing',
    text: 'Clear, pre-calculated rates with no hidden fees or surprise additions.',
  },
  {
    title: 'Personalized Service',
    text: 'Every detail from cabin temperature to route preference tailored to you.',
  },
]

/* ─── Quote (82:616) ─── */
export const servicesQuote = {
  quote: '\u201CEvery Journey Is Remembered By How It Made You Feel.\u201D',
  attribution:
    'A seamless transition from flight to road, a quiet cabin to gather your thoughts, and the reassurance of a professional waiting exactly where they promised.',
  image: '/img/services/quote.png',
} as const

/* ─── Booking Process (82:621) ─── */
export const servicesStepsHeading = 'Booking Is Effortless.'

export const servicesSteps: ServiceStep[] = [
  {
    step: '01',
    title: 'Share Your Journey',
    text: 'Tell us where you need to be. Our system calculates the optimal route and vehicle selection.',
  },
  {
    step: '02',
    title: 'Choose Your Service',
    text: 'Select the service model that fits your schedule, whether airport transfer, hourly, or corporate.',
  },
  {
    step: '03',
    title: 'Travel With Confidence',
    text: 'Relax in a sanctuary of comfort while we handle all the navigation, flight tracking, and logistics.',
  },
]

/* ─── Final CTA (82:636) ─── */
export const servicesFinalCta = {
  heading: 'Ready To Plan Your Next Journey?',
  body: 'From airport arrivals to private experiences, every journey begins with a conversation.',
  image: '/img/services/cta.png',
  primary: { label: 'Book Your Journey', href: '/#booking-section' },
  secondary: { label: 'Contact Our Team', href: '/#contact' },
} as const
