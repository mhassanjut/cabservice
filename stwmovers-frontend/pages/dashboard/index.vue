<script setup lang="ts">
definePageMeta({
  layout: 'booking',
  middleware: ['customer', 'no-guest-dashboard'],
  ssr: false,
})

import { routes } from '~/constants/routes'
import { userService } from '~/services/api/user.service'

usePageSeo({ title: 'Dashboard', path: '/dashboard' })

const auth = useAuthStore()
const stats = ref<Awaited<ReturnType<typeof userService.stats>> | null>(null)
const loading = ref(true)
let pollTimer: ReturnType<typeof setInterval> | null = null

const loadStats = async () => {
  try {
    stats.value = await userService.stats()
  } catch {
    /* keep previous stats on poll failure */
  }
}

const spentLabel = computed(() => {
  const value = stats.value?.totalSpent ?? 0
  return `€${value}`
})

/** Avoid rendering the same booking twice when it is both active and upcoming. */
const upcomingOnly = computed(() => {
  const upcoming = stats.value?.upcomingBooking
  const active = stats.value?.activeRide
  if (!upcoming) return null
  if (active && active.bookingReference === upcoming.bookingReference) return null
  return upcoming
})

onMounted(async () => {
  auth.hydrate()
  if (!auth.isLoggedIn || !auth.token) {
    loading.value = false
    return
  }
  try {
    await loadStats()
  } finally {
    loading.value = false
  }
  pollTimer = setInterval(() => {
    if (stats.value?.activeRide) loadStats()
  }, 10000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<template>
  <section class="dashboard-overview" aria-labelledby="dashboard-welcome-heading" :aria-busy="loading">
    <header class="dashboard-welcome">
      <div class="dashboard-welcome__titles">
        <p class="dashboard-eyebrow">Welcome back</p>
        <h1 id="dashboard-welcome-heading" class="dashboard-welcome__name">
          {{ auth.fullName || 'Guest' }}
        </h1>
      </div>
      <NuxtLink class="dashboard-btn dashboard-btn--cta" :to="routes.cars">
        Book a Ride
        <img src="/img/home/icons/arrow-outward-light.svg" alt="" width="14" height="14" />
      </NuxtLink>
    </header>

    <template v-if="loading">
      <div class="dashboard-stats">
        <DashboardStatCardSkeleton />
        <DashboardStatCardSkeleton />
      </div>
      <DashboardBookingCardSkeleton />
    </template>

    <template v-else>
      <div class="dashboard-stats">
        <article class="dashboard-stat-card">
          <p class="dashboard-stat-card__label">Total rides</p>
          <p class="dashboard-stat-card__value">{{ stats?.totalRides ?? 0 }}</p>
        </article>
        <article class="dashboard-stat-card">
          <p class="dashboard-stat-card__label">Total spent</p>
          <p class="dashboard-stat-card__value">{{ spentLabel }}</p>
        </article>
      </div>

      <DashboardBookingCard
        v-if="stats?.activeRide"
        :booking="stats.activeRide"
        eyebrow="Active ride"
      />

      <DashboardBookingCard
        v-if="upcomingOnly"
        :booking="upcomingOnly"
        eyebrow="Upcoming booking"
      />
    </template>
  </section>
</template>
