export default defineNuxtRouteMiddleware((to) => {
  // Auth lives in localStorage — only enforce after client hydration to avoid login flash on refresh.
  if (import.meta.server) return

  const auth = useAuthStore()
  auth.hydrate()
  if (!auth.isLoggedIn || auth.role !== 'CUSTOMER') {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})