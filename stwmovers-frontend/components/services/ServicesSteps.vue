<script setup lang="ts">
import { servicesSteps, servicesStepsHeading } from '~/data/servicesContent'
</script>

<template>
  <section class="services-section" aria-labelledby="services-steps-heading">
    <div class="services-container">
      <h2 id="services-steps-heading" class="services-heading services-heading--sm services-steps__heading">
        {{ servicesStepsHeading }}
      </h2>
      <div class="services-steps">
        <article v-for="step in servicesSteps" :key="step.step" class="services-step">
          <p class="services-step__num">{{ step.step }}</p>
          <h3 class="services-step__title">{{ step.title }}</h3>
          <p class="services-step__text">{{ step.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
