<script setup lang="ts">
import { homeAnchors } from '~/constants/routes'
import { seoSections } from '~/config/seo'
import { homeLocationCards } from '~/data/homeContent'
import { layoutLocationCards } from '~/utils/homeLocationGrid'

const transferCards = computed(() =>
  layoutLocationCards(homeLocationCards.filter((card) => card.type === 'transfer')),
)
</script>

<template>
  <section id="global" class="home-section" aria-labelledby="locations-heading">
    <div class="container">
      <header style="margin-bottom: 4rem">
      <h2 id="locations-heading" class="home-display home-display--md" style="margin: 0 0 1rem">
        Barcelona &amp; Costa Brava Transfers
      </h2>
      <p class="home-lead home-lead--sm">
        Airport transfers and coastal destinations across Barcelona and the Costa Brava region.
      </p>
      <nav aria-label="Popular transfer routes" style="margin-top: 1.5rem">
        <ul style="display: flex; flex-wrap: wrap; gap: 0.75rem 1.5rem; list-style: none; margin: 0; padding: 0">
          <li v-for="route in seoSections.home.routes" :key="route.slug">
            <a :href="homeAnchors.booking">{{ route.name }}</a>
          </li>
        </ul>
      </nav>
    </header>
    <div class="home-locations__grid">
      <a
        v-for="card in transferCards"
        :key="card.id"
        :href="homeAnchors.booking"
        class="home-location-card"
        :class="{
          'home-location-card--wide': card.columnSpan === 2,
          'home-location-card--full': card.columnSpan === 4,
          'home-location-card--tall': card.tall,
        }"
      >
        <img
          :src="card.image"
          :alt="`${card.title} private transfer`"
          loading="lazy"
          decoding="async"
          width="302"
          height="220"
        />
        <div class="home-location-card__overlay" aria-hidden="true" />
        <h3 class="home-location-card__title">{{ card.title }}</h3>
        <span class="home-location-card__arrow" aria-hidden="true">
          <span class="home-icon-wrap">
            <img class="home-icon" src="/img/home/icons/arrow-outward.svg" alt="" width="17" height="17" />
          </span>
        </span>
      </a>
    </div>
    </div>
  </section>
</template>
