import { routes } from '~/constants/routes'
import { resolvePostCheckoutDestination } from '~/composables/useConfirmBackNavigation'

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const booking = useBookingStore()
  booking.hydrateFromStorage()

  if (booking.isCheckoutComplete()) {
    return navigateTo(resolvePostCheckoutDestination(), { replace: true })
  }

  if (to.path === routes.payment && !booking.bookingReference) {
    return navigateTo(routes.home, { replace: true })
  }
})
