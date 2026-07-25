<script setup lang="ts">
import { routes } from '~/constants/routes'

const auth = useAuthStore()
const { open: openSignIn } = useCustomerSignIn()

// This navbar only ever renders inside the light booking shell (see layouts/booking.vue),
// so it always needs the dark logo variant — the white Logo.svg is for the dark homepage nav.
const logoSrc = '/logo_black.svg'

onMounted(() => {
  auth.hydrate()
  auth.listenForAuthChanges(() => auth.syncFromStorage())
})

const displayName = computed(
  () => auth.fullName || auth.guestSession?.fullName || auth.email || 'Guest',
)

const initials = computed(() => {
  const parts = displayName.value.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'G'
  const first = parts[0].charAt(0)
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ''
  return (first + last).toUpperCase()
})

const hasIdentity = computed(() => auth.isLoggedIn || auth.isGuestSession)
</script>

<template>
  <header class="booking-nav" role="banner">
    <div class="booking-nav__inner booking-shell__inner">
      <NuxtLink :to="routes.home" class="booking-nav__brand">
        <img
          class="booking-nav__logo"
          :src="logoSrc"
          alt="STW Movers"
          width="146"
          height="40"
          decoding="async"
        />
      </NuxtLink>

      <div class="booking-nav__right">
        <NuxtLink class="booking-nav__help" :to="routes.faq">Need Help?</NuxtLink>

        <ClientOnly>
          <div v-if="hasIdentity" class="booking-nav__user">
            <span class="booking-nav__avatar" aria-hidden="true">{{ initials }}</span>
            <span class="booking-nav__name">{{ displayName }}</span>
          </div>
          <button v-else type="button" class="booking-nav__login" @click="openSignIn()">
            Sign in
          </button>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>
