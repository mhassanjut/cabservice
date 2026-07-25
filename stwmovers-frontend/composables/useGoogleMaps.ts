type PlaceResult = { label: string; lat: number; lng: number; city?: string | null }

const READY_CALLBACK = '__stwmoversGoogleMapsReady'

/** Shared so the Maps script is only ever appended once per page load. */
let scriptLoad: Promise<void> | null = null

function placesAvailable() {
  const g = (window as unknown as { google?: { maps?: { places?: unknown } } }).google
  return Boolean(g?.maps?.places)
}

function loadMapsScript(key: string): Promise<void> {
  if (scriptLoad) return scriptLoad
  scriptLoad = new Promise<void>((resolve, reject) => {
    const w = window as unknown as Record<string, unknown>
    w[READY_CALLBACK] = () => {
      delete w[READY_CALLBACK]
      resolve()
    }
    const s = document.createElement('script')
    // With `loading=async` the script's own load event fires before the libraries are
    // usable, so Google's callback parameter is what tells us Places is ready.
    s.src =
      'https://maps.googleapis.com/maps/api/js' +
      `?key=${encodeURIComponent(key)}&libraries=places&loading=async&callback=${READY_CALLBACK}`
    s.async = true
    s.onerror = () => reject(new Error('Google Maps failed to load'))
    document.head.appendChild(s)
  }).catch((err: unknown) => {
    scriptLoad = null
    throw err
  })
  return scriptLoad
}

export function extractCityName(place: {
  address_components?: Array<{ long_name: string; types: string[] }>
  name?: string
}) {
  const components = place.address_components ?? []
  const locality = components.find((c) => c.types.includes('locality'))
  if (locality) return locality.long_name
  const admin2 = components.find((c) => c.types.includes('administrative_area_level_2'))
  if (admin2) return admin2.long_name
  return place.name ?? null
}

export function useGoogleMaps() {  const config = useRuntimeConfig()
  const ready = ref(false)
  const error = ref<string | null>(null)

  const load = async () => {
    const key = config.public.googleMapsApiKey as string
    if (!key) {
      error.value = 'NUXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing. Add it to .env'
      return
    }
    if (import.meta.server) return
    if (placesAvailable()) {
      ready.value = true
      return
    }
    try {
      await loadMapsScript(key)
      error.value = null
      ready.value = true
    } catch {
      error.value = 'Google Maps could not be loaded. Check the API key and your connection.'
    }
  }

  const autocomplete = (input: HTMLInputElement, onPick: (p: PlaceResult) => void) => {
    if (!ready.value) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google
    const ac = new g.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'es' },
      fields: ['formatted_address', 'geometry', 'address_components', 'name'],
    })
    ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      const loc = place.geometry?.location
      if (!loc || !place.formatted_address) return
      onPick({
        label: place.formatted_address,
        lat: loc.lat(),
        lng: loc.lng(),
        city: extractCityName(place),
      })
    })
  }

  const cityAutocomplete = (input: HTMLInputElement, onPick: (city: string) => void) => {
    if (!ready.value) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google
    const ac = new g.maps.places.Autocomplete(input, {
      types: ['(cities)'],
      componentRestrictions: { country: 'es' },
      fields: ['address_components', 'name'],
    })
    ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      const city = extractCityName(place)
      if (!city) return
      input.value = city
      onPick(city)
    })
  }

  return { ready, error, load, autocomplete, cityAutocomplete }
}
