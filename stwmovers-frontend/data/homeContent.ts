import experienceAirportImage from '~/assets/images/homepage-experience-section/image 1.svg?url'
import experienceBusinessImage from '~/assets/images/homepage-experience-section/image 3.svg?url'
import experienceChauffeurImage from '~/assets/images/homepage-experience-section/image 4.svg?url'

export type HomeLocationCard = {
  id: string
  title: string
  image: string
  wide?: boolean
  tall?: boolean
  /** Tour packages are excluded from the landing page */
  type: 'transfer' | 'tour'
}

/** Transfer routes only — tour cards from Figma are filtered out at render time */
export const homeLocationCards: HomeLocationCard[] = [
  { id: 'santa-susanna', title: 'Barcelona to Santa Susanna', image: '/img/home/_original/location-santa-susanna.jpg', tall: true, type: 'transfer' },
  { id: 'empuriabrava', title: 'Barcelona to Empuriabrava', image: '/img/home/_original/location-empuriabrava.jpg', type: 'transfer' },
  { id: 'costa-brava', title: 'Barcelona to Costa Brava', image: '/img/home/_original/location-costa-brava.jpg', wide: true, tall: true, type: 'transfer' },
  { id: 'palamos', title: 'Barcelona to Palamós', image: '/img/home/_original/location-palamos.jpg', type: 'transfer' },
  { id: 'begur', title: 'Barcelona to Begur', image: '/img/home/_original/location-begur.jpg', wide: true, tall: true, type: 'transfer' },
  { id: 'calella', title: 'Barcelona to Calella', image: '/img/home/_original/location-calella.jpg', type: 'transfer' },
  { id: 'vilanova', title: 'Barcelona to Vilanova i la Geltrú', image: '/img/home/_original/location-vilanova.jpg', type: 'transfer' },
  { id: 'calafell', title: 'Barcelona to Calafell', image: '/img/home/_original/location-calafell.jpg', type: 'transfer' },
  { id: 'segur-calafell', title: 'Barcelona to Segur de Calafell', image: '/img/home/_original/location-segur-calafell.jpg', type: 'transfer' },
  { id: 'salou', title: 'Barcelona to Salou', image: '/img/home/_original/location-salou.jpg', type: 'transfer' },
  { id: 'portaventura', title: 'Barcelona to PortAventura', image: '/img/home/_original/location-portaventura.jpg', type: 'transfer' },
  { id: 'blanes', title: 'Barcelona to Blanes', image: '/img/home/_original/location-blanes.jpg', type: 'transfer' },
]

export const homeExperienceTiles = [
  {
    title: 'Airport Meet & Greet',
    subtitle: 'A professional welcome, flight tracking, and seamless airport transfers.',
    image: experienceAirportImage,
    height: 520,
  },
  {
    title: 'Business Travel',
    subtitle: 'Executive transportation that keeps your schedule running smoothly.',
    image: experienceBusinessImage,
    height: 360,
  },
  {
    title: 'Private Chauffeur',
    subtitle: 'A dedicated driver whenever your plans require flexibility.',
    image: experienceChauffeurImage,
    height: 427,
  },
] as const

/** Figma node 82:88 — collage card positions are px offsets within each group frame */
export type HomeJourneyCard = {
  id: string
  title: string
  image: string
  group: 'top' | 'bottom'
  left: number
  top: number
}

const JOURNEY_GROUP_TOP = { width: 691.49, height: 480.576 } as const
const JOURNEY_GROUP_BOTTOM = { width: 623.5, height: 498 } as const
const JOURNEY_CARD = { width: 208.5, height: 300 } as const

export const homeJourneyGroupTop = JOURNEY_GROUP_TOP
export const homeJourneyGroupBottom = JOURNEY_GROUP_BOTTOM
export const homeJourneyCardSize = JOURNEY_CARD

export const homeJourneyCards: HomeJourneyCard[] = [
  { id: 'la-rambla', title: 'La Rambla', image: '/img/home/_original/journey-la-rambla.jpg', group: 'top', left: 482.99, top: 0 },
  { id: 'montjuic', title: 'Montjuïc', image: '/img/home/_original/journey-montjuic.jpg', group: 'top', left: 312.75, top: 103 },
  { id: 'sagrada', title: 'Sagrada Familia', image: '/img/home/_original/journey-sagrada.jpg', group: 'top', left: 0, top: 72 },
  { id: 'park-guell', title: 'Park Güell', image: '/img/home/_original/journey-park-guell.jpg', group: 'top', left: 143.25, top: 180.58 },
  { id: 'camp-nou', title: 'Camp Nou', image: '/img/home/_original/journey-camp-nou.jpg', group: 'bottom', left: 415, top: 28 },
  { id: 'casa-batllo', title: 'Casa Batlló', image: '/img/home/_original/journey-casa-batllo.jpg', group: 'bottom', left: 0, top: 0 },
  { id: 'gothic', title: 'Gothic Quarter', image: '/img/home/_original/journey-gothic.jpg', group: 'bottom', left: 137.5, top: 106 },
  { id: 'barceloneta', title: 'Barceloneta Beach', image: '/img/home/_original/journey-barceloneta.jpg', group: 'bottom', left: 284.25, top: 198 },
]

export const homeValueProps = [
  {
    icon: '/img/home/icons/user-check.svg',
    title: 'Driven By Hospitality',
    text: 'More than a car and driver. A commitment to your peace of mind and time.',
  },
  {
    icon: '/img/home/icons/sofa.svg',
    title: 'Exceptional Comfort',
    text: 'More than a car and driver. A commitment to your peace of mind and time.',
  },
  {
    icon: '/img/home/icons/clock.svg',
    title: 'Fluid Scheduling',
    text: 'More than a car and driver. A commitment to your peace of mind and time.',
  },
  {
    icon: '/img/home/icons/layout.svg',
    title: 'Designed For You',
    text: 'More than a car and driver. A commitment to your peace of mind and time.',
  },
  {
    icon: '/img/home/icons/shield.svg',
    title: 'Private By Nature',
    text: 'More than a car and driver. A commitment to your peace of mind and time.',
  },
  {
    icon: '/img/home/icons/globe.svg',
    title: 'Trusted Worldwide',
    text: 'More than a car and driver. A commitment to your peace of mind and time.',
  },
] as const

export const homeBookingSteps = [
  {
    step: '01',
    title: 'Share Your Journey',
    text: 'Tell us where you need to be. Our system calculates the optimal route and vehicle selection.',
  },
  {
    step: '02',
    title: 'Meet Your Chauffeur',
    text: 'Receive chauffeur details and live tracking 2 hours prior to your scheduled departure.',
  },
  {
    step: '03',
    title: 'Travel With Confidence',
    text: 'Relax in a sanctuary of comfort while we handle the navigation and logistics.',
  },
] as const

/** Figma node 82:205 — fleet filter categories */
export const homeFleetTabs = [
  { id: 'all', label: 'All' },
  { id: 'business-class', label: 'Business Class' },
  { id: 'first-class', label: 'First Class' },
  { id: 'business-van', label: 'Business Van' },
  { id: 'mini-bus', label: 'Mini Bus' },
  { id: 'bus', label: 'Bus' },
  { id: 'aviation', label: 'Aviation' },
] as const

export type HomeFleetTabId = (typeof homeFleetTabs)[number]['id']
export type HomeFleetCategory = Exclude<HomeFleetTabId, 'all'>

export type HomeFleetVehicle = {
  id: string
  backendId?: string
  name: string
  image: string
  seats: number
  bags: number
  categories: HomeFleetCategory[]
}

/** Homepage fleet cards — WebP from SVG masters in fleet-section/_original/ */
export const homeFleetVehicles: HomeFleetVehicle[] = [
  {
    id: 'mercedes-e-class',
    backendId: 'c0000001-0000-0000-0000-000000000004',
    name: 'Mercedes E Class',
    image: '/img/home/fleet-section/mercedes-e-class.webp',
    seats: 4,
    bags: 3,
    categories: ['business-class', 'first-class'],
  },
  {
    id: 'mercedes-s-class',
    backendId: 'c0000001-0000-0000-0000-000000000005',
    name: 'Mercedes S Class',
    image: '/img/home/fleet-section/mercedes-s-class.webp',
    seats: 4,
    bags: 3,
    categories: ['first-class', 'aviation'],
  },
  {
    id: 'mercedes-v-class',
    backendId: 'c0000001-0000-0000-0000-000000000002',
    name: 'Mercedes V Class',
    image: '/img/home/fleet-section/mercedes-v-class.webp',
    seats: 7,
    bags: 6,
    categories: ['business-van', 'first-class'],
  },
  {
    id: 'mercedes-vito-van',
    backendId: 'c0000001-0000-0000-0000-000000000001',
    name: 'Mercedes Vito Van',
    image: '/img/home/fleet-section/mercedes-vito-van.webp',
    seats: 7,
    bags: 6,
    categories: ['business-van'],
  },
  {
    id: 'mercedes-van',
    backendId: 'c0000001-0000-0000-0000-000000000003',
    name: 'Mercedes Van',
    image: '/img/home/fleet-section/mercedes-van.webp',
    seats: 8,
    bags: 7,
    categories: ['mini-bus', 'bus'],
  },
  {
    id: 'tesla-model-s',
    backendId: 'c0000001-0000-0000-0000-000000000006',
    name: 'Tesla Model S',
    image: '/img/home/fleet-section/tesla-model-s.webp',
    seats: 4,
    bags: 3,
    categories: ['business-class'],
  },
  {
    id: 'hyundai-ioniq',
    backendId: 'c0000001-0000-0000-0000-000000000007',
    name: 'Hyundai Ioniq',
    image: '/img/home/fleet-section/hyundai-ioniq.webp',
    seats: 4,
    bags: 3,
    categories: ['business-class'],
  },
  {
    id: 'toyota-corolla',
    backendId: 'c0000001-0000-0000-0000-000000000008',
    name: 'Toyota Corolla Familiar',
    image: '/img/home/fleet-section/toyota-corolla-familiar.webp',
    seats: 4,
    bags: 3,
    categories: ['business-class'],
  },
  {
    id: 'byd-seal',
    name: 'BYD Seal',
    image: '/img/home/fleet-section/byd-seal.webp',
    seats: 4,
    bags: 3,
    categories: ['business-class'],
  },
]
