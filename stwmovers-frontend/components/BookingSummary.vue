<script setup lang="ts">
import { routes } from '~/constants/routes'

const booking = useBookingStore()
const auth = useAuthStore()

const rideLabel = computed(() => {
  const rt = booking.draft.rideType ?? booking.vehicle?.rideType
  if (rt === 'CITY_TO_CITY') return 'City to city'
  if (rt === 'IN_CITY') return 'In city'
  return 'Transfer'
})
</script>

<template>
  <article class="booking-summary card card--elevated">
    <header class="booking-summary__head">
      <div>
        <p class="booking-summary__eyebrow eyebrow">Your trip</p>
        <h2 class="booking-summary__title font-serif">Trip summary</h2>
      </div>
      <NuxtLink :to="routes.cars" class="booking-summary__edit">
        <i class="fa-solid fa-pen" aria-hidden="true" />
        Change vehicle
      </NuxtLink>
    </header>

    <div v-if="auth.isLoggedIn" class="booking-summary__user">
      <i class="fa-solid fa-circle-user" aria-hidden="true" />
      <span>Signed in as <strong>{{ auth.fullName }}</strong></span>
    </div>

    <div class="booking-summary__route">
      <div class="booking-summary__point">
        <span class="booking-summary__dot booking-summary__dot--pickup" aria-hidden="true" />
        <div>
          <span class="booking-summary__label">Pickup</span>
          <p>{{ booking.draft.pickupLocation }}</p>
        </div>
      </div>
      <div class="booking-summary__point">
        <span class="booking-summary__dot booking-summary__dot--dropoff" aria-hidden="true" />
        <div>
          <span class="booking-summary__label">Drop-off</span>
          <p>{{ booking.draft.dropoffLocation }}</p>
        </div>
      </div>
    </div>

    <ul class="booking-summary__meta">
      <li>
        <i class="fa-regular fa-calendar" aria-hidden="true" />
        {{ booking.draft.pickupDate }} · {{ booking.draft.pickupTime }}
      </li>
      <li v-if="booking.draft.distanceKm">
        <i class="fa-solid fa-route" aria-hidden="true" />
        ≈ {{ booking.draft.distanceKm }} km
      </li>
      <li>
        <i class="fa-solid fa-map-pin" aria-hidden="true" />
        {{ rideLabel }}
      </li>
    </ul>

    <div v-if="booking.vehicle" class="booking-summary__vehicle">
      <img
        :src="booking.vehicle.imagePath"
        :alt="booking.vehicle.name"
        width="72"
        height="72"
        loading="lazy"
      />
      <div class="booking-summary__vehicle-info">
        <span class="booking-summary__label">Selected vehicle</span>
        <p class="booking-summary__vehicle-name">{{ booking.vehicle.name }}</p>
        <span class="pill">{{ booking.vehicle.carType }} · {{ booking.vehicle.seats }} seats</span>
      </div>
    </div>

    <div v-else-if="booking.otherCar" class="booking-summary__vehicle booking-summary__vehicle--custom">
      <div class="booking-summary__custom-icon" aria-hidden="true">
        <i class="fa-solid fa-comments" />
      </div>
      <div>
        <span class="booking-summary__label">Vehicle</span>
        <p class="booking-summary__vehicle-name">Custom request</p>
        <span class="help">Team will confirm pricing</span>
      </div>
    </div>

    <footer v-if="booking.vehicle" class="booking-summary__fare">
      <span class="booking-summary__fare-label">Estimated fare</span>
      <span class="summary-fare">€{{ booking.vehicle.priceEur }}</span>
    </footer>
  </article>
</template>
