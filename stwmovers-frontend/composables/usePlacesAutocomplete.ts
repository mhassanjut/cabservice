import { placesService, type PlaceSuggestion } from '~/services/api/places.service'

export function usePlacesAutocomplete() {
  const loading = ref(false)
  const results = ref<PlaceSuggestion[]>([])
  const error = ref<string | null>(null)

  const search = async (query: string) => {
    loading.value = true
    error.value = null
    try {
      results.value = await placesService.autocomplete({ query, country: 'ES', limit: 6 })
    } catch {
      error.value = 'Autocomplete temporarily unavailable.'
      results.value = []
    } finally {
      loading.value = false
    }
  }

  const clear = () => {
    results.value = []
  }

  return { loading, results, error, search, clear }
}

