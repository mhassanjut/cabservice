import type { TourDto } from '~/types/api'

/** "8 Hours" from durationHours, falling back to the admin-entered durationLabel, or nothing. */
export function formatTourDuration(tour: Pick<TourDto, 'durationHours' | 'durationLabel'>): string | null {
  if (tour.durationHours != null && tour.durationHours > 0) {
    return `${tour.durationHours} Hour${tour.durationHours === 1 ? '' : 's'}`
  }
  return tour.durationLabel?.trim() || null
}

/** "2–6 Guests" / "4 Guests" / "Up to 6 Guests" depending on which bounds are set. */
export function formatTourGuests(tour: Pick<TourDto, 'guestMin' | 'guestMax'>): string | null {
  const { guestMin, guestMax } = tour
  if (guestMin != null && guestMax != null) {
    return guestMin === guestMax ? `${guestMin} Guests` : `${guestMin}–${guestMax} Guests`
  }
  if (guestMax != null) return `Up to ${guestMax} Guests`
  if (guestMin != null) return `${guestMin}+ Guests`
  return null
}

/** "Barcelona · Full Day" meta line shown under the title — omits whichever half is missing. */
export function formatTourMeta(tour: Pick<TourDto, 'location' | 'durationLabel'>): string | null {
  const parts = [tour.location?.trim(), tour.durationLabel?.trim()].filter(Boolean)
  return parts.length ? parts.join(' · ') : null
}

/** "€590" — whole euros when the price has no fractional cents, otherwise 2 decimals. */
export function formatTourPrice(price: number | null | undefined): string {
  if (price == null) return '—'
  const rounded = Math.round(price * 100) / 100
  const display = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(2)
  return `€${display}`
}
