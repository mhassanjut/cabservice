<script setup lang="ts">
defineProps<{
  detailsActive?: boolean
  detailsDone?: boolean
  paymentActive?: boolean
  paymentDone?: boolean
  confirmedDone?: boolean
}>()
</script>

<template>
  <nav class="booking-progress reveal" aria-label="Booking progress">
    <ol class="booking-progress__list">
      <li class="booking-progress__item is-done">
        <span class="booking-progress__num"><i class="fa-solid fa-check" aria-hidden="true" /></span>
        <span class="booking-progress__text">Vehicle</span>
      </li>
      <li
        class="booking-progress__item"
        :class="{ 'is-active': detailsActive, 'is-done': detailsDone || paymentActive || paymentDone }"
      >
        <span class="booking-progress__num">
          <i v-if="detailsDone || paymentActive || paymentDone" class="fa-solid fa-check" aria-hidden="true" />
          <template v-else>2</template>
        </span>
        <span class="booking-progress__text">Details</span>
      </li>
      <li class="booking-progress__item" :class="{ 'is-active': paymentActive, 'is-done': paymentDone || confirmedDone }">
        <span class="booking-progress__num">
          <i v-if="paymentDone || confirmedDone" class="fa-solid fa-check" aria-hidden="true" />
          <template v-else>3</template>
        </span>
        <span class="booking-progress__text">Payment</span>
      </li>
      <li v-if="confirmedDone" class="booking-progress__item is-done">
        <span class="booking-progress__num"><i class="fa-solid fa-check" aria-hidden="true" /></span>
        <span class="booking-progress__text">Confirmed</span>
      </li>
    </ol>
  </nav>
</template>
