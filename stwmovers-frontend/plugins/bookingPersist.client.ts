export default defineNuxtPlugin(() => {
  const booking = useBookingStore()
  booking.hydrateFromStorage()

  watch(
    () => ({ draft: booking.draft, vehicle: booking.vehicle }),
    () => booking.persistToStorage(),
    { deep: true },
  )
})

