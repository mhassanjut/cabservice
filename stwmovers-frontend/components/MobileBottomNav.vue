<script setup lang="ts">
import { routes } from '~/constants/routes'

const route = useRoute()

const isHash = (hash: string) => route.path === '/' && route.hash === hash
</script>

<template>
  <nav class="mobile-bar" aria-label="Bottom navigation">
    <NuxtLink :to="routes.home" :class="{ 'is-active': route.path === '/' && !route.hash }">
      <i class="fa-solid fa-house" aria-hidden="true" />
      <span>Home</span>
    </NuxtLink>
    <NuxtLink :to="routes.bookings" :class="{ 'is-active': route.path.startsWith('/bookings') }">
      <i class="fa-solid fa-list" aria-hidden="true" />
      <span>Bookings</span>
    </NuxtLink>
    <NuxtLink :to="routes.login" :class="{ 'is-active': route.path === '/login' }">
      <i class="fa-solid fa-user" aria-hidden="true" />
      <span>Profile</span>
    </NuxtLink>
  </nav>
</template>
