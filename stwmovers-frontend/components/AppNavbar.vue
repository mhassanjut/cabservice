<script setup lang="ts">
import { homeAnchors, routes } from '~/constants/routes'

const auth = useAuthStore()
const menuOpen = ref(false)
const scrolled = ref(false)
const isMobile = useIsMobile()
const { open: openSignIn } = useCustomerSignIn()

const onScroll = () => {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  auth.hydrate()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  auth.listenForAuthChanges(() => {
    auth.syncFromStorage()
    if (!auth.isLoggedIn && !auth.isGuestSession) menuOpen.value = false
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

watch(menuOpen, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
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

      <p v-if="auth.isLoggedIn" class="app-nav__greeting">Hi, {{ auth.firstName }}</p>

      <nav class="app-nav__links" aria-label="Primary">
        <NuxtLink class="app-nav__link" :to="routes.home">Home</NuxtLink>
        <NuxtLink class="app-nav__link" :to="routes.faq">FAQ</NuxtLink>
        <a class="app-nav__link" :href="homeAnchors.contact">Contact</a>
        <NuxtLink class="app-nav__link" :to="routes.tours">Tours</NuxtLink>
      </nav>

      <div class="app-nav__actions">
        <AppUserMenu :mobile-sheet="isMobile" />
        <a class="btn btn--solid-gold app-nav__cta app-nav__action-btn" :href="homeAnchors.booking">Reserve</a>
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
        <button
          v-if="!auth.isLoggedIn && !auth.isGuestSession"
          type="button"
          class="app-nav__drawer-link btn"
          @click="closeMenu(); openSignIn()"
        >
          Login
        </button>
        <NuxtLink
          v-else-if="auth.isGuestSession"
          class="app-nav__drawer-link"
          :to="routes.guestBooking"
          @click="closeMenu"
        >
          Your booking
        </NuxtLink>
        <NuxtLink class="app-nav__drawer-link" :to="routes.home" @click="closeMenu">Home</NuxtLink>
        <NuxtLink class="app-nav__drawer-link" :to="routes.faq" @click="closeMenu">FAQ</NuxtLink>
        <a class="app-nav__drawer-link" :href="homeAnchors.contact" @click="closeMenu">Contact</a>
        <NuxtLink class="app-nav__drawer-link" :to="routes.tours" @click="closeMenu">City tours</NuxtLink>
        <a class="btn btn--solid-gold app-nav__drawer-cta" :href="homeAnchors.booking" @click="closeMenu">
          Get a quote
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-nav__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-nav__greeting {
  display: none;
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-muted);
}

.app-nav__drawer-button {
  width: 100%;
  text-align: left;
  background: transparent;
  border: 0;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

@media (min-width: 860px) {
  .app-nav__greeting {
    display: block;
  }
}
</style>
