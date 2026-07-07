<script setup lang="ts">
import { seoSections } from '~/config/seo'
import { homeAnchors } from '~/constants/routes'
</script>

<template>
  <section class="hero reveal-stagger" aria-labelledby="home-hero-title">
    <div class="hero__bg" aria-hidden="true" />
    <div class="hero__layout">
      <div class="hero__copy">
        <p class="eyebrow">Barcelona · BCN Airport · Catalonia · Spain</p>
        <h1 id="home-hero-title" class="hero__title font-serif">
          {{ seoSections.home.h1 }}
        </h1>
        <p class="hero__lead">
          Private Barcelona airport transfers, executive chauffeur service, and fixed-price city-to-city
          rides — punctual English-speaking drivers, meet &amp; greet, and confirmation over WhatsApp.
        </p>
        <div class="hero__pills">
          <span class="pill pill--gold">24/7 dispatch</span>
          <span class="pill">BCN meet &amp; greet</span>
          <span class="pill">Fixed pricing</span>
          <span class="pill">Premium Mercedes fleet</span>
        </div>
        <div class="hero__actions">
          <a class="btn btn--solid-gold" :href="homeAnchors.booking">Get instant quote</a>
        </div>
      </div>

      <div v-if="$slots.booking" id="booking-section" class="hero__booking">
        <slot name="booking" />
      </div>
    </div>
  </section>
</template>
