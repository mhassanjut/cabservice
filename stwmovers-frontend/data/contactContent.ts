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
  eyebrow: 'CONTACT STW MOVERS',
  title: 'Send The Trip Details. We Will Plan The Private Transfer.',
  body:
    'Contact the Barcelona chauffeur desk for airport transfers, private driver hire, hourly chauffeur service, cruise port pickups, executive travel, or a premium taxi and cab alternative.',
  cta: { label: 'Contact Chauffeur Desk', href: '#contact-channels' },
  image: '/img/contact/hero.png',
} as const

/* ─── Book Your Journey (82:896) ─── */
export const contactBooking = {
  heading: 'Request a Private Barcelona Chauffeur Quote',
  lead:
    'Share pickup, destination, date, time, passengers, luggage, flight or cruise details, and any extra stops. The STW Movers desk will match the right private driver, airport transfer, or cab alternative.',
  formTitle: 'Request Private Quote',
  submitLabel: 'Request Private Quote',
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
  eyebrow: 'CHAUFFEUR DESK',
  heading: 'Direct lines for quotes, airport changes, and private driver support',
} as const

export const contactCards: ContactCard[] = [
  {
    icon: 'fa-solid fa-phone',
    title: 'Phone Support',
    value: contactPhoneDisplay,
    href: contactTelHref,
    description:
      'Call for airport pickup questions, urgent itinerary changes, private driver requests, or same-day transfer availability.',
  },
  {
    icon: 'fa-solid fa-envelope',
    title: 'Contact Email',
    value: contactEmail,
    href: contactMailto,
    description:
      'Best for corporate travel, multi-car bookings, city-to-city routes, event chauffeur plans, and detailed quote requests.',
  },
  {
    icon: 'fa-brands fa-whatsapp',
    title: 'WhatsApp Booking',
    value: contactPhoneDisplay,
    href: contactWhatsappHref,
    external: true,
    description:
      'Fast messaging for airport transfer quotes, cab alternative searches, luggage notes, driver coordination, and live support.',
  },
]

/* ─── Service Areas (82:977) ─── */
export const contactAreas = {
  eyebrow: 'BARCELONA SERVICE AREA',
  heading: 'Local support for Barcelona Airport, Eixample, cruise port, and city-to-city transfers',
  body:
    'STW Movers serves Barcelona, BCN airport, Eixample 08015, Fira Barcelona, cruise terminals, hotels, homes, business venues, and private transfer routes across Catalonia.',
  image: '/img/contact/destination-sunset.png',
  imageAlt: 'Barcelona harbour and skyline at sunset',
  cities: ['Barcelona', 'BCN Airport', 'Eixample 08015', 'Cruise Port', 'Fira Barcelona', 'Sitges', 'Tarragona', 'Girona'],
} as const

/* ─── FAQ (82:999) ─── */
export const contactFaq = {
  eyebrow: 'QUOTE FAQ',
  heading: 'Questions before you send a trip request',
} as const

export const contactFaqItems: ContactFaqItem[] = [
  {
    question: 'What details should I send for a Barcelona airport transfer quote?',
    answer:
      'Send flight number, date, pickup time, terminal if known, destination address, passengers, luggage, child-seat needs, and any extra stops.',
  },
  {
    question: 'Can I contact STW Movers if I searched for taxi or cab service?',
    answer:
      'Yes. Many travellers find STW Movers through taxi, cab, airport cab, or private cab searches. The service is a pre-booked private chauffeur alternative.',
  },
  {
    question: 'Do you monitor delayed flights for airport transfers?',
    answer:
      'Include your flight number when booking. Ask our team to confirm flight monitoring, waiting time and any delay-related charges for your transfer before you travel.',
  },
  {
    question: 'Can I request multiple stops during hourly chauffeur service?',
    answer:
      'Yes. Hourly chauffeur hire includes as many stops as you need within the booked time. Just share your itinerary and we will plan the route around it.',
  },
  {
    question: 'Do you provide child seats upon request?',
    answer:
      'Request a child or booster seat in your booking notes, including the child\'s age and any specific requirements. Our team will confirm availability, suitability and any charge before you book.',
  },
  {
    question: 'Can I book recurring travel for corporate business accounts?',
    answer:
      'Yes. We offer corporate accounts with recurring bookings, consolidated billing, and priority dispatch. Contact our team to set one up.',
  },
]

/* ─── Concierge Promise (82:1034) ─── */
export const contactPromise = {
  heading: 'Every Private Transfer Starts With Clear Details.',
  body:
    'Tell us where you are going, when you need to move, who is travelling, and what luggage is coming. We will help turn the request into a calm Barcelona chauffeur plan.',
  cta: { label: 'Request Quote', href: '/journey#book-journey' },
  image: '/img/contact/promise-bg.png',
} as const
