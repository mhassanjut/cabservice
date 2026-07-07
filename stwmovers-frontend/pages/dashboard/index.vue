<script setup lang="ts">
definePageMeta({ middleware: ['customer', 'no-guest-dashboard'], ssr: false })

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
  <DashboardShell>
    <section>
      <header class="dashboard-head card card--elevated">
        <div class="dashboard-head__user">
          <UserAvatar size="md" :name="auth.fullName" />
          <div class="dashboard-head__text">
            <p class="eyebrow">Welcome back</p>
            <h1 class="font-serif">{{ auth.fullName }}</h1>
          </div>
        </div>
        <NuxtLink class="btn btn--solid-gold dashboard-head__cta" :to="routes.cars">Book a Ride</NuxtLink>
      </header>

      <LoadingOverlay :show="loading" label="Loading dashboard…" />

      <div v-if="stats?.activeRide" class="card card--elevated dashboard-active">
        <p class="eyebrow">Active ride</p>
        <h2 class="font-serif">{{ stats.activeRide.bookingReference }}</h2>
        <BookingStateTracker :status="stats.activeRide.status" />
        <NuxtLink class="btn secondary" :to="`/dashboard/bookings/${stats.activeRide.bookingReference}`">View details</NuxtLink>
      </div>

      <div class="dashboard-stats">
        <article class="card card--elevated dashboard-stat">
          <span class="dashboard-stat__label">Total rides</span>
          <strong class="dashboard-stat__value">{{ stats?.totalRides ?? 0 }}</strong>
        </article>
        <article class="card card--elevated dashboard-stat">
          <span class="dashboard-stat__label">Total spent</span>
          <strong class="dashboard-stat__value">€{{ stats?.totalSpent ?? 0 }}</strong>
        </article>
      </div>

      <article v-if="stats?.upcomingBooking" class="card card--elevated dashboard-upcoming">
        <p class="eyebrow">Upcoming booking</p>
        <h2 class="font-serif">{{ stats.upcomingBooking.bookingReference }}</h2>
        <p>{{ stats.upcomingBooking.pickupAddress }} → {{ stats.upcomingBooking.dropoffAddress }}</p>
        <span class="pill">{{ stats.upcomingBooking.status }}</span>
      </article>
    </section>
  </DashboardShell>
</template>

<style scoped>
.dashboard-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 1.25rem;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  margin-bottom: 1rem;
}

.dashboard-head__user {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  flex: 1 1 220px;
}

.dashboard-head__text {
  min-width: 0;
}

.dashboard-head__text .eyebrow {
  margin: 0 0 6px;
}

.dashboard-head__text h1 {
  margin: 0;
  font-size: clamp(1.35rem, 4vw, 1.75rem);
  line-height: 1.15;
}

.dashboard-head__avatar {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.dashboard-head__avatar--initial {
  display: grid;
  place-items: center;
  background: var(--color-gold-subtle);
  color: var(--color-gold-bright);
  font-weight: 700;
  font-size: 1.125rem;
}

.dashboard-head__cta {
  flex-shrink: 0;
}

@media (max-width: 599px) {
  .dashboard-head {
    flex-direction: column;
    align-items: stretch;
  }

  .dashboard-head__cta {
    width: 100%;
    justify-content: center;
  }
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.dashboard-stat {
  padding: 1rem 1.25rem;
}

.dashboard-stat__label {
  display: block;
  color: var(--color-muted);
  font-size: 0.8125rem;
  margin-bottom: 6px;
}

.dashboard-stat__value {
  font-size: 1.75rem;
  color: var(--color-gold-bright);
  font-family: var(--font-serif);
}

.dashboard-active {
  padding: clamp(1.25rem, 3vw, 1.75rem);
  margin-bottom: 1rem;
  border-color: rgba(201, 162, 39, 0.35);
}

.dashboard-upcoming {
  padding: clamp(1.25rem, 3vw, 1.75rem);
  margin-top: 1rem;
}

.dashboard-upcoming h2 {
  margin: 6px 0 0.75rem;
}

.dashboard-upcoming p {
  margin: 0 0 0.75rem;
  line-height: 1.55;
}
</style>
