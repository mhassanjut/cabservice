<script setup lang="ts">
import { faqFinalCta } from '~/data/faqContent'
</script>

<template>
  <section class="faq-cta" aria-labelledby="faq-cta-heading">
    <div class="faq-cta__media" aria-hidden="true">
      <NuxtImg
        :src="faqFinalCta.image"
        alt=""
        width="1440"
        height="520"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="faq-cta__overlay" aria-hidden="true" />
    <div class="faq-cta__content">
      <p class="faq-eyebrow faq-cta__eyebrow">{{ faqFinalCta.eyebrow }}</p>
      <h2 id="faq-cta-heading" class="faq-cta__heading">{{ faqFinalCta.heading }}</h2>
      <p class="faq-cta__body">{{ faqFinalCta.body }}</p>
      <div class="faq-cta__actions">
        <NuxtLink
          :to="faqFinalCta.primary.href"
          :prefetch="false"
          class="faq-btn faq-btn--gold"
        >
          {{ faqFinalCta.primary.label }}
        </NuxtLink>
        <NuxtLink
          :to="faqFinalCta.secondary.href"
          :prefetch="false"
          class="faq-btn faq-btn--outline-light"
        >
          {{ faqFinalCta.secondary.label }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
