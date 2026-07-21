<script setup lang="ts">
import { homeBookingSteps } from '~/data/homeContent'
</script>

<template>
  <section class="home-section" aria-labelledby="booking-steps-heading">
    <h2 id="booking-steps-heading" class="home-display home-display--lg" style="margin: 0 0 5rem; text-align: center">
      Booking Is Effortless
    </h2>
    <div class="home-steps">
      <article v-for="step in homeBookingSteps" :key="step.step" class="home-steps__item">
        <p class="home-steps__num">{{ step.step }}</p>
        <h3>{{ step.title }}</h3>
        <p>{{ step.text }}</p>
      </article>
    </div>
  </section>
</template>
