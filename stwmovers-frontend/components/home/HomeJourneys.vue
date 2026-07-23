<script setup lang="ts">
import { homeAnchors } from '~/constants/routes'
import {
  homeJourneyCards,
  homeJourneyCardSize,
  homeJourneyGroupBottom,
  homeJourneyGroupTop,
  type HomeJourneyCard,
} from '~/data/homeContent'

const topCards = computed(() => homeJourneyCards.filter((card) => card.group === 'top'))
const bottomCards = computed(() => homeJourneyCards.filter((card) => card.group === 'bottom'))

function cardStyle(card: HomeJourneyCard, group: { width: number; height: number }) {
  return {
    left: `${(card.left / group.width) * 100}%`,
    top: `${(card.top / group.height) * 100}%`,
    width: `${(homeJourneyCardSize.width / group.width) * 100}%`,
  }
}
</script>

<template>
  <section id="journeys" class="home-section home-journeys" aria-labelledby="journeys-heading">
    <div class="container">
      <div class="home-journeys__inner">
      <div class="home-journeys__copy">
        <h2 id="journeys-heading" class="home-journeys__heading">
          Every Journey is Different. So is Every Experience.
        </h2>
        <p class="home-journeys__lead">
          Choose a service tailored to your plans—from airport transfers and executive travel to private city
          experiences and special occasions.
        </p>
        <NuxtLink class="home-journeys__cta" :to="homeAnchors.booking" :prefetch="false">Discover Every Journey</NuxtLink>
      </div>

      <div class="home-journeys__collage" aria-hidden="true">
        <div class="home-journeys__group home-journeys__group--top">
          <article
            v-for="card in topCards"
            :key="card.id"
            class="home-journey-card"
            :style="cardStyle(card, homeJourneyGroupTop)"
          >
            <NuxtImg
              class="home-journey-card__photo"
              :src="card.image"
              :alt="`${card.title} — Barcelona destination`"
              loading="lazy"
              decoding="async"
              placeholder
              width="209"
              height="300"
              sizes="xs:45vw sm:220px md:220px lg:220px xl:220px xxl:220px"
            />
            <div class="home-journey-card__overlay">
              <span class="home-journey-card__btn">
                <span class="home-icon-wrap home-journey-card__btn-icon">
                  <NuxtImg class="home-icon" src="/img/home/icons/arrow-up-right.svg" alt="" width="16" height="16" />
                </span>
              </span>
              <div class="home-journey-card__label-wrap">
                <div class="home-journey-card__label">
                  <span>{{ card.title }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div class="home-journeys__group home-journeys__group--bottom">
          <article
            v-for="card in bottomCards"
            :key="card.id"
            class="home-journey-card"
            :style="cardStyle(card, homeJourneyGroupBottom)"
          >
            <NuxtImg
              class="home-journey-card__photo"
              :src="card.image"
              :alt="`${card.title} — Barcelona destination`"
              loading="lazy"
              decoding="async"
              placeholder
              width="209"
              height="300"
              sizes="xs:45vw sm:220px md:220px lg:220px xl:220px xxl:220px"
            />
            <div class="home-journey-card__overlay">
              <span class="home-journey-card__btn">
                <span class="home-icon-wrap home-journey-card__btn-icon">
                  <NuxtImg class="home-icon" src="/img/home/icons/arrow-up-right.svg" alt="" width="16" height="16" />
                </span>
              </span>
              <div class="home-journey-card__label-wrap">
                <div class="home-journey-card__label">
                  <span>{{ card.title }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>
