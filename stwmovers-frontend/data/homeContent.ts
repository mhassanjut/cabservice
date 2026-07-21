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
  { id: 'santa-susanna', title: 'Barcelona to Santa Susanna', image: '/img/home/location-santa-susanna.jpg', tall: true, type: 'transfer' },
  { id: 'empuriabrava', title: 'Barcelona to Empuriabrava', image: '/img/home/location-empuriabrava.jpg', type: 'transfer' },
  { id: 'costa-brava', title: 'Barcelona to Costa Brava', image: '/img/home/location-costa-brava.jpg', wide: true, tall: true, type: 'transfer' },
  { id: 'palamos', title: 'Barcelona to Palamós', image: '/img/home/location-palamos.jpg', type: 'transfer' },
  { id: 'begur', title: 'Barcelona to Begur', image: '/img/home/location-begur.jpg', wide: true, tall: true, type: 'transfer' },
  { id: 'calella', title: 'Barcelona to Calella', image: '/img/home/location-calella.jpg', type: 'transfer' },
  { id: 'vilanova', title: 'Barcelona to Vilanova i la Geltrú', image: '/img/home/location-vilanova.jpg', type: 'transfer' },
  { id: 'calafell', title: 'Barcelona to Calafell', image: '/img/home/location-calafell.jpg', type: 'transfer' },
  { id: 'segur-calafell', title: 'Barcelona to Segur de Calafell', image: '/img/home/location-segur-calafell.jpg', type: 'transfer' },
  { id: 'salou', title: 'Barcelona to Salou', image: '/img/home/location-salou.jpg', type: 'transfer' },
  { id: 'portaventura', title: 'Barcelona to PortAventura', image: '/img/home/location-portaventura.jpg', type: 'transfer' },
  { id: 'blanes', title: 'Barcelona to Blanes', image: '/img/home/location-blanes.jpg', type: 'transfer' },
]

export const homeExperienceTiles = [
  {
    title: 'Airport Meet & Greet',
    subtitle: 'A professional welcome, flight tracking, and seamless airport transfers.',
    image: '/img/home/experience-airport.jpg',
    height: 520,
  },
  {
    title: 'Business Travel',
    subtitle: 'Executive transportation that keeps your schedule running smoothly.',
    image: '/img/home/experience-business.jpg',
    height: 360,
  },
  {
    title: 'Private Chauffeur',
    subtitle: 'A dedicated driver whenever your plans require flexibility.',
    image: '/img/home/experience-chauffeur.jpg',
    height: 427,
  },
] as const

export const homeJourneyCards = [
  { title: 'La Rambla', image: '/img/home/journey-la-rambla.jpg' },
  { title: 'Montjuïc', image: '/img/home/journey-montjuic.jpg' },
  { title: 'Sagrada Familia', image: '/img/home/journey-sagrada.jpg' },
  { title: 'Park Güell', image: '/img/home/journey-park-guell.jpg' },
  { title: 'Camp Nou', image: '/img/home/journey-camp-nou.jpg' },
  { title: 'Casa Batlló', image: '/img/home/journey-casa-batllo.jpg' },
  { title: 'Gothic Quarter', image: '/img/home/journey-gothic.jpg' },
  { title: 'Barceloneta Beach', image: '/img/home/journey-barceloneta.jpg' },
] as const

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

export const homeFleetTabs = [
  { id: 'all', label: 'All' },
  { id: 'van', label: 'Vans' },
  { id: 'sedan', label: 'Sedans' },
  { id: 'luxury', label: 'Luxury' },
] as const
