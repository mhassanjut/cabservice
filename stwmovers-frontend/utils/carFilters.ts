import type { CarFilter } from '~/types/api'

/** Strip empty filter fields before sending to the API (null/undefined = no constraint). */
export function normalizeCarFilters(filters: CarFilter): CarFilter | undefined {
  const next: CarFilter = {}

  if (filters.passengerCapacity != null && filters.passengerCapacity > 0) {
    next.passengerCapacity = filters.passengerCapacity
  }
  if (filters.carType) next.carType = filters.carType
  if (filters.bodyType) next.bodyType = filters.bodyType
  if (filters.category) next.category = filters.category
  if (filters.electric === true) next.electric = true
  if (filters.luxury === true) next.luxury = true
  if (filters.minPrice != null && filters.minPrice > 0) next.minPrice = filters.minPrice
  if (filters.maxPrice != null && filters.maxPrice > 0) next.maxPrice = filters.maxPrice

  return Object.keys(next).length ? next : undefined
}
