<script setup lang="ts">
import '~/assets/styles/css/home.css'
import logoUrl from '~/assets/icons/Logo.svg?url'
import { siteConfig } from '~/config/site'

useLocalBusinessSchema()
const { open: openSignIn } = useCustomerSignIn()
</script>

<template>
  <div class="site-root site-root--ads">
    <header class="ads-header">
      <NuxtLink to="/" class="ads-header__brand" aria-label="STW Movers home">
        <img :src="logoUrl" alt="STW Movers" width="170" height="58">
      </NuxtLink>
      <nav class="ads-header__actions" aria-label="Booking support">
        <a :href="`tel:${siteConfig.contactPhone}`">
          <i class="fa-solid fa-phone" aria-hidden="true" />
          <span>Call our team</span>
        </a>
        <button type="button" @click="openSignIn()">Sign in</button>
      </nav>
    </header>
    <main id="main-content" class="layout-main layout-main--home">
      <slot />
    </main>
    <HomeFooter />
    <AppToast />
    <CustomerSignInModal />
  </div>
</template>
