export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const auth = useAuthStore()
  await auth.ensureSession()

  if (to.path === '/admin/login') {
    if (auth.isAdmin) return navigateTo('/admin')
    return
  }

  if (!auth.isLoggedIn) {
    return navigateTo({ path: '/admin/login', query: { redirect: to.fullPath } })
  }

  if (!auth.isAdmin) {
    return navigateTo('/')
  }
})
