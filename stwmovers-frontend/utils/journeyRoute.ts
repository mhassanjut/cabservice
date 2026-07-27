/** Parse titles like "Barcelona to Santa Susanna" into pickup and destination. */
export function parseTransferRouteTitle(title: string): { pickup: string; destination: string } | null {
  const marker = ' to '
  const index = title.indexOf(marker)
  if (index === -1) return null
  const pickup = title.slice(0, index).trim()
  const destination = title.slice(index + marker.length).trim()
  if (!pickup || !destination) return null
  return { pickup, destination }
}
