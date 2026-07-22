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
  eyebrow: 'ABOUT US',
  title: 'More Than A Chauffeur Service.',
  body:
    'Exceptional journeys begin with trust. Every experience is shaped by thoughtful hospitality, attention to detail, and a genuine commitment to making travel effortless.',
  primary: { label: 'Book Your Journey', href: '/#booking-section' },
  secondary: { label: 'Explore Our Services', href: '/services' },
  image: '/img/about/hero.png',
} as const

/* ─── Our Philosophy (82:709) ─── */
export const aboutPhilosophy = {
  eyebrow: 'OUR PHILOSOPHY',
  heading: 'Luxury Is Found In The Details.',
  body:
    "Luxury isn't defined by the vehicle you travel in. It's the feeling of arriving on time, being welcomed by name, and knowing every detail has already been taken care of before your journey begins.",
  image: '/img/about/philosophy.png',
} as const

/* ─── The People (82:715) ─── */
export const aboutPeople = {
  eyebrow: 'THE STW MOVERS CHAUFFEURS',
  heading: 'Driven By Hospitality.',
  subtitle:
    'Every chauffeur is carefully selected for professionalism, discretion, local knowledge, and an unwavering commitment to exceptional service. More than drivers, they are ambassadors of every journey.',
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
export const aboutHighlightsHeading = 'What Defines Our Service'

export const aboutFeatures: AboutFeature[] = [
  {
    title: 'Professional Chauffeurs',
    text: 'Rigorous standards, exceptional local knowledge, and absolute discretion.',
  },
  {
    title: 'Luxury Fleet',
    text: 'Meticulously maintained premium sedans, SUVs, and spacious executive vans.',
  },
  {
    title: 'Personalized Service',
    text: 'Every detail from cabin temperature to route preference tailored to you.',
  },
  {
    title: 'Worldwide Standards',
    text: 'Flawless consistency and elite hospitality wherever you travel.',
  },
  {
    title: 'Reliable Every Time',
    text: 'Seamless adjustments to your dynamic itinerary with 24/7 dedicated support.',
  },
  {
    title: 'Attention To Detail',
    text: 'Every step is meticulously handled, from flight tracking to luggage transfers.',
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
  heading: 'Every Journey Matters.',
  body:
    "Whether it's an airport transfer, an important business meeting, or a once-in-a-lifetime celebration, we approach every journey with the same care, professionalism, and attention to detail.",
  cta: { label: 'Book Your Journey', href: '/#booking-section' },
  image: '/img/about/promise-bg.png',
} as const

/* ─── Guest Story / Testimonials (82:789) ─── */
export const aboutTestimonial = {
  eyebrow: 'GUEST STORY',
  quote:
    '"STW Movers has redefined my expectations of global travel. From London to Tokyo, the service is flawlessly consistent."',
  body:
    'The transition from international flight to road was completely seamless. The driver was waiting exactly where promised, with our preferred refreshments already prepared. It felt like coming home.',
  authorName: 'Jane Doe',
  authorCompany: 'SomeCompany LLC.',
  image: '/img/about/testimonial.png',
} as const

/* ─── Final CTA (82:814) ─── */
export const aboutFinalCta = {
  heading: "Let's Make Your Next Journey Exceptional.",
  body: "Tell us where you're going, and we'll take care of everything in between.",
  image: '/img/about/cta.png',
  primary: { label: 'Book Your Journey', href: '/#booking-section' },
  secondary: { label: 'Contact Our Team', href: '/#contact' },
} as const
