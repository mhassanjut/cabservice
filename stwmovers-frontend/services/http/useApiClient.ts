import { createApiClient } from '~/services/http/client'

export function useApiClient() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl || ''
  const client = createApiClient({ baseURL })
  return client
}

