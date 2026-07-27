import { customerSignInRoute, hasLikelyCustomerSession } from '~/utils/customerAuthRedirect'

/** Redirect unauthenticated dashboard access before the customer layout can paint. */
export default defineNuxtPlugin({
  name: 'dashboard-access',
  dependsOn: ['pinia'],
  setup() {
    const router = useRouter()

    router.beforeEach((to) => {
      if (!to.path.startsWith('/dashboard')) return
      if (hasLikelyCustomerSession()) return
      return customerSignInRoute(to.fullPath)
    })
  },
})
