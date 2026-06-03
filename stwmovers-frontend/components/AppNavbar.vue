<script setup lang="ts">
import { externalLinks } from '~/constants/externalLinks'
import { routes } from '~/constants/routes'

const menuOpen = ref(false)
const scrolled = ref(false)

const onScroll = () => {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

watch(menuOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

const closeMenu = () => {
  menuOpen.value = false
}
</script>

<template>
  <header class="app-nav" :class="{ 'is-scrolled': scrolled }" role="banner">
    <div class="app-nav__inner">
      <NuxtLink to="/" class="app-nav__brand" @click="closeMenu">
        <span class="app-nav__mark" aria-hidden="true">STW</span>
        <span class="app-nav__titles">
          <span class="app-nav__name">STW Movers</span>
          <span class="app-nav__tag">Barcelona · Spain</span>
        </span>
      </NuxtLink>

      <nav class="app-nav__links" aria-label="Primary">
        <NuxtLink class="app-nav__link" :to="routes.home">Home</NuxtLink>
        <NuxtLink class="app-nav__link" :to="routes.cars">Fleet</NuxtLink>
        <NuxtLink class="app-nav__link" to="/#booking-section">Book</NuxtLink>
        <NuxtLink class="app-nav__link" to="/#contact">Contact</NuxtLink>
        <a
          class="app-nav__link"
          :href="externalLinks.tourCta"
          rel="noopener noreferrer"
          target="_blank"
        >
          Tours
        </a>
      </nav>

      <div style="display: flex; align-items: center; gap: 10px;">
        <NuxtLink class="btn btn--solid-gold app-nav__cta" :to="routes.cars">Reserve</NuxtLink>
        <button
          type="button"
          class="app-nav__burger"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav-drawer"
          aria-label="Open menu"
          @click="menuOpen = true"
        >
          <i class="fa-solid fa-bars" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div
      id="mobile-nav-drawer"
      class="app-nav__drawer"
      :class="{ 'is-open': menuOpen }"
      aria-hidden="true"
    >
      <div class="app-nav__backdrop" @click="closeMenu" />
      <nav class="app-nav__panel" aria-label="Mobile">
        <NuxtLink class="app-nav__drawer-link" :to="routes.home" @click="closeMenu">Home</NuxtLink>
        <NuxtLink class="app-nav__drawer-link" :to="routes.cars" @click="closeMenu">Fleet</NuxtLink>
        <NuxtLink class="app-nav__drawer-link" to="/#booking-section" @click="closeMenu">Book</NuxtLink>
        <NuxtLink class="app-nav__drawer-link" to="/#contact" @click="closeMenu">Contact</NuxtLink>
        <a
          class="app-nav__drawer-link"
          :href="externalLinks.tourCta"
          rel="noopener noreferrer"
          target="_blank"
          @click="closeMenu"
        >
          City tours
        </a>
        <NuxtLink class="btn btn--solid-gold app-nav__drawer-cta" :to="routes.cars" @click="closeMenu">
          Reserve a vehicle
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
