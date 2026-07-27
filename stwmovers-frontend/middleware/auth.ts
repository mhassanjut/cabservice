import { customerSignInRoute, hasLikelyCustomerSession } from '~/utils/customerAuthRedirect'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const auth = useAuthStore()
  auth.hydrate()

  if (!hasLikelyCustomerSession()) {
    return navigateTo(customerSignInRoute(to.fullPath))
  }

  await auth.ensureSession()
  if (!auth.isLoggedIn) {
    return navigateTo(customerSignInRoute(to.fullPath))
  }
  if (auth.role !== 'CUSTOMER') {
    return navigateTo('/')
  }
})
