<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

import { adminService } from '~/services/api/admin.service'
import type { DashboardStats } from '~/types/api'

const stats = ref<DashboardStats | null>(null)

onMounted(async () => {
  stats.value = await adminService.dashboard()
})
</script>

<template>
  <section>
    <h1 class="font-serif">Dashboard</h1>
    <div v-if="stats" class="grid cols-3 admin-stats">
      <div class="card card--elevated"><span class="stat-num">{{ stats.totalRides }}</span><span>Rides</span></div>
      <div class="card card--elevated"><span class="stat-num">€{{ stats.totalRevenue }}</span><span>Revenue</span></div>
      <div class="card card--elevated"><span class="stat-num">{{ stats.activeDrivers }}</span><span>Drivers</span></div>
      <div class="card card--elevated"><span class="stat-num">{{ stats.activeBookings }}</span><span>Active</span></div>
      <div class="card card--elevated"><span class="stat-num">{{ stats.failedPayments }}</span><span>Failed pay</span></div>
      <div class="card card--elevated"><span class="stat-num">{{ stats.pendingCustomRequests }}</span><span>Custom</span></div>
    </div>
  </section>
</template>
