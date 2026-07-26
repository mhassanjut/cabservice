<script setup lang="ts">
import { routes } from '~/constants/routes'

const route = useRoute()

const tabs = [
  { label: 'Overview', to: routes.dashboard },
  { label: 'Bookings', to: routes.dashboardBookings },
  { label: 'Account', to: routes.dashboardAccount },
] as const

const isActive = (path: string) => {
  if (path === routes.dashboard) return route.path === routes.dashboard
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <nav class="dashboard-tabs" aria-label="Dashboard">
    <div class="dashboard-tabs__inner booking-shell__inner">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="dashboard-tabs__link"
        :class="{ 'is-active': isActive(tab.to) }"
      >
        <span class="dashboard-tabs__label">{{ tab.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
