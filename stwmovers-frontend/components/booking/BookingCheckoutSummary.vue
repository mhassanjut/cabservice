<script setup lang="ts">
import { routes } from '~/constants/routes'
import { journeyIcons } from '~/constants/journeyIcons'
const booking = useBookingStore()
const auth = useAuthStore()

const isCustomerLoggedIn = computed(() => auth.isLoggedIn && auth.isCustomer)

onMounted(() => {
  auth.syncFromStorage()
})

const dateTime = computed(() => {
  const date = booking.draft.pickupDate
  const time = booking.draft.pickupTime
  if (!date && !time) return '—'
  if (!time) return date
  if (!date) return time
  return `${date} / ${time}`
})

const distance = computed(() => {
  const km = booking.draft.distanceKm
  return km ? `~${km.toFixed(1)} km` : '—'
})

const notes = computed(() => booking.draft.notes?.trim() || '—')

const fareValue = computed(() => {
  if (booking.vehicle) return `€${booking.vehicle.priceEur}`
  return 'TBC'
})
</script>

<template>
  <aside class="checkout-summary booking-card">
    <div class="checkout-summary__head">
      <div>
        <p class="checkout-summary__eyebrow">Your Trip</p>
        <h2 class="checkout-summary__title">Trip Summary</h2>
      </div>
      <NuxtLink :to="routes.cars" class="checkout-summary__change">
        <i class="fa-solid fa-pen" aria-hidden="true" />
        Change
      </NuxtLink>
    </div>

    <hr class="booking-card__divider" />

    <div v-if="isCustomerLoggedIn" class="checkout-summary__guest">
      <UserAvatar size="sm" class="checkout-summary__guest-avatar" />
      <span class="checkout-summary__guest-text">
        Booking as <strong>{{ auth.fullName }}</strong>
      </span>
    </div>
    <div v-else-if="auth.isGuestSession" class="checkout-summary__guest">
      <img class="checkout-summary__guest-icon" src="/UserCircleLogo.svg" alt="" aria-hidden="true" />
      <span class="checkout-summary__guest-text">
        Guest: <strong>{{ auth.guestSession?.fullName }}</strong>
      </span>
    </div>

    <ul class="booking-journey__list checkout-summary__list">
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <img :src="journeyIcons.pickup" alt="" width="20" height="20" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Pickup</span>
          <p class="booking-journey__value">{{ booking.draft.pickupLocation || '—' }}</p>
        </div>
      </li>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <img :src="journeyIcons.dropoff" alt="" width="20" height="20" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Drop-off</span>
          <p class="booking-journey__value">{{ booking.draft.dropoffLocation || '—' }}</p>
        </div>
      </li>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <img :src="journeyIcons.travelDate" alt="" width="20" height="20" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Date &amp; Time</span>
          <p class="booking-journey__value">{{ dateTime }}</p>
        </div>
      </li>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <i class="fa-solid fa-route" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Distance</span>
          <p class="booking-journey__value">{{ distance }}</p>
        </div>
      </li>
      <li class="booking-journey__item">
        <span class="booking-journey__icon" aria-hidden="true">
          <img :src="journeyIcons.notes" alt="" width="20" height="20" />
        </span>
        <div class="booking-journey__text">
          <span class="booking-journey__label">Notes</span>
          <p class="booking-journey__value">{{ notes }}</p>
        </div>
      </li>
    </ul>

    <hr class="booking-card__divider" />

    <div v-if="booking.vehicle" class="checkout-summary__vehicle-block">
      <span class="booking-journey__label">Selected Vehicle</span>
      <div class="checkout-summary__vehicle">
        <FleetVehicleImage
          class="checkout-summary__vehicle-img"
          :src="booking.vehicle.imagePath"
          :alt="booking.vehicle.name"
        />
        <div class="checkout-summary__vehicle-info">
          <p class="checkout-summary__vehicle-name">{{ booking.vehicle.name }}</p>
          <span class="checkout-summary__vehicle-tag">
            {{ booking.vehicle.carType }} • {{ booking.vehicle.seats }} Seats
          </span>
        </div>
      </div>
    </div>
    <div v-else-if="booking.otherCar" class="checkout-summary__vehicle-block">
      <span class="booking-journey__label">Selected Vehicle</span>
      <div class="checkout-summary__vehicle">
        <span class="checkout-summary__vehicle-custom" aria-hidden="true">
          <i class="fa-solid fa-comments" />
        </span>
        <div class="checkout-summary__vehicle-info">
          <p class="checkout-summary__vehicle-name">Custom request</p>
          <span class="checkout-summary__vehicle-tag">Team will confirm pricing</span>
        </div>
      </div>
    </div>

    <hr class="booking-card__divider" />

    <footer class="checkout-summary__fare">
      <span class="checkout-summary__fare-label">Estimated Fare</span>
      <span class="checkout-summary__fare-value">{{ fareValue }}</span>
    </footer>
  </aside>
</template>
