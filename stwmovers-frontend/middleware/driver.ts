export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  auth.hydrate()
  if (!auth.isDriver) return navigateTo('/driver/login')
})
