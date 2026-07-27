<script setup lang="ts">
import { homeAnchors, routes, PRIMARY_NAV_PATHS } from '~/constants/routes'
import logoUrl from '~/assets/icons/Logo.svg?url'

const auth = useAuthStore()
const route = useRoute()
const menuOpen = ref(false)
const scrolled = ref(false)
const isMobile = useIsMobile()
const { open: openSignIn } = useCustomerSignIn()

const hasHeroBackdrop = computed(() =>
  (PRIMARY_NAV_PATHS as readonly string[]).includes(route.path),
)

const syncNavScroll = () => {
  if (!import.meta.client) return
  scrolled.value = hasHeroBackdrop.value ? window.scrollY > 24 : true
}

onMounted(() => {
  auth.hydrate()
  syncNavScroll()
  window.addEventListener('scroll', syncNavScroll, { passive: true })
  auth.listenForAuthChanges(() => {
    if (!auth.isLoggedIn && !auth.isGuestSession) menuOpen.value = false
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', syncNavScroll)
})

watch(() => route.path, () => {
  nextTick(syncNavScroll)
})

watch(menuOpen, (open: boolean) => {
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
    class="app-nav app-nav--home"
    :class="{ 'is-scrolled': scrolled }"
    role="banner"
  >
    <img
      v-if="hasHeroBackdrop && !scrolled"
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
          <NuxtLink class="app-nav__link" to="/">Home</NuxtLink>
          <NuxtLink class="app-nav__link" to="/services">Services</NuxtLink>
          <NuxtLink class="app-nav__link" to="/about-us">About Us</NuxtLink>
          <NuxtLink class="app-nav__link" to="/journey">Journey</NuxtLink>
          <NuxtLink class="app-nav__link" to="/tours">Tours</NuxtLink>
        </nav>

        <div class="app-nav__actions">
          <AppUserMenu :mobile-sheet="isMobile" login-variant="outline" />
          <a class="app-nav__journey-cta app-nav__action-btn" :href="homeAnchors.booking">
            Book Your Journey
          </a>
          <button
            type="button"
            class="app-nav__burger"
            :aria-expanded="menuOpen"
            aria-controls="mobile-nav-drawer"
            :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
            @click="menuOpen = !menuOpen"
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
      <nav class="app-nav__panel app-nav__panel--home" aria-label="Mobile">
        <div class="app-nav__drawer-head">
          <p class="app-nav__drawer-eyebrow">Menu</p>
          <button
            type="button"
            class="app-nav__drawer-close"
            aria-label="Close menu"
            @click="closeMenu"
          >
            <i class="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <div class="app-nav__drawer-body">
          <div class="app-nav__drawer-links">
            <NuxtLink class="app-nav__drawer-link" :to="routes.home" @click="closeMenu">Home</NuxtLink>
            <NuxtLink class="app-nav__drawer-link" :to="routes.services" @click="closeMenu">Services</NuxtLink>
            <NuxtLink class="app-nav__drawer-link" :to="routes.aboutUs" @click="closeMenu">About Us</NuxtLink>
            <NuxtLink class="app-nav__drawer-link" :to="routes.journey" @click="closeMenu">Journey</NuxtLink>
            <NuxtLink class="app-nav__drawer-link" :to="routes.tours" @click="closeMenu">Tours</NuxtLink>
          </div>
        </div>

        <div class="app-nav__drawer-foot">
          <div
            v-if="!(auth.isLoggedIn && auth.role === 'CUSTOMER') && !auth.isGuestSession"
            class="user-menu app-nav__drawer-login"
          >
            <button
              type="button"
              class="btn user-menu__login app-nav__action-btn user-menu__login--outline"
              @click="closeMenu(); openSignIn()"
            >
              Login
            </button>
          </div>
          <NuxtLink
            v-else-if="auth.isGuestSession"
            class="app-nav__drawer-link app-nav__drawer-link--guest"
            :to="routes.guestBooking"
            @click="closeMenu"
          >
            Your booking
          </NuxtLink>
          <a
            class="app-nav__drawer-cta app-nav__drawer-cta--gold"
            :href="homeAnchors.booking"
            @click="closeMenu"
          >
            Book Your Journey
          </a>
        </div>
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

.app-nav__journey-cta {
  display: none;
}

.app-nav__drawer-login {
  width: 100%;
  margin-bottom: 0;
}

.app-nav__drawer-login :deep(.user-menu__login) {
  display: inline-flex;
  width: 100%;
  justify-content: center;
}

@media (min-width: 860px) {
  .app-nav__journey-cta {
    display: inline-flex;
  }
}
</style>
