<script setup lang="ts">
definePageMeta({ middleware: ['customer', 'no-guest-dashboard'], ssr: false })

import type { BookingDto, BookingStatus } from '~/types/api'
import { bookingService } from '~/services/api/booking.service'
import { routes } from '~/constants/routes'

usePageSeo({ title: 'My bookings', path: '/dashboard/bookings' })

const auth = useAuthStore()
const list = ref<Awaited<ReturnType<typeof bookingService.mine>> | null>(null)
const filter = ref<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')
const loading = ref(true)

const upcoming: BookingStatus[] = ['PAYMENT_PENDING', 'CONFIRMED', 'DRIVER_ASSIGNED', 'DRIVER_ACCEPTED', 'IN_PROGRESS']
const completed: BookingStatus[] = ['COMPLETED']
const cancelled: BookingStatus[] = ['CANCELLED', 'REFUNDED']

onMounted(async () => {
  auth.hydrate()
  if (!auth.isLoggedIn || !auth.token) {
    loading.value = false
    return
  }
  try {
    list.value = await bookingService.mine()
  } catch {
    /* api client handles user-facing errors */
  } finally {
    loading.value = false
  }
})

const filtered = computed(() => {
  const items = list.value?.content ?? []
  if (filter.value === 'upcoming') return items.filter((b: BookingDto) => upcoming.includes(b.status))
  if (filter.value === 'completed') return items.filter((b: BookingDto) => completed.includes(b.status))
  if (filter.value === 'cancelled') return items.filter((b: BookingDto) => cancelled.includes(b.status))
  return items
})

const badgeClass = (status: BookingStatus) => {
  if (completed.includes(status)) return 'badge--success'
  if (cancelled.includes(status)) return 'badge--danger'
  return 'badge--gold'
}
</script>

<template>
  <DashboardShell>
    <section>
      <h1 class="font-serif">My Bookings</h1>
      <div class="booking-filters">
        <button v-for="f in ['all', 'upcoming', 'completed', 'cancelled']" :key="f" class="btn secondary" :class="{ 'is-active': filter === f }" @click="filter = f as typeof filter">
          {{ f }}
        </button>
      </div>

      <LoadingOverlay :show="loading" label="Loading bookings…" />

      <p v-if="!loading && !filtered.length" class="empty">
        No bookings yet.
        <NuxtLink :to="routes.cars">Book a ride</NuxtLink>
      </p>

      <article v-for="b in filtered" :key="b.id" class="card card--elevated booking-row">
        <div>
          <strong>{{ b.bookingReference }}</strong>
          <p>{{ b.pickupAddress }} → {{ b.dropoffAddress }}</p>
        </div>
        <div class="booking-row__meta">
          <span class="pill" :class="badgeClass(b.status)">{{ b.status }}</span>
          <span>€{{ b.calculatedFare ?? '—' }}</span>
          <NuxtLink class="btn secondary" :to="`/dashboard/bookings/${b.bookingReference}`">Details</NuxtLink>
        </div>
      </article>
    </section>
  </DashboardShell>
</template>

<style scoped>
.booking-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 1rem 0;
}

.booking-filters .btn.is-active {
  border-color: var(--color-gold);
  color: var(--color-gold-bright);
}

.booking-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
}

.booking-row__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.badge--gold { border-color: var(--color-gold); color: var(--color-gold-bright); }
.badge--success { border-color: var(--color-success); color: var(--color-success); }
.badge--danger { border-color: var(--color-danger); color: var(--color-danger); }
</style>
