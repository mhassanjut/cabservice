type PlaceResult = { label: string; lat: number; lng: number }

export function useGoogleMaps() {
  const config = useRuntimeConfig()
  const ready = ref(false)
  const error = ref<string | null>(null)

  const load = async () => {
    const key = config.public.googleMapsApiKey as string
    if (!key) {
      error.value = 'NUXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing. Add it to .env'
      return
    }
    if (import.meta.server) return
    if ((window as unknown as { google?: unknown }).google) {
      ready.value = true
      return
    }
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script')
      s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
      s.async = true
      s.onload = () => { ready.value = true; resolve() }
      s.onerror = () => reject(new Error('Google Maps failed to load'))
      document.head.appendChild(s)
    })
  }

  const autocomplete = (input: HTMLInputElement, onPick: (p: PlaceResult) => void) => {
    if (!ready.value) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google
    const ac = new g.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'es' },
      fields: ['formatted_address', 'geometry'],
    })
    ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      const loc = place.geometry?.location
      if (!loc || !place.formatted_address) return
      onPick({ label: place.formatted_address, lat: loc.lat(), lng: loc.lng() })
    })
  }

  return { ready, error, load, autocomplete }
}
