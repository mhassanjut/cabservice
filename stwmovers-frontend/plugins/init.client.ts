export default defineNuxtPlugin({
  name: 'stwmovers-init',
  dependsOn: ['pinia'],
  setup() {
    const auth = useAuthStore()
    auth.hydrate()
    if (auth.isLoggedIn) {
      useCustomerSignIn().close()
    }
    auth.listenForAuthChanges(() => auth.syncFromStorage())
  },
})
