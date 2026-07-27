<script setup lang="ts">
import { servicesExperiences } from '~/data/servicesContent'
</script>

<template>
  <section class="services-section" aria-labelledby="services-experiences-heading">
    <div class="services-container">
      <div class="services-experiences__header">
        <h2 id="services-experiences-heading" class="services-heading services-heading--sm">
          {{ servicesExperiences.heading }}
        </h2>
        <p class="services-lead">{{ servicesExperiences.body }}</p>
      </div>
      <div class="services-collage">
        <div
          v-for="item in servicesExperiences.collage"
          :key="item.image"
          class="services-collage__item"
          :class="`services-collage__item--${item.span}`"
        >
          <NuxtImg
            :src="item.image"
            :alt="item.alt"
            width="628"
            :height="item.span === 'tall' ? 480 : 360"
            sizes="100vw md:50vw"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  </section>
</template>
