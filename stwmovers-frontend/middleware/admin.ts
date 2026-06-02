export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  auth.hydrate()
  if (!auth.isAdmin) return navigateTo('/admin/login')
})
