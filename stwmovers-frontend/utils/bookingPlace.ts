type AddressComponent = { types: string[] }

export function isBroadBookingPlace(place: { address_components?: AddressComponent[]; types?: string[] }): boolean {
  const types = place.types || []
  const broadTypes = ['country', 'administrative_area_level_1', 'administrative_area_level_2']
  if (types.some(type => ['street_address', 'premise', 'establishment', 'airport', 'locality', 'postal_town'].includes(type))) return false
  if (types.some(type => broadTypes.includes(type))) return true
  const components = place.address_components || []
  return components.length > 0 && !components.some(component =>
    component.types.some(type => ['locality', 'postal_town', 'route', 'premise', 'street_number', 'airport'].includes(type)),
  )
}
