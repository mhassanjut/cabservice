<script setup lang="ts">
import { homeAnchors } from '~/constants/routes'
import { homeJourneyCards } from '~/data/homeContent'
</script>

<template>
  <section id="journeys" class="home-section home-journeys" aria-labelledby="journeys-heading">
    <div>
      <h2 id="journeys-heading" class="home-display home-display--xl" style="margin: 0 0 3rem">
        Every Journey is Different. So is Every Experience.
      </h2>
      <p class="home-lead" style="margin: 0 0 3rem">
        Choose a service tailored to your plans—from airport transfers and executive travel to private city
        experiences and special occasions.
      </p>
      <a class="home-btn" :href="homeAnchors.booking">Discover Every Journey</a>
    </div>
    <div class="home-journeys__collage" aria-hidden="true">
      <article v-for="card in homeJourneyCards" :key="card.title" class="home-journey-card">
        <img
          :src="card.image"
          :alt="`${card.title} — Barcelona destination`"
          loading="lazy"
          decoding="async"
          width="209"
          height="300"
        />
        <span class="home-journey-card__btn">
          <span class="home-icon-wrap" style="width: 1rem; height: 1rem">
            <img class="home-icon" src="/img/home/icons/arrow-up-right.svg" alt="" width="16" height="16" />
          </span>
        </span>
        <div class="home-journey-card__label">
          <span>{{ card.title }}</span>
        </div>
      </article>
    </div>
  </section>
</template>
