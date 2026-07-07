export const SUPPORTED_PICKUP_CITIES = ['Barcelona', 'Tarragona', 'Girona'] as const

export type SupportedPickupCity = (typeof SUPPORTED_PICKUP_CITIES)[number]

/** Barcelona + El Prat (08820) + BCN airport — matches backend app.barcelona bounds */
export const BARCELONA_PICKUP_BOUNDS = {
  minLat: 41.27,
  maxLat: 41.469,
  minLng: 2.052,
  maxLng: 2.228,
} as const

export const PICKUP_CITY_DETAILS: { name: SupportedPickupCity; hint?: string }[] = [
  { name: 'Barcelona', hint: 'Includes Barcelona-El Prat Airport (BCN) and nearby areas' },
  { name: 'Tarragona' },
  { name: 'Girona' },
]

const BARCELONA_PICKUP_ALIASES: Record<string, SupportedPickupCity> = {
  'el prat de llobregat': 'Barcelona',
  'hospitalet de llobregat': 'Barcelona',
  "l'hospitalet de llobregat": 'Barcelona',
  'cornella de llobregat': 'Barcelona',
  'sant boi de llobregat': 'Barcelona',
  castelldefels: 'Barcelona',
}

export function normalizeCityName(city?: string | null): string | null {
  if (!city?.trim()) return null
  let trimmed = city.trim()
  const comma = trimmed.indexOf(',')
  if (comma > 0) trimmed = trimmed.slice(0, comma).trim()
  return trimmed
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

export function isWithinBarcelonaPickupZone(lat: number, lng: number): boolean {
  const b = BARCELONA_PICKUP_BOUNDS
  return lat >= b.minLat && lat <= b.maxLat && lng >= b.minLng && lng <= b.maxLng
}

export function resolveSupportedPickupCity(city?: string | null): SupportedPickupCity | null {
  const normalized = normalizeCityName(city)
  if (!normalized) return null
  return (
    SUPPORTED_PICKUP_CITIES.find(
      (supported) => normalizeCityName(supported)?.toLowerCase() === normalized.toLowerCase(),
    ) ?? null
  )
}

export function resolvePickupCity(
  city?: string | null,
  lat?: number,
  lng?: number,
): SupportedPickupCity | null {
  const fromName = resolveSupportedPickupCity(city)
  if (fromName) return fromName

  const normalized = normalizeCityName(city)?.toLowerCase()
  if (normalized && BARCELONA_PICKUP_ALIASES[normalized]) {
    return BARCELONA_PICKUP_ALIASES[normalized]
  }

  if (lat != null && lng != null && isWithinBarcelonaPickupZone(lat, lng)) {
    return 'Barcelona'
  }

  return null
}

export function isSupportedPickupCity(
  city?: string | null,
  lat?: number,
  lng?: number,
): boolean {
  return resolvePickupCity(city, lat, lng) != null
}
