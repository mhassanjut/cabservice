<script setup lang="ts">
import { aboutTestimonial } from '~/data/aboutContent'
</script>

<template>
  <section class="about-section" aria-labelledby="about-testimonial-heading">
    <div class="about-container">
      <p id="about-testimonial-heading" class="about-eyebrow about-testimonial__eyebrow">
        {{ aboutTestimonial.eyebrow }}
      </p>
      <div class="about-testimonial__grid">
        <blockquote class="about-testimonial__block">
          <p class="about-testimonial__quote">{{ aboutTestimonial.quote }}</p>
          <p class="about-testimonial__body">{{ aboutTestimonial.body }}</p>
        </blockquote>
        <div class="about-testimonial__visual">
          <div class="about-testimonial__photo-stack">
            <NuxtImg
              class="about-testimonial__photo"
              :src="aboutTestimonial.image"
              :alt="`${aboutTestimonial.authorName} portrait`"
              width="187"
              height="162"
              sizes="xs:80vw sm:40vw md:14rem"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="about-testimonial__author-info">
            <p class="about-testimonial__author-name">{{ aboutTestimonial.authorName }}</p>
            <p class="about-testimonial__author-company">{{ aboutTestimonial.authorCompany }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
