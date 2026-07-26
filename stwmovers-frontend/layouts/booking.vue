<script setup lang="ts">
import { routes } from '~/constants/routes'

const route = useRoute()

const isDashboardRoute = computed(() => route.path.startsWith('/dashboard'))
const isGuestBookingRoute = computed(() => route.path === routes.guestBooking)
const showBookingStepper = computed(() => !isDashboardRoute.value && !isGuestBookingRoute.value)

const currentStep = computed(() => {
  if (route.path === routes.booking) return 2
  if (route.path === routes.payment) return 3
  if (route.path === routes.confirm) return 4
  return 1
})
</script>

<template>
  <div
    class="site-root site-root--booking"
    :class="{ 'site-root--customer-dashboard': isDashboardRoute }"
  >
    <BookingNavbar />
    <DashboardTabsBar v-if="isDashboardRoute" />
    <BookingStepper
      v-else-if="showBookingStepper"
      :current="currentStep"
      :confirmed-style="route.path === routes.confirm"
    />

    <main id="main-content" class="layout-main layout-main--booking" role="main">
      <div
        v-if="isDashboardRoute || isGuestBookingRoute"
        class="booking-shell__inner dashboard-shell__inner"
      >
        <slot />
      </div>
      <slot v-else />
    </main>

    <HomeFooter />
    <MobileBottomNav v-if="isDashboardRoute" />
    <WhatsappFloatingButton v-if="isDashboardRoute" />
    <AppToast />
    <CustomerSignInModal />
  </div>
</template>
