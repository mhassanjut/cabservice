<script setup lang="ts">
import type { ServiceSplitSection } from '~/data/servicesContent'

const props = defineProps<{ section: ServiceSplitSection }>()

const headingId = `services-${props.section.id}-heading`
const isReverse = props.section.imageSide === 'right'
const outlineClass =
  props.section.cta.variant === 'outline' ? 'services-btn--outline' : 'services-btn--gold'
</script>

<template>
  <section class="services-section" :aria-labelledby="headingId">
    <div
      class="services-container services-split__grid"
      :class="{ 'services-split__grid--reverse': isReverse }"
    >
      <div class="services-split__media">
        <NuxtImg
          :src="section.image"
          :alt="section.imageAlt"
          :width="section.imageWidth"
          :height="section.imageHeight"
          sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:50vw xxl:50vw"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="services-split__copy">
        <h2 :id="headingId" class="services-heading services-heading--sm">{{ section.heading }}</h2>
        <p class="services-lead">{{ section.body }}</p>
        <ul v-if="section.highlights?.length" class="services-tags">
          <li v-for="tag in section.highlights" :key="tag" class="services-tag">{{ tag }}</li>
        </ul>
        <div class="services-split__actions">
          <NuxtLink
            :to="section.cta.href"
            :prefetch="false"
            class="services-btn"
            :class="outlineClass"
          >
            {{ section.cta.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
