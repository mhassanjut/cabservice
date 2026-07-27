/** Minimum vehicle capacity tiers used for passenger filtering (matches CarFilters chips). */
export const PASSENGER_CAPACITY_CHOICES = [2, 4, 6, 8] as const

export type PassengerCapacityChoice = (typeof PASSENGER_CAPACITY_CHOICES)[number]

export function passengerCapacityLabel(n: number): string {
  return n === 8 ? '8+' : String(n)
}
