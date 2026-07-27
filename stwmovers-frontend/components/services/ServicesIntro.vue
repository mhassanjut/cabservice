<script setup lang="ts">
import { servicesIntro } from '~/data/servicesContent'
</script>

<template>
  <section class="services-section" aria-labelledby="services-intro-heading">
    <div class="services-container services-intro__grid">
      <div class="services-intro__copy">
        <h2 id="services-intro-heading" class="services-heading">{{ servicesIntro.heading }}</h2>
        <p class="services-lead">{{ servicesIntro.body }}</p>
      </div>
      <div class="services-intro__media">
        <NuxtImg
          :src="servicesIntro.image"
          alt="Chauffeur opening the door of a luxury vehicle for a guest"
          width="580"
          height="480"
          sizes="100vw md:50vw"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>
