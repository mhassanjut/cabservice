export type DirectionsLegMetrics = {
  distanceKm: number
  durationMinutes: number
  distanceMeters: number
  durationSeconds: number
}

type DirectionsLeg = {
  distance?: { value: number }
  duration?: { value: number }
}

type DirectionsRoute = {
  legs?: DirectionsLeg[]
}

/** Parse one Directions leg; distance is always taken from leg.distance (metres), never duration. */
export function metricsFromDirectionsLeg(leg: DirectionsLeg): DirectionsLegMetrics | null {
  const distanceMeters = leg.distance?.value
  const durationSeconds = leg.duration?.value
  if (distanceMeters == null || distanceMeters <= 0 || durationSeconds == null || durationSeconds <= 0) {
    return null
  }
  return {
    distanceMeters,
    durationSeconds,
    distanceKm: Math.round((distanceMeters / 1000) * 10) / 10,
    durationMinutes: Math.max(1, Math.round(durationSeconds / 60)),
  }
}

/** Pick the shortest driving route when the API returns alternatives. */
export function shortestRouteMetrics(routes: DirectionsRoute[]): DirectionsLegMetrics | null {
  let best: DirectionsLegMetrics | null = null
  for (const route of routes) {
    const leg = route.legs?.[0]
    if (!leg) continue
    const metrics = metricsFromDirectionsLeg(leg)
    if (!metrics) continue
    if (!best || metrics.distanceMeters < best.distanceMeters) {
      best = metrics
    }
  }
  return best
}
