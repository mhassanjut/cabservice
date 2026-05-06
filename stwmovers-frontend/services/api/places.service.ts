export type PlaceSuggestion = {
  id: string
  label: string
  countryCode: 'ES'
}

export type PlacesAutocompleteInput = {
  query: string
  country: 'ES'
  limit?: number
}

export const placesService = {
  async autocomplete(input: PlacesAutocompleteInput): Promise<PlaceSuggestion[]> {
    const q = input.query.trim()
    if (!q) return []

    // Placeholder: replace with Spring Boot -> provider proxy (e.g., Google Places) restricted to Spain.
    const seed = [
      'Barcelona El Prat Airport (BCN)',
      'Barcelona City Center',
      'Sants Station, Barcelona',
      'Girona',
      'Tarragona',
      'Sitges',
    ].filter((x) => x.toLowerCase().includes(q.toLowerCase()))

    return seed.slice(0, input.limit ?? 6).map((label, idx) => ({
      id: `${q}-${idx}`,
      label,
      countryCode: 'ES',
    }))
  },
}

