<script setup lang="ts">
import { servicesQuote } from '~/data/servicesContent'
</script>

<template>
  <section class="services-section" aria-labelledby="services-quote-heading">
    <div class="services-container services-quote">
      <blockquote class="services-quote__block">
        <p id="services-quote-heading" class="services-quote__text">{{ servicesQuote.quote }}</p>
        <p class="services-quote__attribution">{{ servicesQuote.attribution }}</p>
      </blockquote>
      <div class="services-quote__media">
        <NuxtImg
          :src="servicesQuote.image"
          alt="Passenger relaxing in the quiet cabin of a chauffeured car"
          width="1280"
          height="560"
          sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>
