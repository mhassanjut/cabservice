export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  auth.hydrate()
  if (!auth.isLoggedIn) return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
})
