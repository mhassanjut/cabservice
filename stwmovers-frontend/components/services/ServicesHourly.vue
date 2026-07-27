<script setup lang="ts">
import { servicesHourly } from '~/data/servicesContent'
</script>

<template>
  <section class="services-section" aria-labelledby="services-hourly-heading">
    <div class="services-container">
      <div class="services-hourly__header">
        <h2 id="services-hourly-heading" class="services-heading services-heading--sm">
          {{ servicesHourly.heading }}
        </h2>
        <p class="services-lead">{{ servicesHourly.body }}</p>
      </div>
      <div class="services-hourly__media">
        <NuxtImg
          :src="servicesHourly.image"
          alt="Chauffeur standing beside a luxury car ready for an hourly booking"
          width="1280"
          height="500"
          sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>
