<script setup lang="ts">
import { aboutHero } from '~/data/aboutContent'
</script>

<template>
  <header class="about-hero">
    <div class="about-hero__media" aria-hidden="true">
      <NuxtImg
        :src="aboutHero.image"
        alt=""
        width="1440"
        height="760"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        loading="eager"
        fetchpriority="high"
        preload
        decoding="async"
      />
    </div>
    <div class="about-hero__overlay" aria-hidden="true" />
    <div class="about-hero__inner about-container">
      <div class="about-hero__header">
        <p class="about-eyebrow">{{ aboutHero.eyebrow }}</p>
        <h1 class="about-hero__title">{{ aboutHero.title }}</h1>
      </div>
      <div class="about-hero__footer">
        <p class="about-hero__body">{{ aboutHero.body }}</p>
        <div class="about-hero__actions">
          <NuxtLink :to="aboutHero.primary.href" :prefetch="false" class="about-btn about-btn--gold">
            {{ aboutHero.primary.label }}
          </NuxtLink>
          <NuxtLink :to="aboutHero.secondary.href" :prefetch="false" class="about-btn about-btn--outline-light">
            {{ aboutHero.secondary.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>
