<script setup lang="ts">
import { vehicles } from '~/data/vehicles'
import { routes } from '~/constants/routes'

usePageSeo({
  title: 'Choose your car',
  description: 'Select a vehicle for your Barcelona transfer or Spain-wide ride.',
  path: '/cars',
})

const booking = useBookingStore()
const router = useRouter()

const selectedId = computed(() => booking.vehicle?.id ?? null)

onMounted(async () => {
  if (!booking.isDraftValid) await router.replace(routes.home)
})

const selectVehicle = async (id: string) => {
  const vehicle = vehicles.find((v) => v.id === id)
  if (!vehicle) return
  booking.setVehicle(vehicle)
  await router.push(routes.confirm)
}
</script>

<template>
  <section aria-labelledby="cars-title">
    <div class="card" style="padding: 16px;">
      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div>
          <h1 id="cars-title" style="margin:0; font-size: 22px;">Choose your car</h1>
          <p class="help" style="margin: 6px 0 0;">
            Pick the vehicle that matches your trip. Your booking details are saved.
          </p>
        </div>
        <NuxtLink class="pill" :to="routes.home">Edit trip</NuxtLink>
      </div>

      <div class="card" style="margin-top: 12px; padding: 12px; background: rgba(0,0,0,0.16); box-shadow:none;">
        <div class="grid cols-3" style="gap: 10px;">
          <div>
            <div class="label">Pickup</div>
            <div>{{ booking.draft.pickupLocation }}</div>
          </div>
          <div>
            <div class="label">Drop-off</div>
            <div>{{ booking.draft.dropoffLocation }}</div>
          </div>
          <div>
            <div class="label">Date & time</div>
            <div>{{ booking.draft.pickupDate }} • {{ booking.draft.pickupTime }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid" style="margin-top: 16px;">
      <VehicleCard
        v-for="v in vehicles"
        :key="v.id"
        :vehicle="v"
        :selected="selectedId === v.id"
        @select="selectVehicle(v.id)"
      />
    </div>
  </section>
</template>

