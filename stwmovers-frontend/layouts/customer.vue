<script setup lang="ts">
useLocalBusinessSchema()
</script>

<template>
  <div class="site-root site-root--home site-root--booking site-root--customer-dashboard">
    <AppNavbar />
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
