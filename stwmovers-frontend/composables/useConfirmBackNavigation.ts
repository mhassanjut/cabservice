import { routes } from '~/constants/routes'

export function resolvePostCheckoutDestination() {
  const auth = useAuthStore()
  auth.hydrate()
  if (auth.isLoggedIn) return routes.dashboard
  if (auth.isGuestSession) return routes.guestBooking
  return routes.home
}

/** Trap browser Back on /confirm so checkout / Stripe steps are skipped. */
export function useConfirmBackNavigation() {
  onMounted(() => {
    if (!import.meta.client) return

    window.history.pushState({ stwConfirmBack: true }, '', window.location.href)

    const onPopState = () => {
      void navigateTo(resolvePostCheckoutDestination(), { replace: true })
    }

    window.addEventListener('popstate', onPopState)

    onUnmounted(() => {
      window.removeEventListener('popstate', onPopState)
    })
  })
}
