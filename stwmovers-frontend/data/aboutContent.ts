/**
 * Content for the About Us page (Figma: sovereign-about-page, node 82:695).
 * All copy, imagery, and section data live here so the section components stay
 * presentational. Images are served from `public/img/about/`.
 */

export type AboutChauffeur = {
  image: string
  alt: string
  caption: string
  /** Vertical offset direction from the Figma staggered collage. */
  offset: 'up' | 'down' | 'none'
  imageWidth: number
  imageHeight: number
}

export type AboutFeature = {
  title: string
  text: string
}

export type AboutGalleryImage = {
  image: string
  alt: string
  /** Grid span within its row (wide = 780px, narrow = 480px in Figma). */
  span: 'wide' | 'narrow'
}

/* ─── Hero (82:696) ─── */
export const aboutHero = {
  eyebrow: 'ABOUT STW MOVERS',
  title: 'Barcelona Chauffeur Service Built Around Calm, Private Travel.',
  body:
    'STW Movers provides private airport transfers, chauffeur service, private driver hire, and premium taxi or cab alternatives for travellers who want every Barcelona journey planned before it begins.',
  primary: { label: 'Request Private Quote', href: '/journey#book-journey' },
  secondary: { label: 'Explore Our Services', href: '/services' },
  image: '/img/about/hero.png',
} as const

/* ─── Our Philosophy (82:709) ─── */
export const aboutPhilosophy = {
  eyebrow: 'OUR STANDARD',
  heading: 'Luxury Means The Pickup, Route, Vehicle, And Timing Are Already Thought Through.',
  body:
    'A premium Barcelona transfer is not only a nicer vehicle. It is flight-aware airport pickup, luggage-aware vehicle choice, clear meeting instructions, discreet service, and a private driver who understands the city, the guest, and the schedule.',
  image: '/img/about/philosophy.png',
} as const

/* ─── The People (82:715) ─── */
export const aboutPeople = {
  eyebrow: 'THE STW MOVERS CHAUFFEURS',
  heading: 'Professional Private Drivers For Airport, Business, Family, And VIP Travel.',
  subtitle:
    'Every chauffeur is selected for punctuality, discretion, local knowledge, guest care, and the ability to handle real-world travel details: BCN terminals, cruise port pickups, Eixample hotels, business meetings, luggage, and schedule changes.',
} as const

export const aboutChauffeurs: AboutChauffeur[] = [
  {
    image: '/img/about/chauffeur-1.png',
    alt: 'Marcus Vance, Senior Executive Chauffeur',
    caption: 'Marcus Vance — Senior Executive Chauffeur',
    offset: 'none',
    imageWidth: 400,
    imageHeight: 480,
  },
  {
    image: '/img/about/chauffeur-2.png',
    alt: 'Elena Rostova, Specialist Concierge Guide',
    caption: 'Elena Rostova — Specialist Concierge Guide',
    offset: 'up',
    imageWidth: 400,
    imageHeight: 520,
  },
  {
    image: '/img/about/chauffeur-3.png',
    alt: 'A chauffeur welcoming a guest',
    caption: 'The Gesture of Welcome',
    offset: 'down',
    imageWidth: 400,
    imageHeight: 440,
  },
]

/* ─── Highlights (82:731) ─── */
export const aboutHighlightsHeading = 'What Defines The STW Movers Experience'

export const aboutFeatures: AboutFeature[] = [
  {
    title: 'Barcelona-Based Planning',
    text: 'Local pickup guidance for BCN airport, cruise terminals, Eixample, Fira Barcelona, hotels, homes, and restaurants.',
  },
  {
    title: 'Premium Private Vehicles',
    text: 'Sedans and executive vans matched to passengers, luggage, comfort expectations, and the type of journey.',
  },
  {
    title: 'Taxi & Cab Alternative',
    text: 'A more planned option for travellers searching Barcelona taxi, airport cab, private cab, or cab service.',
  },
  {
    title: 'Airport Transfer Detail',
    text: 'Flight number, terminal, waiting time, luggage, and meeting instructions considered before the arrival.',
  },
  {
    title: 'Business-Ready Discretion',
    text: 'Quiet, punctual executive chauffeur support for meetings, events, Fira Barcelona, and hosted clients.',
  },
  {
    title: 'Quote Support By WhatsApp',
    text: 'Fast human guidance for airport transfer, private driver, hourly chauffeur, and city-to-city requests.',
  },
]

/* ─── Gallery (82:770) ─── */
export const aboutGallery = {
  eyebrow: 'LENS ON OUR WORLD',
  heading: 'Every Journey Has A Story.',
} as const

export const aboutGalleryImages: AboutGalleryImage[] = [
  { image: '/img/about/gallery-1.png', alt: 'Luxury car on a scenic coastal road', span: 'wide' },
  { image: '/img/about/gallery-2.png', alt: 'Chauffeur assisting a guest at arrival', span: 'narrow' },
  { image: '/img/about/gallery-3.png', alt: 'Elegant interior detail of the fleet', span: 'narrow' },
  { image: '/img/about/gallery-4.png', alt: 'A journey through the city at dusk', span: 'wide' },
]

/* ─── Promise (82:781) ─── */
export const aboutPromise = {
  heading: 'Every Barcelona Journey Should Feel Planned, Private, And Easy.',
  body:
    'Whether the search starts as airport transfer, private driver, taxi alternative, cab service, or executive chauffeur, STW Movers turns the request into a clear private transport plan.',
  cta: { label: 'Request Private Quote', href: '/journey#book-journey' },
  image: '/img/about/promise-bg.png',
} as const

/* ─── Guest Story / Testimonials (82:789) ─── */
export const aboutTestimonial = {
  eyebrow: 'GUEST STORY',
  quote:
    '"The airport pickup felt effortless. The vehicle fit our luggage, the driver knew the hotel access point, and the whole arrival was calm after a long flight."',
  body:
    'The transition from BCN arrivals to the city was completely seamless. The pickup instructions were clear, support was available on WhatsApp, and the journey felt more considered than a standard taxi queue.',
  authorName: 'STW Movers Guest',
  authorCompany: 'Barcelona airport transfer',
  image: '/img/about/testimonial.png',
} as const

/* ─── Final CTA (82:814) ─── */
export const aboutFinalCta = {
  heading: 'Plan A Private Barcelona Transfer Before The Journey Starts.',
  body: 'Send pickup, destination, date, time, passengers, luggage, and flight or cruise details. The STW Movers desk will guide the best private chauffeur option.',
  image: '/img/about/cta.png',
  primary: { label: 'Request Private Quote', href: '/journey#book-journey' },
  secondary: { label: 'Contact Our Team', href: '/contact' },
} as const
