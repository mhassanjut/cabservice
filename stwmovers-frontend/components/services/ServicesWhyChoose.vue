<script setup lang="ts">
import { servicesFeatures, servicesWhyChooseHeading } from '~/data/servicesContent'
</script>

<template>
  <section class="services-section" aria-labelledby="services-why-heading">
    <div class="services-container">
      <h2 id="services-why-heading" class="services-heading services-heading--sm services-why__heading">
        {{ servicesWhyChooseHeading }}
      </h2>
      <ul class="services-features">
        <li v-for="feature in servicesFeatures" :key="feature.title" class="services-feature">
          <div class="services-feature__head">
            <i class="fa-solid fa-award services-feature__icon" aria-hidden="true" />
            <h3 class="services-feature__title">{{ feature.title }}</h3>
          </div>
          <p class="services-feature__text">{{ feature.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
