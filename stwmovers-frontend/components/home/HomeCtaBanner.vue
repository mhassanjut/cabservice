<script setup lang="ts">
import { homeAnchors } from '~/constants/routes'
</script>

<template>
  <section class="home-cta" aria-labelledby="cta-heading">
    <div class="container">
      <div class="home-cta__inner">
      <div class="home-cta__media" aria-hidden="true">
        <img
          src="/img/home/cta-banner.jpg"
          alt=""
          loading="lazy"
          decoding="async"
          width="1440"
          height="854"
        />
        <div class="home-cta__overlay" />
      </div>
      <div class="home-cta__content">
        <h2 id="cta-heading">Where Will Your Next Journey Take You?</h2>
        <p>
          Whether it's an airport transfer, executive meeting, or private occasion, we're ready when you are.
        </p>
        <a class="home-btn home-btn--white home-cta__btn" :href="homeAnchors.booking">
          Book Your Journey
          <span class="home-icon-wrap" style="width: 1.5rem; height: 1.5rem">
            <img class="home-icon" src="/img/home/icons/arrow-outward-dark.svg" alt="" width="24" height="24" />
          </span>
        </a>
      </div>
      </div>
    </div>
  </section>
</template>
