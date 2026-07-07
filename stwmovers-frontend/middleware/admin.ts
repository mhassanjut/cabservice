export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const auth = useAuthStore()
  auth.hydrate()

  if (to.path === '/admin/login') {
    if (auth.isAdmin) return navigateTo('/admin')
    return
  }

  if (!auth.token) {
    return navigateTo({ path: '/admin/login', query: { redirect: to.fullPath } })
  }

  if (!auth.isAdmin) {
    return navigateTo('/')
  }
})
