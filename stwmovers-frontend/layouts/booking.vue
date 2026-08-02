<script setup lang="ts">
import '~/assets/styles/css/home.css'
import '~/assets/styles/css/booking.css'
import { routes } from '~/constants/routes'

const route = useRoute()

const isGuestBookingRoute = computed(() => route.path === routes.guestBooking)
const showBookingStepper = computed(() => !isGuestBookingRoute.value)

const currentStep = computed(() => {
  if (route.path === routes.booking) return 2
  if (route.path === routes.payment) return 3
  if (route.path === routes.confirm) return 4
  return 1
})
</script>

<template>
  <div class="site-root site-root--booking">
    <BookingNavbar />
    <BookingStepper
      v-if="showBookingStepper"
      :current="currentStep"
      :confirmed-style="route.path === routes.confirm"
    />

    <main id="main-content" class="layout-main layout-main--booking" role="main">
      <div
        v-if="isGuestBookingRoute"
        class="booking-shell__inner dashboard-shell__inner"
      >
        <slot />
      </div>
      <slot v-else />
    </main>

    <HomeFooter />
    <AppToast />
    <CustomerSignInModal />
  </div>
</template>
