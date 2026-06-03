export default defineNuxtPlugin(() => {
  const booking = useBookingStore()
  booking.hydrateFromStorage()

  watch(
    () => ({
      draft: booking.draft,
      vehicle: booking.vehicle,
      otherCar: booking.otherCar,
      filters: booking.filters,
      cars: booking.cars,
      bookingReference: booking.bookingReference,
      guest: booking.guest,
    }),
    () => booking.persistToStorage(),
    { deep: true },
  )
})

