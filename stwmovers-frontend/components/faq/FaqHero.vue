<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { faqHero } from '~/data/faqContent'
import { buildWhatsappUrl } from '~/utils/whatsapp'

const whatsappHref = buildWhatsappUrl({
  phone: siteConfig.whatsappNumber,
  text: 'Hello STW Movers, I have a question about booking a Barcelona transfer.',
})
</script>

<template>
  <header class="faq-hero">
    <div class="faq-hero__media" aria-hidden="true">
      <NuxtImg
        :src="faqHero.image"
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
    <div class="faq-hero__overlay" aria-hidden="true" />
    <div class="faq-hero__inner faq-container">
      <div class="faq-hero__header">
        <p class="faq-eyebrow" style="color: var(--home-gold)">{{ faqHero.eyebrow }}</p>
        <h1 class="faq-hero__title">{{ faqHero.title }}</h1>
      </div>
      <div class="faq-hero__footer">
        <div class="faq-hero__copy">
          <p class="faq-hero__body">{{ faqHero.body }}</p>
          <div class="faq-hero__pills">
            <span
              v-for="(pill, index) in faqHero.pills"
              :key="pill"
              class="faq-pill"
              :class="{ 'faq-pill--gold': index === 0 }"
            >
              {{ pill }}
            </span>
          </div>
        </div>
        <div class="faq-hero__actions">
          <NuxtLink :to="faqHero.primaryCta.href" :prefetch="false" class="faq-btn faq-btn--gold">
            {{ faqHero.primaryCta.label }}
          </NuxtLink>
          <a
            class="faq-btn faq-btn--outline-light"
            :href="whatsappHref"
            rel="noopener noreferrer"
            target="_blank"
          >
            <i class="fa-brands fa-whatsapp" aria-hidden="true" />
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
