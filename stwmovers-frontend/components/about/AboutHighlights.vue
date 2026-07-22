<script setup lang="ts">
import { aboutFeatures, aboutHighlightsHeading } from '~/data/aboutContent'
</script>

<template>
  <section class="about-section" aria-labelledby="about-highlights-heading">
    <div class="about-container">
      <h2 id="about-highlights-heading" class="about-heading about-heading--sm about-highlights__heading">
        {{ aboutHighlightsHeading }}
      </h2>
      <ul class="about-features">
        <li v-for="feature in aboutFeatures" :key="feature.title" class="about-feature">
          <div class="about-feature__head">
            <i class="fa-solid fa-award about-feature__icon" aria-hidden="true" />
            <h3 class="about-feature__title">{{ feature.title }}</h3>
          </div>
          <p class="about-feature__text">{{ feature.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
