<script setup lang="ts">
import '~/assets/styles/css/home.css'
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
