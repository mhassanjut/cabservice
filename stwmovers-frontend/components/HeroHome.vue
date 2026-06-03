<script setup lang="ts">
import { routes } from '~/constants/routes'
</script>

<template>
  <section class="hero reveal-stagger" aria-labelledby="home-hero-title">
    <div class="hero__bg" aria-hidden="true" />
    <div class="hero__inner">
      <p class="eyebrow" style="margin: 0 0 1rem">Barcelona · Airport · City · Spain</p>
      <h1 id="home-hero-title" class="hero__title font-serif">
        Chauffeured transfers with
        <span class="hero__title-gold">quiet confidence</span>
      </h1>
      <p class="hero__lead">
        Airport arrivals, city-to-city runs, and on-demand black-car service across Barcelona and
        Spain — clear pricing, punctual drivers, confirmation over WhatsApp.
      </p>
      <div class="hero__pills">
        <span class="pill pill--gold">24/7 dispatch</span>
        <span class="pill">Meet &amp; greet</span>
        <span class="pill">Spain-wide</span>
      </div>
      <div class="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <span class="hero__scroll-line" />
      </div>
      <div style="margin-top: 1.75rem; display: flex; flex-wrap: wrap; gap: 12px">
        <NuxtLink class="btn btn--solid-gold" :to="routes.cars">View fleet</NuxtLink>
        <NuxtLink class="btn secondary" to="/#booking-section">Start booking</NuxtLink>
      </div>
    </div>
  </section>
</template>
