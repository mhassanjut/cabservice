<script setup lang="ts">
import type { AdminSettingsDto } from '~/types/api'
import { adminService } from '~/services/api/admin.service'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const settings = ref<AdminSettingsDto | null>(null)
const loading = ref(true)

onMounted(async () => {
  settings.value = await adminService.settings()
  loading.value = false
})
</script>

<template>
  <AdminShell>
    <AdminSectionHead title="Settings" description="System-wide configuration and fare calculation rules." />
    <AdminSkeleton v-if="loading" :rows="4" />
    <section v-else-if="settings" class="card card--elevated" style="padding: 24px">
      <h3 class="font-serif" style="margin: 0 0 16px">Fare calculation (in-city)</h3>
      <ul class="admin-row-card__meta">
        <li>Base distance included: {{ settings.inCityBaseKm }} km</li>
        <li>Fallback fare beyond base distance: €{{ settings.inCityExtraEurPerKm }} per km</li>
        <li>Route pricing overrides the distance formula when a matching route is configured</li>
      </ul>
      <h3 class="font-serif" style="margin: 24px 0 16px">Admin account</h3>
      <p>Primary admin email: <strong>{{ settings.adminEmail }}</strong></p>
      <p class="help" style="margin-top: 12px">
        Fare rules are configured server-side via environment variables. Contact engineering to change pricing logic.
      </p>
    </section>
  </AdminShell>
</template>
