<script setup lang="ts">
import { homeAnchors } from '~/constants/routes'
</script>

<template>
  <section class="home-cta" aria-labelledby="cta-heading">
    <div class="container">
      <div class="home-cta__inner">
      <div class="home-cta__media" aria-hidden="true">
        <NuxtImg
          src="/img/home/cta-banner.jpg"
          alt=""
          loading="lazy"
          decoding="async"
          placeholder
          width="1440"
          height="854"
          sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        />
        <div class="home-cta__overlay" />
      </div>
      <div class="home-cta__content">
        <h2 id="cta-heading">Where Will Your Next Journey Take You?</h2>
        <p>
          Whether it's an airport transfer, executive meeting, or private occasion, we're ready when you are.
        </p>
        <NuxtLink class="home-btn home-btn--white home-cta__btn" :to="homeAnchors.booking" :prefetch="false">
          Book Your Journey
          <span class="home-icon-wrap" style="width: 1.5rem; height: 1.5rem">
            <NuxtImg class="home-icon" src="/img/home/icons/arrow-outward-dark.svg" alt="" width="24" height="24" />
          </span>
        </NuxtLink>
      </div>
      </div>
    </div>
  </section>
</template>
