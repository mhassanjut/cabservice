<script setup lang="ts">
useLocalBusinessSchema()
</script>

<template>
  <div class="site-root site-root--home">
    <AppNavbar />
    <main id="main-content" class="layout-main container" role="main">
      <slot />
    </main>
    <AppFooter />
    <MobileBottomNav />
    <WhatsappFloatingButton />
    <AppToast />
    <CustomerSignInModal />
  </div>
</template>
