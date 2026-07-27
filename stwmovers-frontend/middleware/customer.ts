export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const auth = useAuthStore()
  await auth.ensureSession()
  if (!auth.isLoggedIn || auth.role !== 'CUSTOMER') {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
