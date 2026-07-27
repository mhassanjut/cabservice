import type { LatLng } from '~/types/booking'

export type RouteEndpoint = LatLng & {
  label?: string
  placeId?: string
}

export function routeEndpoint(
  coords: LatLng,
  label?: string,
  placeId?: string,
): RouteEndpoint {
  return { ...coords, label, placeId }
}

export function routeEndpointFromDraft(
  locationLabel: string,
  coords?: LatLng,
): RouteEndpoint | null {
  if (!coords?.lat || !coords?.lng) return null
  return {
    lat: coords.lat,
    lng: coords.lng,
    label: locationLabel || coords.label,
    placeId: coords.placeId,
  }
}
