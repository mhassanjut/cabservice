<script setup lang="ts">
import { servicesFinalCta } from '~/data/servicesContent'
</script>

<template>
  <section class="services-cta" aria-labelledby="services-cta-heading">
    <div class="services-cta__media" aria-hidden="true">
      <NuxtImg
        :src="servicesFinalCta.image"
        alt=""
        width="1440"
        height="520"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="services-cta__overlay" aria-hidden="true" />
    <div class="services-cta__content">
      <h2 id="services-cta-heading" class="services-cta__heading">{{ servicesFinalCta.heading }}</h2>
      <p class="services-cta__body">{{ servicesFinalCta.body }}</p>
      <div class="services-cta__actions">
        <NuxtLink
          :to="servicesFinalCta.primary.href"
          :prefetch="false"
          class="services-btn services-btn--gold"
        >
          {{ servicesFinalCta.primary.label }}
        </NuxtLink>
        <NuxtLink
          :to="servicesFinalCta.secondary.href"
          :prefetch="false"
          class="services-btn services-btn--outline-light"
        >
          {{ servicesFinalCta.secondary.label }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
