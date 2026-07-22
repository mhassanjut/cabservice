<script setup lang="ts">
import { homeAnchors, routes } from '~/constants/routes'
import logoUrl from '~/assets/icons/Logo.svg?url'

const auth = useAuthStore()
const route = useRoute()
const menuOpen = ref(false)
const scrolled = ref(false)
const isMobile = useIsMobile()
const { open: openSignIn } = useCustomerSignIn()

const isHome = computed(() => route.path === '/')

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
  <header
    class="app-nav"
    :class="{ 'is-scrolled': scrolled, 'app-nav--home': isHome }"
    role="banner"
  >
    <img
      v-if="isHome"
      class="app-nav__figma-bg"
      src="/img/home/navbar-bg.jpg"
      alt=""
      aria-hidden="true"
      decoding="async"
    />

    <div class="app-nav__inner">
      <NuxtLink to="/" class="app-nav__brand" @click="closeMenu">
        <img
          class="app-nav__logo"
          :src="logoUrl"
          alt="STW Movers"
          width="146"
          height="40"
          decoding="async"
        />
      </NuxtLink>

      <div class="app-nav__cluster">
        <nav class="app-nav__links" aria-label="Primary">
          <template v-if="isHome">
            <NuxtLink class="app-nav__link" to="/">Home</NuxtLink>
            <NuxtLink class="app-nav__link" to="/services">Services</NuxtLink>
            <NuxtLink class="app-nav__link" to="/about-us">About Us</NuxtLink>
            <NuxtLink class="app-nav__link" to="/journey">Journey</NuxtLink>
            <NuxtLink class="app-nav__link" to="/tours">Tours</NuxtLink>
          </template>

          <template v-else>
            <NuxtLink class="app-nav__link" to="/">Home</NuxtLink>
            <NuxtLink class="app-nav__link" to="/faq">FAQ</NuxtLink>
            <NuxtLink class="app-nav__link" to="/contact">Contact</NuxtLink>
            <NuxtLink class="app-nav__link" to="/tours">Tours</NuxtLink>
          </template>
        </nav>

        <div class="app-nav__actions">
          <p v-if="auth.isLoggedIn && !isHome" class="app-nav__greeting">Hi, {{ auth.firstName }}</p>
          <AppUserMenu :mobile-sheet="isMobile" :login-variant="isHome ? 'outline' : 'default'" />
          <a class="app-nav__journey-cta app-nav__action-btn" :href="homeAnchors.booking">
            Book Your Journey
          </a>
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
        <template v-if="isHome">
          <a class="app-nav__drawer-link" :href="homeAnchors.experience" @click="closeMenu">Experience</a>
          <a class="app-nav__drawer-link" :href="homeAnchors.journeys" @click="closeMenu">Journeys</a>
          <NuxtLink class="app-nav__drawer-link" :to="routes.tours" @click="closeMenu">Tours</NuxtLink>
          <a class="app-nav__drawer-link" :href="homeAnchors.fleet" @click="closeMenu">Fleet</a>
          <a class="app-nav__drawer-link" :href="homeAnchors.global" @click="closeMenu">Global</a>
        </template>
        <template v-else>
          <NuxtLink class="app-nav__drawer-link" :to="routes.home" @click="closeMenu">Home</NuxtLink>
          <NuxtLink class="app-nav__drawer-link" :to="routes.faq" @click="closeMenu">FAQ</NuxtLink>
          <a class="app-nav__drawer-link" :href="homeAnchors.contact" @click="closeMenu">Contact</a>
          <NuxtLink class="app-nav__drawer-link" :to="routes.tours" @click="closeMenu">City tours</NuxtLink>
        </template>
        <a class="app-nav__drawer-cta app-nav__journey-cta" :href="homeAnchors.booking" @click="closeMenu">
          Book Your Journey
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-nav__logo {
  display: block;
  width: auto;
  height: 40px;
  max-width: min(146px, 40vw);
}

.app-nav__cluster {
  display: flex;
  align-items: center;
  min-width: 0;
}

.app-nav__actions {
  display: flex;
  align-items: center;
}

.app-nav__greeting {
  display: none;
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-muted);
}

.app-nav__journey-cta {
  display: none;
}

@media (min-width: 860px) {
  .app-nav__greeting {
    display: block;
  }

  .app-nav__journey-cta {
    display: inline-flex;
  }
}
</style>
