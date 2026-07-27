<script setup lang="ts">
import { contactHero } from '~/data/contactContent'
</script>

<template>
  <header class="contact-hero">
    <div class="contact-hero__media" aria-hidden="true">
      <NuxtImg
        :src="contactHero.image"
        alt=""
        width="1440"
        height="780"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        loading="eager"
        fetchpriority="high"
        preload
        decoding="async"
      />
    </div>
    <div class="contact-hero__overlay" aria-hidden="true" />
    <div class="contact-hero__inner contact-container">
      <div class="contact-hero__header">
        <p class="contact-eyebrow">{{ contactHero.eyebrow }}</p>
        <h1 class="contact-hero__title">{{ contactHero.title }}</h1>
      </div>
      <div class="contact-hero__footer">
        <p class="contact-hero__body">{{ contactHero.body }}</p>
        <a :href="contactHero.cta.href" class="contact-btn contact-btn--gold">
          {{ contactHero.cta.label }}
        </a>
      </div>
    </div>
  </header>
</template>
