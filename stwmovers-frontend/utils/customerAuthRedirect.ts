import { routes } from '~/constants/routes'

const BLOCKED_PREFIXES = ['/login', '/admin', '/driver'] as const

/** Safe internal return path for customer sign-in (blocks auth/admin/driver/login loops). */
export function sanitizeCustomerRedirect(target?: string | null): string | undefined {
  if (!target || typeof target !== 'string') return undefined
  if (!target.startsWith('/') || target.startsWith('//')) return undefined

  const path = target.split('?')[0]?.split('#')[0] ?? target
  for (const blocked of BLOCKED_PREFIXES) {
    if (path === blocked || path.startsWith(`${blocked}/`)) return undefined
  }
  return target
}

/** Route query that opens the customer sign-in modal on the homepage. */
export function customerSignInRoute(returnTo?: string | null) {
  const redirect = sanitizeCustomerRedirect(returnTo)
  return {
    path: routes.home,
    query: {
      signin: '1',
      ...(redirect ? { redirect } : {}),
    },
  }
}

/** Fast client-side hint before async session bootstrap (cookie-auth). */
export function hasLikelyCustomerSession(): boolean {
  if (!import.meta.client) return false
  const auth = useAuthStore()
  auth.hydrate()
  if (auth.sessionVerified && auth.userId && auth.role === 'CUSTOMER') return true
  if (auth.cookieAuthEnabled) {
    return document.cookie.split(';').some((c) => c.trim().startsWith('access_token='))
  }
  return Boolean(auth.token)
}
