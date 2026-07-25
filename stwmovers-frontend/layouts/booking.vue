<script setup lang="ts">
import { routes } from '~/constants/routes'

const route = useRoute()

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
    <BookingStepper :current="currentStep" />

    <main id="main-content" class="layout-main layout-main--booking" role="main">
      <slot />
    </main>

    <HomeFooter />
    <AppToast />
    <CustomerSignInModal />
  </div>
</template>
