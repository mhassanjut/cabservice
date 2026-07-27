import { sanitizeCustomerRedirect } from '~/utils/customerAuthRedirect'

export default defineNuxtPlugin({
  name: 'sign-in-query',
  dependsOn: ['pinia', 'stwmovers-init'],
  setup() {
    const route = useRoute()
    const router = useRouter()

    const handleSignInQuery = async () => {
      if (route.query.signin !== '1') return

      const auth = useAuthStore()
      auth.hydrate()
      if (auth.cookieAuthEnabled) await auth.bootstrapSession()

      const redirect = sanitizeCustomerRedirect(
        typeof route.query.redirect === 'string' ? route.query.redirect : undefined,
      )

      const cleanQuery = { ...route.query }
      delete cleanQuery.signin
      delete cleanQuery.redirect
      await router.replace({ path: route.path, query: cleanQuery })

      if (auth.isLoggedIn && auth.role === 'CUSTOMER') {
        if (redirect) await navigateTo(redirect)
        return
      }

      useCustomerSignIn().open(redirect ?? null)
    }

    watch(() => route.query.signin, () => { void handleSignInQuery() }, { immediate: true })
  },
})
