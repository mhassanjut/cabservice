<script setup lang="ts">
import { servicesHero } from '~/data/servicesContent'
</script>

<template>
  <header class="services-hero">
    <div class="services-hero__media" aria-hidden="true">
      <NuxtImg
        :src="servicesHero.image"
        alt=""
        width="1440"
        height="820"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        loading="eager"
        fetchpriority="high"
        preload
        decoding="async"
      />
    </div>
    <div class="services-hero__overlay" aria-hidden="true" />
    <div class="services-hero__inner services-container">
      <div class="services-hero__header">
        <p class="services-eyebrow" style="color: var(--home-gold)">{{ servicesHero.eyebrow }}</p>
        <h1 class="services-hero__title">{{ servicesHero.title }}</h1>
      </div>
      <div class="services-hero__footer">
        <p class="services-hero__body">{{ servicesHero.body }}</p>
        <NuxtLink :to="servicesHero.cta.href" :prefetch="false" class="services-btn services-btn--gold">
          {{ servicesHero.cta.label }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
