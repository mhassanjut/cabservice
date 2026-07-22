<script setup lang="ts">
import { aboutPromise } from '~/data/aboutContent'
</script>

<template>
  <section class="about-promise" aria-labelledby="about-promise-heading">
    <div class="about-container">
      <div class="about-promise__card">
        <div class="about-promise__media" aria-hidden="true">
          <NuxtImg
            :src="aboutPromise.image"
            alt=""
            width="1440"
            height="600"
            sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div class="about-promise__overlay" aria-hidden="true" />
        <div class="about-promise__content">
          <h2 id="about-promise-heading" class="about-promise__heading">{{ aboutPromise.heading }}</h2>
          <p class="about-promise__body">{{ aboutPromise.body }}</p>
          <NuxtLink :to="aboutPromise.cta.href" :prefetch="false" class="about-btn about-btn--gold">
            {{ aboutPromise.cta.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
