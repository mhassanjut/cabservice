import type { ApiResponse } from '~/types/api'

let slowTimer: ReturnType<typeof setTimeout> | null = null

export async function api<T>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean; timeout?: number } = {},
): Promise<T> {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const toast = useToastStore()
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (opts.body) headers['Content-Type'] = 'application/json'
  if (opts.auth !== false && auth.token) headers.Authorization = `Bearer ${auth.token}`

  slowTimer = setTimeout(() => toast.show('Still working…', 'info'), 8000)
  try {
    const res = await $fetch<ApiResponse<T>>(path, {
      baseURL: config.public.apiBaseUrl as string,
      method: (opts.method ?? 'GET') as 'GET' | 'POST' | 'PUT' | 'DELETE',
      body: opts.body as Record<string, unknown> | undefined,
      headers,
      timeout: opts.timeout ?? 30000,
    })
    if (!res.success) throw new Error(res.message ?? 'Request failed')
    return res.data as T
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string }
    if (err.status === 401 && auth.token) {
      auth.clear()
      await navigateTo('/login')
    } else if (!err.status) toast.show('Connection lost. Tap to retry.', 'error')
    else if (err.status && err.status >= 500) toast.show('Something went wrong. Please try again.', 'error')
    throw e
  } finally {
    if (slowTimer) clearTimeout(slowTimer)
  }
}
