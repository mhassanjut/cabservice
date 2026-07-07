<script setup lang="ts">
import { adminService } from '~/services/api/admin.service'
import { routes } from '~/constants/routes'
import { bookingStatusTone, formatStatusLabel } from '~/utils/adminStatus'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const stats = ref<Awaited<ReturnType<typeof adminService.dashboard>> | null>(null)
const loading = ref(true)
const error = ref(false)
const revenueMode = ref<'today' | 'month'>('today')

const load = async () => {
  loading.value = true
  error.value = false
  try {
    stats.value = await adminService.dashboard()
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)

const revenueDisplay = computed(() => {
  if (!stats.value) return '0'
  return revenueMode.value === 'today'
    ? stats.value.revenueToday
    : stats.value.revenueThisMonth
})
</script>

<template>
  <AdminShell>
    <AdminSectionHead
      title="Operations overview"
      description="Live metrics for bookings, revenue, drivers, and payments across STW Movers."
    />

    <AdminSkeleton v-if="loading" :rows="6" />
    <div v-else-if="error" class="admin-empty card card--elevated">
      <p>Could not load dashboard metrics.</p>
      <button type="button" class="btn btn--solid-gold" @click="load">Retry</button>
    </div>
    <div v-else-if="stats" class="admin-stack">
      <div class="admin-stat-grid">
        <article class="admin-stat card card--elevated">
          <span class="admin-stat__value">{{ stats.totalRides }}</span>
          <span class="admin-stat__label">Total rides (completed)</span>
        </article>
        <article class="admin-stat card card--elevated">
          <span class="admin-stat__value">{{ stats.activeRides ?? 0 }}</span>
          <span class="admin-stat__label">Active rides now</span>
        </article>
        <article class="admin-stat card card--elevated">
          <span class="admin-stat__value">€{{ revenueDisplay }}</span>
          <span class="admin-stat__label">
            Revenue
            <button type="button" class="btn secondary" style="margin-left: 8px; padding: 4px 10px" @click="revenueMode = revenueMode === 'today' ? 'month' : 'today'">
              {{ revenueMode === 'today' ? 'Today' : 'This month' }}
            </button>
          </span>
        </article>
        <article class="admin-stat card card--elevated">
          <span class="admin-stat__value">{{ stats.activeDrivers }}</span>
          <span class="admin-stat__label">Active drivers</span>
        </article>
        <article class="admin-stat card card--elevated">
          <span class="admin-stat__value">{{ stats.activeBookings }}</span>
          <span class="admin-stat__label">Pending bookings</span>
        </article>
        <article class="admin-stat card card--elevated">
          <span class="admin-stat__value">{{ stats.failedPayments }}</span>
          <span class="admin-stat__label">Failed payments</span>
        </article>
        <article class="admin-stat card card--elevated">
          <span class="admin-stat__value">{{ stats.pendingCustomRequests }}</span>
          <span class="admin-stat__label">Custom requests</span>
        </article>
      </div>

      <section class="card card--elevated" style="padding: 24px">
        <div class="admin-toolbar" style="margin-bottom: 24px">
          <h3 class="font-serif" style="margin: 0">Quick actions</h3>
          <NuxtLink class="btn btn--solid-gold" :to="routes.adminRides">View rides</NuxtLink>
          <NuxtLink class="btn secondary" :to="routes.adminDrivers">Add driver</NuxtLink>
          <NuxtLink class="btn secondary" :to="routes.adminCustomRequests">Pending custom</NuxtLink>
        </div>

        <h3 class="font-serif" style="margin: 0 0 16px">Recent bookings</h3>
        <div v-if="!stats.recentBookings?.length" class="help">No recent bookings yet.</div>
        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Fare</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in stats.recentBookings" :key="row.id">
                <td>{{ row.bookingReference }}</td>
                <td>{{ row.guestName || '—' }}</td>
                <td>
                  <AdminBadge :tone="bookingStatusTone(row.status)">
                    {{ formatStatusLabel(row.status) }}
                  </AdminBadge>
                </td>
                <td>€{{ row.calculatedFare ?? '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </AdminShell>
</template>
