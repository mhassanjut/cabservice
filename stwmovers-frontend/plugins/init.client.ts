export default defineNuxtPlugin(() => {
  useAuthStore().hydrate()
  useBookingStore().hydrateFromStorage()
})
