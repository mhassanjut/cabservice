<script setup lang="ts">
import BookingUserMenu from '~/components/booking/BookingUserMenu.vue'
import { routes } from '~/constants/routes'

const auth = useAuthStore()
const { open: openSignIn } = useCustomerSignIn()

const logoSrc = '/logo_black.svg'

if (import.meta.client) {
  auth.hydrate()
}

onMounted(() => {
  auth.listenForAuthChanges(() => auth.syncFromStorage())
})

const showUserMenu = computed(() => auth.isLoggedIn && auth.role === 'CUSTOMER')
const isGuest = computed(() => auth.isGuestSession && !auth.isLoggedIn)

const guestName = computed(() => auth.guestSession?.fullName || 'Guest')

const guestInitial = computed(() => {
  const label = guestName.value.trim()
  return label.charAt(0).toUpperCase() || 'G'
})
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

        <BookingUserMenu v-if="showUserMenu" />
        <div v-else-if="isGuest" class="booking-nav__user booking-nav__user--static">
          <span class="booking-nav__avatar" aria-hidden="true">{{ guestInitial }}</span>
          <span class="booking-nav__name">{{ guestName }}</span>
        </div>
        <button v-else type="button" class="booking-nav__login" @click="openSignIn()">
          Sign in
        </button>
      </div>
    </div>
  </header>
</template>
