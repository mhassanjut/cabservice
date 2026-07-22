<script setup lang="ts">
import { aboutPhilosophy } from '~/data/aboutContent'
</script>

<template>
  <section class="about-section" aria-labelledby="about-philosophy-heading">
    <div class="about-container about-philosophy__grid">
      <div class="about-philosophy__media">
        <NuxtImg
          :src="aboutPhilosophy.image"
          alt="A chauffeur attending to the fine details of the journey"
          width="680"
          height="560"
          sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:50vw xxl:50vw"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="about-philosophy__copy">
        <p class="about-eyebrow">{{ aboutPhilosophy.eyebrow }}</p>
        <h2 id="about-philosophy-heading" class="about-heading about-heading--sm">
          {{ aboutPhilosophy.heading }}
        </h2>
        <p class="about-lead">{{ aboutPhilosophy.body }}</p>
      </div>
    </div>
  </section>
</template>
