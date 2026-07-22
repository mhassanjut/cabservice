<script setup lang="ts">
import { aboutChauffeurs, aboutPeople } from '~/data/aboutContent'

const offsetClass = (offset: 'up' | 'down' | 'none') =>
  offset === 'none' ? '' : `about-chauffeur--${offset}`
</script>

<template>
  <section class="about-section" aria-labelledby="about-people-heading">
    <div class="about-container">
      <div class="about-people__header">
        <div>
          <p class="about-eyebrow">{{ aboutPeople.eyebrow }}</p>
          <h2 id="about-people-heading" class="about-heading about-heading--sm about-people__heading">
            {{ aboutPeople.heading }}
          </h2>
        </div>
        <p class="about-lead about-people__subtitle">{{ aboutPeople.subtitle }}</p>
      </div>
      <div class="about-collage">
        <figure
          v-for="person in aboutChauffeurs"
          :key="person.caption"
          class="about-chauffeur"
          :class="offsetClass(person.offset)"
        >
          <div class="about-chauffeur__media">
            <NuxtImg
              :src="person.image"
              :alt="person.alt"
              :width="person.imageWidth"
              :height="person.imageHeight"
              sizes="xs:100vw sm:100vw md:33vw lg:33vw xl:33vw xxl:33vw"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption class="about-chauffeur__caption">{{ person.caption }}</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
