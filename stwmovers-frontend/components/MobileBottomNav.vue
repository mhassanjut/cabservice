<script setup lang="ts">
import { routes } from '~/constants/routes'

const auth = useAuthStore()
const booking = useBookingStore()
const route = useRoute()
const { isOpen: signInOpen, open: openSignIn } = useCustomerSignIn()

onMounted(() => {
  auth.hydrate()
  booking.hydrateFromStorage()
})

const isLoggedInCustomer = computed(() => auth.isLoggedIn && auth.role === 'CUSTOMER')
const isGuest = computed(() => auth.isGuestSession && !auth.isLoggedIn)
const hideOnAdminDriver = computed(() => route.path.startsWith('/admin') || route.path.startsWith('/driver'))
</script>

<template>
  <nav v-if="!hideOnAdminDriver" class="mobile-bar" aria-label="Bottom navigation">
    <template v-if="isLoggedInCustomer">
      <NuxtLink :to="routes.home" :class="{ 'is-active': route.path === '/' && !route.hash }">
        <i class="fa-solid fa-house" aria-hidden="true" />
        <span>Home</span>
      </NuxtLink>
      <NuxtLink :to="routes.dashboardBookings" :class="{ 'is-active': route.path.startsWith('/dashboard/bookings') || route.path === '/bookings' }">
        <i class="fa-solid fa-list" aria-hidden="true" />
        <span>Bookings</span>
      </NuxtLink>
      <NuxtLink :to="routes.dashboard" :class="{ 'is-active': route.path === '/dashboard' }">
        <i class="fa-solid fa-gauge-high" aria-hidden="true" />
        <span>Dashboard</span>
      </NuxtLink>
      <NuxtLink :to="routes.dashboardAccount" :class="{ 'is-active': route.path.startsWith('/dashboard/account') }">
        <i class="fa-solid fa-user" aria-hidden="true" />
        <span>Profile</span>
      </NuxtLink>
    </template>

    <template v-else-if="isGuest">
      <NuxtLink :to="routes.home" :class="{ 'is-active': route.path === '/' && !route.hash }">
        <i class="fa-solid fa-house" aria-hidden="true" />
        <span>Home</span>
      </NuxtLink>
      <NuxtLink :to="routes.guestBooking" :class="{ 'is-active': route.path.startsWith('/guest/booking') }">
        <i class="fa-solid fa-ticket" aria-hidden="true" />
        <span>My Booking</span>
      </NuxtLink>
    </template>

    <template v-else>
      <NuxtLink :to="routes.home" :class="{ 'is-active': route.path === '/' && !route.hash }">
        <i class="fa-solid fa-house" aria-hidden="true" />
        <span>Home</span>
      </NuxtLink>
      <button
        type="button"
        :class="{ 'is-active': signInOpen }"
        @click="openSignIn()"
      >
        <i class="fa-solid fa-right-to-bracket" aria-hidden="true" />
        <span>Login</span>
      </button>
    </template>
  </nav>
</template>
