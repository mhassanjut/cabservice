export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const auth = useAuthStore()
  await auth.ensureSession()
  if (!auth.isDriver) return navigateTo('/driver/login')
})
