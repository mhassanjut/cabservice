export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const auth = useAuthStore()
  auth.hydrate()
  if (auth.isGuestSession && !auth.isLoggedIn) {
    return navigateTo('/')
  }
})