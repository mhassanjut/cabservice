<script setup lang="ts">
import type { AdminBookingQuery, BookingDto } from '~/types/api'
import { adminService } from '~/services/api/admin.service'
import { bookingStatusTone, formatStatusLabel } from '~/utils/adminStatus'

const props = defineProps<{
  title: string
  description: string
  defaultCustomRequest?: boolean
}>()

const bookings = ref<BookingDto[]>([])
const loading = ref(true)
const error = ref(false)
const page = ref(0)
const totalPages = ref(0)
const panelOpen = ref(false)
const selectedId = ref<string | null>(null)

const filters = reactive<{
  search: string
  status: string
  rideType: string
  sortBy: AdminBookingQuery['sortBy']
  sortDir: AdminBookingQuery['sortDir']
  customRequest?: boolean
}>({
  search: '',
  status: '',
  rideType: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
  customRequest: props.defaultCustomRequest,
})

const load = async () => {
  loading.value = true
  error.value = false
  try {
    const res = await adminService.bookings({
      search: filters.search || undefined,
      status: (filters.status || undefined) as AdminBookingQuery['status'],
      rideType: (filters.rideType || undefined) as AdminBookingQuery['rideType'],
      customRequest: filters.customRequest,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
      page: page.value,
      size: 20,
    })
    bookings.value = res.content
    totalPages.value = res.totalPages
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)

const openDetail = (id: string) => {
  selectedId.value = id
  panelOpen.value = true
}

const clearFilters = () => {
  filters.search = ''
  filters.status = ''
  filters.rideType = ''
  filters.sortBy = 'createdAt'
  filters.sortDir = 'desc'
  page.value = 0
  load()
}

const onSortChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  const [sortBy, sortDir] = value.split(':') as [AdminBookingQuery['sortBy'], AdminBookingQuery['sortDir']]
  filters.sortBy = sortBy ?? 'createdAt'
  filters.sortDir = sortDir ?? 'desc'
  page.value = 0
  load()
}
</script>

<template>
  <AdminShell>
    <AdminSectionHead :title="title" :description="description" />

    <div class="admin-toolbar admin-toolbar--filters">
      <input v-model="filters.search" class="input admin-toolbar__grow" type="search" placeholder="Search ref or customer" />
      <select v-model="filters.status" class="input input--select">
        <option value="">All statuses</option>
        <option value="PAYMENT_PENDING">Payment pending</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="DRIVER_ASSIGNED">Driver assigned</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <select v-model="filters.rideType" class="input input--select">
        <option value="">All ride types</option>
        <option value="STANDARD">Standard</option>
        <option value="IN_CITY">In city (legacy)</option>
        <option value="CITY_TO_CITY">City to city (legacy)</option>
      </select>
      <select
        class="input input--select admin-toolbar__sort"
        aria-label="Sort bookings"
        :value="`${filters.sortBy}:${filters.sortDir}`"
        @change="onSortChange"
      >
        <option value="createdAt:desc">Newest booked first</option>
        <option value="createdAt:asc">Oldest booked first</option>
        <option value="scheduledAt:desc">Trip date (latest first)</option>
        <option value="scheduledAt:asc">Trip date (earliest first)</option>
        <option value="fare:desc">Fare (high to low)</option>
        <option value="fare:asc">Fare (low to high)</option>
        <option value="status:asc">Status (A–Z)</option>
        <option value="status:desc">Status (Z–A)</option>
        <option value="reference:asc">Reference (A–Z)</option>
        <option value="reference:desc">Reference (Z–A)</option>
      </select>
      <button type="button" class="btn secondary" @click="page = 0; load()">Apply filters</button>
      <button type="button" class="btn secondary" @click="clearFilters">Clear</button>
    </div>

    <AdminSkeleton v-if="loading" :rows="8" />
    <div v-else-if="error" class="admin-empty card card--elevated">
      <p>Failed to load bookings.</p>
      <button type="button" class="btn btn--solid-gold" @click="load">Retry</button>
    </div>
    <AdminEmptyState
      v-else-if="!bookings.length"
      title="No bookings found"
      message="Try adjusting your filters or check back when new rides are booked."
      icon="fa-route"
    >
      <template #action>
        <button type="button" class="btn secondary" @click="clearFilters">Clear filters</button>
      </template>
    </AdminEmptyState>
    <section v-else class="admin-card card card--elevated">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Customer</th>
              <th>Route</th>
              <th>Type</th>
              <th>Fare</th>
              <th>Status</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in bookings" :key="row.id">
              <td>{{ row.bookingReference }}</td>
              <td>{{ row.guestName || '—' }}</td>
              <td>{{ row.pickupAddress }} → {{ row.dropoffAddress }}</td>
              <td>{{ row.rideType }}</td>
              <td>€{{ row.calculatedFare ?? '—' }}</td>
              <td>
                <AdminBadge :tone="bookingStatusTone(row.status)">
                  {{ formatStatusLabel(row.status) }}
                </AdminBadge>
              </td>
              <td>{{ new Date(row.scheduledAt).toLocaleDateString() }}</td>
              <td>
                <button type="button" class="btn secondary" @click="openDetail(row.id)">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="admin-card-list">
        <article v-for="row in bookings" :key="`${row.id}-card`" class="admin-row-card card card--elevated">
          <div class="admin-row-card__head">
            <strong>{{ row.bookingReference }}</strong>
            <AdminBadge :tone="bookingStatusTone(row.status)">
              {{ formatStatusLabel(row.status) }}
            </AdminBadge>
          </div>
          <div class="admin-row-card__meta">
            <span>{{ row.guestName || 'Guest' }}</span>
            <span>{{ row.pickupAddress }}</span>
            <span>€{{ row.calculatedFare ?? '—' }} · {{ row.rideType }}</span>
          </div>
          <div class="admin-row-card__actions">
            <button type="button" class="btn btn--solid-gold" @click="openDetail(row.id)">View & actions</button>
          </div>
        </article>
      </div>

      <nav class="admin-pagination" aria-label="Bookings pagination">
        <button
          type="button"
          class="btn secondary admin-pagination__nav"
          :disabled="page <= 0"
          @click="page--; load()"
        >
          <i class="fa-solid fa-chevron-left" aria-hidden="true" />
          Previous
        </button>
        <p class="admin-pagination__status">
          Page <strong>{{ page + 1 }}</strong> of <strong>{{ Math.max(totalPages, 1) }}</strong>
        </p>
        <button
          type="button"
          class="btn secondary admin-pagination__nav"
          :disabled="page + 1 >= totalPages"
          @click="page++; load()"
        >
          Next
          <i class="fa-solid fa-chevron-right" aria-hidden="true" />
        </button>
      </nav>
    </section>

    <AdminBookingPanel :open="panelOpen" :booking-id="selectedId" @close="panelOpen = false; load()" />
  </AdminShell>
</template>
