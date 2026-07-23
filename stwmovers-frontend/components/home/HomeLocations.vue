<script setup lang="ts">
import { homeAnchors } from '~/constants/routes'
import { seoSections } from '~/config/seo'
import { homeLocationCards } from '~/data/homeContent'
import { layoutLocationCards } from '~/utils/homeLocationGrid'

const transferCards = computed(() =>
  layoutLocationCards(homeLocationCards.filter((card) => card.type === 'transfer')),
)

// Match the grid: 2 columns on mobile, 4 columns from 768px up.
// Map each card's column span to the width it actually renders at so the
// generated srcset serves an appropriately sized image per breakpoint.
function cardSizes(columnSpan: number): string {
  // Note: @nuxt/image needs screen-prefixed sizes; a bare "100vw" breaks srcset generation.
  if (columnSpan === 4) return 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw'
  if (columnSpan === 2) return 'xs:100vw sm:100vw md:50vw lg:50vw xl:50vw xxl:50vw'
  return 'xs:50vw sm:50vw md:25vw lg:25vw xl:25vw xxl:25vw'
}
</script>

<template>
  <section id="global" class="home-section" aria-labelledby="locations-heading">
    <div class="container">
      <header class="home-locations__header">
      <h2 id="locations-heading" class="home-display home-display--md" style="margin: 0 0 1rem">
        Barcelona &amp; Costa Brava Transfers
      </h2>
      <p class="home-lead home-lead--sm">
        Airport transfers and coastal destinations across Barcelona and the Costa Brava region.
      </p>
      <nav aria-label="Popular transfer routes" style="margin-top: 1.5rem">
        <ul style="display: flex; flex-wrap: wrap; gap: 0.75rem 1.5rem; list-style: none; margin: 0; padding: 0">
          <li v-for="route in seoSections.home.routes" :key="route.slug">
            <NuxtLink :to="homeAnchors.booking" :prefetch="false">{{ route.name }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>
    <div class="home-locations__grid">
      <NuxtLink
        v-for="card in transferCards"
        :key="card.id"
        :to="homeAnchors.booking"
        :prefetch="false"
        class="home-location-card"
        :class="{
          'home-location-card--wide': card.columnSpan === 2,
          'home-location-card--full': card.columnSpan === 4,
          'home-location-card--tall': card.tall,
        }"
      >
        <NuxtImg
          :src="card.image"
          :alt="`${card.title} private transfer`"
          loading="lazy"
          decoding="async"
          placeholder
          width="302"
          height="220"
          :sizes="cardSizes(card.columnSpan)"
        />
        <div class="home-location-card__overlay" aria-hidden="true" />
        <h3 class="home-location-card__title">{{ card.title }}</h3>
        <span class="home-location-card__arrow" aria-hidden="true">
          <span class="home-icon-wrap">
            <NuxtImg class="home-icon" src="/img/home/icons/arrow-outward.svg" alt="" width="17" height="17" />
          </span>
        </span>
      </NuxtLink>
    </div>
    </div>
  </section>
</template>
