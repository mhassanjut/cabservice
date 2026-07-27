export default defineNuxtPlugin({
  name: 'stwmovers-init',
  dependsOn: ['pinia'],
  async setup() {
    const auth = useAuthStore()
    auth.hydrate()

    if (auth.cookieAuthEnabled) {
      if (auth.isLoggedIn) {
        await auth.verifySession()
      } else {
        await auth.restoreSession()
      }
    }

    if (auth.isLoggedIn && auth.role === 'CUSTOMER') {
      useCustomerSignIn().close()
    }
    auth.listenForAuthChanges(() => auth.syncFromStorage())
  },
})
