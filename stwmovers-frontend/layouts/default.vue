<script setup lang="ts">
useLocalBusinessSchema()

const route = useRoute()
const hideSiteFooter = computed(() =>
  ['/confirm', '/payment', '/booking'].includes(route.path),
)
</script>

<template>
  <div class="site-root">
    <AppNavbar />
    <main id="main-content" class="layout-main container" role="main">
      <slot />
    </main>
    <AppFooter v-if="!hideSiteFooter" />
    <MobileBottomNav />
    <WhatsappFloatingButton />
    <AppToast />
    <CustomerSignInModal />
  </div>
</template>
