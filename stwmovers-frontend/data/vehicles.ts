import type { Vehicle } from '~/types/booking'

export const vehicles: Vehicle[] = [
  {
    id: 'eco',
    name: 'Economy Sedan',
    seats: 3,
    bags: 2,
    priceEur: 39,
    description: 'Best value for city and airport transfers.',
    imagePath: '/img/vehicles/eco.svg',
  },
  {
    id: 'comfort',
    name: 'Comfort Sedan',
    seats: 3,
    bags: 3,
    priceEur: 55,
    description: 'Extra comfort for longer rides across Spain.',
    imagePath: '/img/vehicles/comfort.svg',
  },
  {
    id: 'van',
    name: 'Family Van',
    seats: 6,
    bags: 6,
    priceEur: 79,
    description: 'Ideal for groups, luggage, and family travel.',
    imagePath: '/img/vehicles/van.svg',
  },
] as const

