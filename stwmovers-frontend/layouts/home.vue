<script setup lang="ts">
useLocalBusinessSchema()
</script>

<template>
  <div class="site-root site-root--home">
    <AppNavbar />
    <main id="main-content" class="layout-main layout-main--home" role="main">
      <slot />
    </main>
    <HomeFooter />
    <MobileBottomNav />
    <WhatsappFloatingButton />
    <AppToast />
    <CustomerSignInModal />
  </div>
</template>
