<script setup lang="ts">
import '~/assets/styles/css/home.css'

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
