<script setup lang="ts">
import { routes } from '~/constants/routes'

const route = useRoute()
const auth = useAuthStore()

const tabs = [
  { label: 'Overview', to: routes.dashboard, icon: 'fa-gauge-high' },
  { label: 'Bookings', to: routes.dashboardBookings, icon: 'fa-list' },
  { label: 'Account', to: routes.dashboardAccount, icon: 'fa-user' },
]

const isActive = (path: string) => {
  if (path === routes.dashboard) return route.path === routes.dashboard
  return route.path === path || route.path.startsWith(`${path}/`)
}

const logout = async () => {
  await auth.logout()
  await navigateTo(routes.home)
}
</script>

<template>
  <div class="dashboard-shell">
    <aside class="dashboard-shell__sidebar card card--elevated">
      <p class="eyebrow">Customer</p>
      <h2 class="font-serif dashboard-shell__title">Dashboard</h2>
      <nav aria-label="Dashboard">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="dashboard-shell__link"
          :class="{ 'is-active': isActive(tab.to) }"
        >
          <i class="fa-solid" :class="tab.icon" aria-hidden="true" />
          {{ tab.label }}
        </NuxtLink>
      </nav>
      <NuxtLink class="btn btn--solid-gold dashboard-shell__cta" :to="routes.cars">Book a ride</NuxtLink>
      <button type="button" class="btn secondary dashboard-shell__logout" @click="logout">Logout</button>
    </aside>

    <div class="dashboard-shell__content">
      <slot />
    </div>

    <nav class="dashboard-shell__mobile-tabs mobile-bar" aria-label="Dashboard tabs">
      <NuxtLink
        v-for="tab in tabs"
        :key="`${tab.to}-mobile`"
        :to="tab.to"
        :class="{ 'is-active': isActive(tab.to) }"
      >
        <i class="fa-solid" :class="tab.icon" aria-hidden="true" />
        <span>{{ tab.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.dashboard-shell {
  display: grid;
  gap: 1.5rem;
  padding-bottom: calc(var(--mobile-nav-h) + 1rem);
}

@media (min-width: 860px) {
  .dashboard-shell {
    grid-template-columns: 240px 1fr;
    padding-bottom: var(--space-section);
  }
}

.dashboard-shell__sidebar {
  display: none;
  padding: 1.25rem;
  align-self: start;
}

@media (min-width: 860px) {
  .dashboard-shell__sidebar {
    display: block;
  }
}

.dashboard-shell__title {
  margin: 0 0 1rem;
}

.dashboard-shell__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  color: var(--color-muted);
  margin-bottom: 4px;
}

.dashboard-shell__link.is-active {
  color: var(--color-gold-bright);
  background: var(--color-gold-subtle);
}

.dashboard-shell__cta {
  width: 100%;
  margin-top: 1rem;
  justify-content: center;
}

.dashboard-shell__logout {
  width: 100%;
  margin-top: 8px;
  justify-content: center;
}

.dashboard-shell__content {
  min-width: 0;
}

.dashboard-shell__mobile-tabs {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--mobile-nav-h);
  z-index: 120;
  background: var(--color-bg-card);
  border-top: 1px solid var(--color-border);
}

@media (min-width: 860px) {
  .dashboard-shell__mobile-tabs {
    display: none;
  }
}
</style>
