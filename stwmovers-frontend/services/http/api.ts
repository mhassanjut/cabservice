import type { ApiResponse } from '~/types/api'
import { authService } from '~/services/api/auth.service'

type ApiOptions = {
  method?: string
  body?: unknown
  auth?: boolean
  timeout?: number
  silent?: boolean
  _retried401?: boolean
}

let slowTimer: ReturnType<typeof setTimeout> | null = null
let refreshing: Promise<boolean> | null = null

export async function api<T>(path: string, opts: ApiOptions = {}): Promise<T> {
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
      method: (opts.method ?? 'GET') as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      body: opts.body as Record<string, unknown> | undefined,
      headers,
      timeout: opts.timeout ?? 30000,
    })
    if (!res.success) throw new Error(res.message ?? 'Request failed')
    return res.data as T
  } catch (e: unknown) {
    const err = e as { status?: number; statusCode?: number; data?: { message?: string }; message?: string }
    const status = err.status ?? err.statusCode

    const isAuthFailure = status === 401 || status === 403
    if (isAuthFailure && auth.token && opts.auth !== false && !opts._retried401) {
      const refreshed = await tryRefreshSession(auth)
      if (refreshed) {
        return api<T>(path, { ...opts, _retried401: true })
      }
      auth.clear()
      auth.broadcastAuthChange()
      if (!opts.silent) toast.show('Session expired. Please sign in again.', 'error')
      const route = useRoute()
      const loginPath = route.fullPath.startsWith('/admin') ? '/admin/login' : '/login'
      await navigateTo({ path: loginPath, query: { redirect: route.fullPath } })
    } else if (!opts.silent) {
      if (status === 429) {
        toast.show('Too many requests. Please wait a moment and try again.', 'error')
      } else if (status === 422) {
        const msg = err.data?.message
        if (msg) toast.show(msg, 'error')
      } else if (status === 400) {
        const msg = err.data?.message
        if (msg) toast.show(msg, 'error')
      } else if (!status) {
        toast.show('Connection lost. Tap to retry.', 'error')
      } else if (status >= 500) {
        toast.show('Something went wrong. Please try again.', 'error')
      }
    }
    throw e
  } finally {
    if (slowTimer) clearTimeout(slowTimer)
  }
}

async function tryRefreshSession(auth: ReturnType<typeof useAuthStore>): Promise<boolean> {
  if (!auth.token) return false
  if (!refreshing) {
    refreshing = authService
      .refresh()
      .then((session) => {
        auth.setSession(session)
        return true
      })
      .catch(() => false)
      .finally(() => {
        refreshing = null
      })
  }
  return refreshing
}
