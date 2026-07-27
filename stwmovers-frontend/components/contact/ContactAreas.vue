<script setup lang="ts">
import { contactAreas } from '~/data/contactContent'
</script>

<template>
  <section class="contact-section" aria-labelledby="contact-areas-heading">
    <div class="contact-container contact-areas__grid">
      <div class="contact-areas__media">
        <NuxtImg
          :src="contactAreas.image"
          :alt="contactAreas.imageAlt"
          width="620"
          height="560"
          sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:620px"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="contact-areas__content">
        <p class="contact-eyebrow">{{ contactAreas.eyebrow }}</p>
        <h2 id="contact-areas-heading" class="contact-heading contact-heading--sm">
          {{ contactAreas.heading }}
        </h2>
        <p class="contact-lead">{{ contactAreas.body }}</p>
        <ul class="contact-areas__cities">
          <li v-for="city in contactAreas.cities" :key="city" class="contact-city">{{ city }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
