export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const auth = useAuthStore()
  await auth.ensureSession()
  if (auth.isGuestSession && !auth.isLoggedIn) {
    return navigateTo('/')
  }
})
