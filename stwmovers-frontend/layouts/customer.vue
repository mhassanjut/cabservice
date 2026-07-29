<script setup lang="ts">
import '~/assets/styles/css/home.css'
import '~/assets/styles/css/booking.css'
import '~/assets/styles/css/dashboard.css'

useLocalBusinessSchema()
</script>

<template>
  <div class="site-root site-root--home site-root--booking site-root--customer-dashboard">
    <BookingNavbar />
    <DashboardTabsBar />

    <main id="main-content" class="layout-main layout-main--booking" role="main">
      <div class="booking-shell__inner dashboard-shell__inner">
        <slot />
      </div>
    </main>

    <HomeFooter />
    <MobileBottomNav />
    <WhatsappFloatingButton />
    <AppToast />
    <CustomerSignInModal />
  </div>
</template>
