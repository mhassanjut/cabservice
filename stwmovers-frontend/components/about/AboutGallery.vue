<script setup lang="ts">
import { aboutGallery, aboutGalleryImages } from '~/data/aboutContent'
</script>

<template>
  <section class="about-section" aria-labelledby="about-gallery-heading">
    <div class="about-container">
      <div class="about-gallery__header">
        <p class="about-eyebrow">{{ aboutGallery.eyebrow }}</p>
        <h2 id="about-gallery-heading" class="about-heading about-heading--sm">
          {{ aboutGallery.heading }}
        </h2>
      </div>
      <div class="about-gallery__grid">
        <div
          v-for="image in aboutGalleryImages"
          :key="image.image"
          class="about-gallery__item"
          :class="`about-gallery__item--${image.span}`"
        >
          <NuxtImg
            :src="image.image"
            :alt="image.alt"
            :width="image.span === 'wide' ? 780 : 480"
            :height="440"
            sizes="xs:100vw sm:100vw md:60vw lg:60vw xl:60vw xxl:60vw"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  </section>
</template>
