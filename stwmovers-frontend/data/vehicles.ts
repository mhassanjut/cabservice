import { fleetImageManifest } from '~/data/fleetImageManifest'

/** Static fleet data for the landing page — mirrors backend seed (V2) exactly; display-only. */
export type FleetVehicle = {
  /** Backend car UUID */
  backendId: string
  name: string
  seats: number
  bags: number
  priceEur: number
  description: string
  imagePath: string
  bodyType: 'sedan' | 'van'
  category: 'standard' | 'luxury'
  electric?: boolean
  carType: 'VAN' | 'SEDAN'
}

/** Same order and values as backend `cars` seed rows. */
export const vehicles: FleetVehicle[] = [
  {
    backendId: fleetImageManifest[0].backendId,
    name: 'Mercedes Vito Van',
    seats: 7,
    bags: 6,
    priceEur: 55,
    description: 'Spacious van for groups',
    imagePath: fleetImageManifest[0].imagePath,
    bodyType: 'van',
    category: 'standard',
    carType: 'VAN',
  },
  {
    backendId: fleetImageManifest[1].backendId,
    name: 'Mercedes V Class',
    seats: 7,
    bags: 6,
    priceEur: 65,
    description: 'Premium V Class',
    imagePath: fleetImageManifest[1].imagePath,
    bodyType: 'van',
    category: 'luxury',
    carType: 'VAN',
  },
  {
    backendId: fleetImageManifest[2].backendId,
    name: 'Mercedes Van',
    seats: 8,
    bags: 7,
    priceEur: 70,
    description: 'Large capacity van',
    imagePath: fleetImageManifest[2].imagePath,
    bodyType: 'van',
    category: 'standard',
    carType: 'VAN',
  },
  {
    backendId: fleetImageManifest[3].backendId,
    name: 'Mercedes E Class',
    seats: 4,
    bags: 3,
    priceEur: 70,
    description: 'Executive sedan',
    imagePath: fleetImageManifest[3].imagePath,
    bodyType: 'sedan',
    category: 'luxury',
    carType: 'SEDAN',
  },
  {
    backendId: fleetImageManifest[4].backendId,
    name: 'Mercedes S Class',
    seats: 4,
    bags: 3,
    priceEur: 120,
    description: 'Flagship luxury sedan',
    imagePath: fleetImageManifest[4].imagePath,
    bodyType: 'sedan',
    category: 'luxury',
    carType: 'SEDAN',
  },
  {
    backendId: fleetImageManifest[5].backendId,
    name: 'Tesla Model S',
    seats: 4,
    bags: 3,
    priceEur: 50,
    description: 'Electric premium sedan',
    imagePath: fleetImageManifest[5].imagePath,
    bodyType: 'sedan',
    category: 'standard',
    electric: true,
    carType: 'SEDAN',
  },
  {
    backendId: fleetImageManifest[6].backendId,
    name: 'Hyundai Ionic',
    seats: 4,
    bags: 3,
    priceEur: 40,
    description: 'Eco-friendly electric',
    imagePath: fleetImageManifest[6].imagePath,
    bodyType: 'sedan',
    category: 'standard',
    electric: true,
    carType: 'SEDAN',
  },
  {
    backendId: fleetImageManifest[7].backendId,
    name: 'Toyota Corolla Familiar',
    seats: 4,
    bags: 3,
    priceEur: 40,
    description: 'Reliable family sedan',
    imagePath: fleetImageManifest[7].imagePath,
    bodyType: 'sedan',
    category: 'standard',
    carType: 'SEDAN',
  },
]

export const fleetFilters = [
  { id: 'all', label: 'All vehicles' },
  { id: 'van', label: 'Vans' },
  { id: 'sedan', label: 'Sedans' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'electric', label: 'Electric' },
] as const
