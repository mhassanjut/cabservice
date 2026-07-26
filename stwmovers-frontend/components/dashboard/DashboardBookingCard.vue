<script setup lang="ts">

import type { BookingDto } from '~/types/api'

import { journeyIcons } from '~/constants/journeyIcons'

import { paymentService } from '~/services/api/payment.service'



const props = withDefaults(

  defineProps<{

    booking: BookingDto

    eyebrow?: string

    variant?: 'default' | 'list'

  }>(),

  { eyebrow: 'Upcoming booking', variant: 'default' },

)



const toast = useToastStore()

const paying = ref(false)



const isList = computed(() => props.variant === 'list')

const needsPayment = computed(() => props.booking.status === 'PAYMENT_PENDING')



const statusClass = computed(() => {

  const s = props.booking.status

  if (['CONFIRMED', 'COMPLETED'].includes(s)) return 'dashboard-status-badge--success'

  if (s === 'PAYMENT_PENDING') return 'dashboard-status-badge--warning'

  if (['CANCELLED', 'REFUNDED'].includes(s)) return 'dashboard-status-badge--danger'

  return ''

})



const fareLabel = computed(() => {

  const fare = props.booking.calculatedFare

  return fare != null ? `€${fare}` : '—'

})



const dateLabel = computed(() => {

  const raw = props.booking.scheduledAt

  if (!raw) return '—'

  const d = new Date(raw)

  if (Number.isNaN(d.getTime())) return '—'

  const y = d.getFullYear()

  const m = String(d.getMonth() + 1).padStart(2, '0')

  const day = String(d.getDate()).padStart(2, '0')

  return `${y}-${m}-${day}`

})



const timeLabel = computed(() => {

  const raw = props.booking.scheduledAt

  if (!raw) return '—'

  const d = new Date(raw)

  if (Number.isNaN(d.getTime())) return '—'

  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })

})



const completePayment = async () => {

  if (paying.value || !needsPayment.value) return

  paying.value = true

  try {

    const session = await paymentService.session(props.booking.bookingReference)

    if (!session.checkoutUrl) {

      toast.show('Could not start checkout. Please try again.', 'error')

      return

    }

    if (import.meta.client) window.location.href = session.checkoutUrl

  } catch (e: unknown) {

    const err = e as { data?: { message?: string }; message?: string }

    toast.show(err.data?.message ?? err.message ?? 'Payment could not be started.', 'error')

  } finally {

    paying.value = false

  }

}

</script>



<template>

  <article

    class="dashboard-booking-card"

    :class="{ 'dashboard-booking-card--list': isList }"

  >

    <header class="dashboard-booking-card__header">

      <div class="dashboard-booking-card__titles">

        <p class="dashboard-eyebrow">{{ eyebrow }}</p>

        <h2 class="dashboard-booking-card__ref">{{ booking.bookingReference }}</h2>

      </div>

      <div class="dashboard-booking-card__header-end">

        <span class="dashboard-status-badge" :class="statusClass">{{ booking.status }}</span>

        <span v-if="isList" class="dashboard-booking-card__price">{{ fareLabel }}</span>

      </div>

    </header>



    <hr class="dashboard-booking-card__divider" />



    <template v-if="isList">

      <div class="dashboard-booking-card__list-route">

        <div class="dashboard-booking-card__list-stop">

          <span class="dashboard-booking-card__list-pin" aria-hidden="true">

            <img :src="journeyIcons.pickup" alt="" width="16" height="16" />

          </span>

          <div class="dashboard-booking-card__list-stop-text">

            <span class="dashboard-booking-card__stop-label">Pickup</span>

            <p class="dashboard-booking-card__stop-value">{{ booking.pickupAddress }}</p>

          </div>

        </div>

        <div class="dashboard-booking-card__list-stop">

          <span class="dashboard-booking-card__list-pin" aria-hidden="true">

            <img :src="journeyIcons.dropoff" alt="" width="16" height="16" />

          </span>

          <div class="dashboard-booking-card__list-stop-text">

            <span class="dashboard-booking-card__stop-label">Drop-off</span>

            <p class="dashboard-booking-card__stop-value">{{ booking.dropoffAddress }}</p>

          </div>

        </div>

      </div>



      <hr class="dashboard-booking-card__divider" />



      <footer class="dashboard-booking-card__footer">

        <div class="dashboard-booking-card__meta">

          <span class="dashboard-booking-card__meta-item">

            <img :src="journeyIcons.travelDate" alt="" width="16" height="16" aria-hidden="true" />

            {{ dateLabel }}

          </span>

          <span class="dashboard-booking-card__meta-item">

            <img :src="journeyIcons.pickupTime" alt="" width="16" height="16" aria-hidden="true" />

            {{ timeLabel }}

          </span>

        </div>



        <div class="dashboard-booking-card__actions">

          <NuxtLink

            class="dashboard-btn dashboard-btn--secondary"

            :to="`/dashboard/bookings/${booking.bookingReference}`"

          >

            View Details

          </NuxtLink>

        </div>

      </footer>

    </template>



    <template v-else>

      <div class="dashboard-booking-card__route">

        <div class="dashboard-booking-card__route-track" aria-hidden="true">

          <span class="dashboard-booking-card__pin">

            <img :src="journeyIcons.pickup" alt="" width="18" height="18" />

          </span>

          <span class="dashboard-booking-card__connector" />

          <span class="dashboard-booking-card__pin">

            <img :src="journeyIcons.dropoff" alt="" width="18" height="18" />

          </span>

        </div>

        <div class="dashboard-booking-card__route-stops">

          <div class="dashboard-booking-card__stop">

            <span class="dashboard-booking-card__stop-label">Pickup Location</span>

            <p class="dashboard-booking-card__stop-value">{{ booking.pickupAddress }}</p>

          </div>

          <div class="dashboard-booking-card__stop">

            <span class="dashboard-booking-card__stop-label">Drop-off Location</span>

            <p class="dashboard-booking-card__stop-value">{{ booking.dropoffAddress }}</p>

          </div>

        </div>

      </div>



      <hr class="dashboard-booking-card__divider" />



      <footer class="dashboard-booking-card__footer">

        <div class="dashboard-booking-card__meta">

          <span class="dashboard-booking-card__meta-item">

            <img :src="journeyIcons.travelDate" alt="" width="16" height="16" aria-hidden="true" />

            {{ dateLabel }}

          </span>

          <span class="dashboard-booking-card__meta-item">

            <img :src="journeyIcons.pickupTime" alt="" width="16" height="16" aria-hidden="true" />

            {{ timeLabel }}

          </span>

        </div>



        <div class="dashboard-booking-card__actions">

          <NuxtLink

            class="dashboard-btn dashboard-btn--secondary"

            :to="`/dashboard/bookings/${booking.bookingReference}`"

          >

            Manage Booking

          </NuxtLink>

          <button

            v-if="needsPayment"

            type="button"

            class="dashboard-btn dashboard-btn--primary"

            :disabled="paying"

            @click="completePayment"

          >

            {{ paying ? 'Starting…' : 'Complete Payment' }}

          </button>

        </div>

      </footer>

    </template>

  </article>

</template>

