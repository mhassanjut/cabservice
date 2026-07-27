import { routes } from '~/constants/routes'
import { customerSignInRoute, sanitizeCustomerRedirect } from '~/utils/customerAuthRedirect'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const auth = useAuthStore()
  await auth.ensureSession()

  const redirect = sanitizeCustomerRedirect(to.query.redirect as string)

  if (auth.isLoggedIn && auth.role === 'CUSTOMER') {
    return navigateTo(redirect ?? routes.home)
  }

  return navigateTo(customerSignInRoute(redirect))
})
