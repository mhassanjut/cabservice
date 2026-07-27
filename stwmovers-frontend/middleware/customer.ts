import { customerSignInRoute, hasLikelyCustomerSession } from '~/utils/customerAuthRedirect'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const auth = useAuthStore()
  auth.hydrate()

  if (!hasLikelyCustomerSession()) {
    return navigateTo(customerSignInRoute(to.fullPath))
  }

  await auth.ensureSession()
  if (!auth.isLoggedIn || auth.role !== 'CUSTOMER') {
    return navigateTo(customerSignInRoute(to.fullPath))
  }
})
