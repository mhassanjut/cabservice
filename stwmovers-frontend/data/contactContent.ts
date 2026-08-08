/**
 * Content for the Contact page (Figma: sovereign-contact-page, node 82:885).
 * All copy, imagery, and section data live here so the section components stay
 * presentational. Images are served from `public/img/contact/`.
 */

import { siteConfig } from '~/config/site'

const contactEmail = siteConfig.contactEmail
const contactMailto = `mailto:${contactEmail}`
const contactPhoneDisplay = siteConfig.contactPhoneDisplay
const contactTelHref = `tel:${siteConfig.contactPhone}`
const contactWhatsappHref = `https://wa.me/${siteConfig.whatsappNumber}`

export type ContactChannel = {
  /** Font Awesome icon class. */
  icon: string
  label: string
  value: string
  /** Anchor href (tel:, mailto:, or wa.me link). */
  href: string
  external?: boolean
}

export type ContactCard = {
  icon: string
  title: string
  value: string
  href: string
  description: string
  external?: boolean
}

export type ContactFaqItem = {
  question: string
  answer: string
}

/* ─── Hero (82:886) ─── */
export const contactHero = {
  eyebrow: 'CONTACT US',
  title: "We're Here To Plan Every Detail.",
  body:
    "Whether you're booking an airport transfer, executive travel, or a special occasion, our team is here to help you plan every detail with care.",
  cta: { label: 'Request Quote Below', href: '#book-journey' },
  image: '/img/contact/hero.png',
} as const

/* ─── Book Your Journey (82:896) ─── */
export const contactBooking = {
  heading: 'Book Your Journey',
  lead:
    'Share your travel details and our concierge team will prepare a personalised quote within the hour.',
  formTitle: 'Request My Journey',
  submitLabel: 'Request My Journey',
} as const

export const contactChannels: ContactChannel[] = [
  {
    icon: 'fa-solid fa-phone',
    label: 'Call Chauffeur Dispatch',
    value: contactPhoneDisplay,
    href: contactTelHref,
  },
  {
    icon: 'fa-solid fa-envelope',
    label: 'Concierge Email',
    value: contactEmail,
    href: contactMailto,
  },
  {
    icon: 'fa-brands fa-whatsapp',
    label: 'Instant WhatsApp Support',
    value: contactPhoneDisplay,
    href: contactWhatsappHref,
    external: true,
  },
]

/* ─── Ways to Reach Us (82:948) ─── */
export const contactChannelsSection = {
  eyebrow: 'GLOBAL CONCIERGE',
  heading: 'Direct Lines to our Dispatch Teams',
} as const

export const contactCards: ContactCard[] = [
  {
    icon: 'fa-solid fa-phone',
    title: 'Phone Support',
    value: contactPhoneDisplay,
    href: contactTelHref,
    description:
      'Available 24/7 for immediate assistance, flight delay changes, or urgent itinerary modifications.',
  },
  {
    icon: 'fa-solid fa-envelope',
    title: 'Contact Email',
    value: contactEmail,
    href: contactMailto,
    description:
      'Receive a personalised response from our luxury dispatch team regarding multi-car bookings or corporate contracts.',
  },
  {
    icon: 'fa-brands fa-whatsapp',
    title: 'WhatsApp Booking',
    value: contactPhoneDisplay,
    href: contactWhatsappHref,
    external: true,
    description:
      'Quick, seamless messaging for immediate quote checks, driver tracking links, and real-time support on the go.',
  },
]

/* ─── Service Areas (82:977) ─── */
export const contactAreas = {
  eyebrow: 'OUR FOOTPRINT',
  heading: 'Serving Major Cities Across Spain',
  body:
    'Providing executive chauffeur services across key business hubs, airports, and destinations with the same premium experience wherever you travel.',
  image: '/img/contact/destination-sunset.png',
  imageAlt: 'Barcelona harbour and skyline at sunset',
  cities: ['Barcelona', 'Tarragona', 'Girona'],
} as const

/* ─── FAQ (82:999) ─── */
export const contactFaq = {
  eyebrow: 'TRAVELER FAQ',
  heading: 'Frequently Asked Questions',
} as const

export const contactFaqItems: ContactFaqItem[] = [
  {
    question: 'How far in advance should I book my journey?',
    answer:
      'We recommend booking at least 24 hours ahead for guaranteed availability. Same-day executive dispatch is often possible — contact our concierge desk for urgent arrivals or departures.',
  },
  {
    question: 'Can I make last-minute reservations with STW Movers?',
    answer:
      'Yes. Subject to fleet availability, we accommodate last-minute and same-day bookings. Message us on WhatsApp for the fastest confirmation.',
  },
  {
    question: 'Do you monitor delayed flights for airport transfers?',
    answer:
      'Absolutely. We track your flight in real time and adjust the pickup automatically, so your chauffeur is always waiting when you land — at no extra cost for reasonable delays.',
  },
  {
    question: 'Can I request multiple stops during an hourly chauffeur service?',
    answer:
      'Yes. Hourly chauffeur hire includes as many stops as you need within the booked time. Just share your itinerary and we will plan the route around it.',
  },
  {
    question: 'Do you provide child seats upon request?',
    answer:
      'We do. Add your requirements in the notes when requesting your journey and we will fit the appropriate child or booster seats free of charge.',
  },
  {
    question: 'Can I book recurring travel for corporate business accounts?',
    answer:
      'Yes. We offer corporate accounts with recurring bookings, consolidated billing, and priority dispatch. Contact our team to set one up.',
  },
]

/* ─── Concierge Promise (82:1034) ─── */
export const contactPromise = {
  heading: 'Every Journey Starts With A Conversation.',
  body:
    "Tell us where you're going, and we'll take care of every detail before you even arrive.",
  cta: { label: 'Book Your Journey Now', href: '/#booking-section' },
  image: '/img/contact/promise-bg.png',
} as const
