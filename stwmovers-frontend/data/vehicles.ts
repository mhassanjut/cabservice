export type FleetVehicle = {
  id: string
  name: string
  seats: number
  bags: number
  priceEur: number
  description: string
  imagePath: string
}

export const vehicles: FleetVehicle[] = [
  { id: 'eco', name: 'Mercedes E Class', seats: 4, bags: 3, priceEur: 70, description: 'Executive sedan.', imagePath: '/img/vehicles/comfort.svg' },
  { id: 'comfort', name: 'Tesla Model S', seats: 4, bags: 3, priceEur: 50, description: 'Electric premium.', imagePath: '/img/vehicles/eco.svg' },
  { id: 'van', name: 'Mercedes Vito Van', seats: 7, bags: 6, priceEur: 55, description: 'Group transfers.', imagePath: '/img/vehicles/van.svg' },
]
