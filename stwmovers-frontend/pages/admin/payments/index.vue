<script setup lang="ts">
import type { PaymentDto, PaymentStatus } from '~/types/api'
import { adminService } from '~/services/api/admin.service'
import { formatStatusLabel, paymentStatusTone } from '~/utils/adminStatus'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const payments = ref<PaymentDto[]>([])
const loading = ref(true)
const status = ref<PaymentStatus | undefined>()
const page = ref(0)
const totalPages = ref(0)

const load = async () => {
  loading.value = true
  const res = await adminService.payments(page.value, 20, status.value)
  payments.value = res.content
  totalPages.value = res.totalPages
  loading.value = false
}

onMounted(load)

const refund = async (id: string) => {
  await adminService.refundPayment(id)
  await load()
}
</script>

<template>
  <AdminShell>
    <AdminSectionHead title="Payments" description="Monitor payment status across all bookings." />
    <div class="admin-toolbar">
      <select v-model="status" class="input" @change="page = 0; load()">
        <option :value="undefined">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="SUCCESS">Success</option>
        <option value="FAILED">Failed</option>
        <option value="REFUNDED">Refunded</option>
      </select>
    </div>

    <AdminSkeleton v-if="loading" :rows="6" />
    <AdminEmptyState
      v-else-if="!payments.length"
      title="No payments found"
      message="Payments appear here once customers complete checkout."
      icon="fa-credit-card"
    />
    <section v-else class="card card--elevated" style="padding: 24px">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Stripe session</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in payments" :key="row.id">
              <td>{{ row.bookingReference }}</td>
              <td>€{{ row.amount }}</td>
              <td>
                <AdminBadge :tone="paymentStatusTone(row.status)">
                  {{ formatStatusLabel(row.status) }}
                </AdminBadge>
              </td>
              <td>{{ row.stripeSessionId || '—' }}</td>
              <td>{{ row.createdAt ? new Date(row.createdAt).toLocaleString() : '—' }}</td>
              <td>
                <button
                  v-if="row.status === 'SUCCESS'"
                  type="button"
                  class="btn secondary"
                  @click="refund(row.id)"
                >
                  Refund
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </AdminShell>
</template>
