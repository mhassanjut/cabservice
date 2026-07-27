export function formatDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Earliest allowed travel date for `<input type="date" min="...">`. */
export function minPickupDateValue(now = new Date()): string {
  return formatDateInputValue(now)
}

export function isPastPickupDate(dateStr: string, now = new Date()): boolean {
  if (!dateStr) return false
  const selected = new Date(`${dateStr}T00:00:00`)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return selected < today
}

/** When travel date is today, pickup time must not be earlier than now. */
export function isPastPickupTimeToday(dateStr: string, timeStr: string, now = new Date()): boolean {
  if (!dateStr || !timeStr) return false
  if (formatDateInputValue(now) !== dateStr) return false
  const [hours, minutes] = timeStr.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false
  const scheduled = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
  return scheduled < now
}

/** Minimum `<input type="time" min="...">` when the selected date is today. */
export function minPickupTimeValue(dateStr: string, now = new Date()): string | undefined {
  if (!dateStr || formatDateInputValue(now) !== dateStr) return undefined
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export function areSameBookingPlaces(
  pickup: { lat: number; lng: number } | null | undefined,
  destination: { lat: number; lng: number } | null | undefined,
): boolean {
  if (!pickup || !destination) return false
  return pickup.lat === destination.lat && pickup.lng === destination.lng
}
