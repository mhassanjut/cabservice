<script setup lang="ts">
import { homeBookingSteps } from '~/data/homeContent'
</script>

<template>
  <section class="home-section home-booking-steps" aria-labelledby="booking-steps-heading">
    <div class="container home-booking-steps__inner">
      <h2 id="booking-steps-heading" class="home-booking-steps__heading home-display home-display--lg">
        Booking Is Effortless
      </h2>
      <div class="home-steps">
        <article v-for="step in homeBookingSteps" :key="step.step" class="home-steps__item">
          <p class="home-steps__num">{{ step.step }}</p>
          <h3 class="home-steps__title">{{ step.title }}</h3>
          <p class="home-steps__text">{{ step.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
