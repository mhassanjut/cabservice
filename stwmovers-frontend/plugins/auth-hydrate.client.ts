export default defineNuxtPlugin({
  name: 'auth-hydrate',
  dependsOn: ['pinia'],
  setup() {
    useAuthStore().hydrate()
  },
})
