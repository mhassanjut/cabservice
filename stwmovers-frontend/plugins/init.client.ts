export default defineNuxtPlugin({
  name: 'stwmovers-init',
  dependsOn: ['pinia'],
  async setup() {
    const auth = useAuthStore()
    auth.hydrate()

    if (auth.cookieAuthEnabled) {
      await auth.bootstrapSession()
    }

    if (auth.isLoggedIn && auth.role === 'CUSTOMER') {
      useCustomerSignIn().close()
    }

    auth.listenForAuthChanges(() => {
      if (auth.cookieAuthEnabled) {
        auth.authReady = false
        void auth.bootstrapSession()
      }
    })
  },
})
