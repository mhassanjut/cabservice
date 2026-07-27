<script setup lang="ts">
definePageMeta({
  layout: 'customer',
  middleware: ['customer', 'no-guest-dashboard'],
  ssr: false,
})

import type { BookingDto, BookingStatus } from '~/types/api'
import { bookingService } from '~/services/api/booking.service'
import { routes } from '~/constants/routes'

usePageSeo({ title: 'My bookings', path: '/dashboard/bookings' })

const auth = useAuthStore()
const list = ref<Awaited<ReturnType<typeof bookingService.mine>> | null>(null)
const filter = ref<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')
const loading = ref(true)

const filters = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
] as const

const upcoming: BookingStatus[] = ['PAYMENT_PENDING', 'CONFIRMED', 'DRIVER_ASSIGNED', 'DRIVER_ACCEPTED', 'IN_PROGRESS']
const completed: BookingStatus[] = ['COMPLETED']
const cancelled: BookingStatus[] = ['CANCELLED', 'REFUNDED']

const skeletonCount = 3

onMounted(async () => {
  auth.hydrate()
  if (!auth.isLoggedIn) {
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

const serviceEyebrow = () => 'Chauffeur service'
</script>

<template>
  <section class="dashboard-bookings" aria-labelledby="bookings-heading" :aria-busy="loading">
    <header class="dashboard-bookings__header">
      <p class="dashboard-eyebrow">Your travels</p>
      <h1 id="bookings-heading" class="dashboard-bookings__title">My Bookings</h1>
    </header>

    <div class="dashboard-bookings__filters" role="tablist" aria-label="Filter bookings">
      <button
        v-for="f in filters"
        :key="f.key"
        type="button"
        class="dashboard-filter-pill"
        :class="{ 'is-active': filter === f.key }"
        role="tab"
        :aria-selected="filter === f.key"
        @click="filter = f.key"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="loading" class="dashboard-bookings__list">
      <DashboardBookingCardSkeleton
        v-for="n in skeletonCount"
        :key="`booking-skeleton-${n}`"
        variant="list"
      />
    </div>

    <p v-else-if="!filtered.length" class="dashboard-bookings__empty">
      No bookings yet.
      <NuxtLink :to="routes.cars">Book a ride</NuxtLink>
    </p>

    <div v-else class="dashboard-bookings__list">
      <DashboardBookingCard
        v-for="b in filtered"
        :key="b.id"
        :booking="b"
        variant="list"
        :eyebrow="serviceEyebrow()"
      />
    </div>
  </section>
</template>
