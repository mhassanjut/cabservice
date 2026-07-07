import { routes } from '~/constants/routes'
import { resolvePostCheckoutDestination } from '~/composables/useConfirmBackNavigation'

const checkoutPaths = [routes.cars, routes.booking, routes.payment] as const

function isCheckoutPath(path: string): path is (typeof checkoutPaths)[number] {
  return checkoutPaths.includes(path as (typeof checkoutPaths)[number])
}

export default defineNuxtPlugin({
  dependsOn: ['pinia'],
  setup() {
    const router = useRouter()

    router.beforeEach((to, from) => {
      if (import.meta.server) return true

      const booking = useBookingStore()
      booking.hydrateFromStorage()

      if (booking.isCheckoutComplete() && isCheckoutPath(to.path)) {
        return navigateTo(resolvePostCheckoutDestination(), { replace: true })
      }

      if (from.path === routes.confirm && (isCheckoutPath(to.path) || to.path === routes.home)) {
        return navigateTo(resolvePostCheckoutDestination(), { replace: true })
      }
    })
  },
})
