<script setup lang="ts">
import { aboutFinalCta } from '~/data/aboutContent'
</script>

<template>
  <section class="about-cta" aria-labelledby="about-cta-heading">
    <div class="about-cta__media" aria-hidden="true">
      <NuxtImg
        :src="aboutFinalCta.image"
        alt=""
        width="1440"
        height="520"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="about-cta__overlay" aria-hidden="true" />
    <div class="about-cta__content">
      <h2 id="about-cta-heading" class="about-cta__heading">{{ aboutFinalCta.heading }}</h2>
      <p class="about-cta__body">{{ aboutFinalCta.body }}</p>
      <div class="about-cta__actions">
        <NuxtLink :to="aboutFinalCta.primary.href" :prefetch="false" class="about-btn about-btn--gold">
          {{ aboutFinalCta.primary.label }}
        </NuxtLink>
        <NuxtLink :to="aboutFinalCta.secondary.href" :prefetch="false" class="about-btn about-btn--outline-light">
          {{ aboutFinalCta.secondary.label }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
