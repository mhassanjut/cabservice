<script setup lang="ts">
import type { TourDto } from '~/types/api'
import { toursService } from '~/services/api/tours.service'
import { formatTourDuration, formatTourGuests, formatTourMeta, formatTourPrice } from '~/utils/tourFormat'
import TourCardSkeleton from '~/components/tours/TourCardSkeleton.vue'
import TourDetailsModal from '~/components/tours/TourDetailsModal.vue'

const tours = ref<TourDto[]>([])
const loading = ref(true)
const loadFailed = ref(false)

const load = async () => {
  loading.value = true
  loadFailed.value = false
  try {
    tours.value = await toursService.list()
  } catch {
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)

const skeletonCount = 4

const tourTags = (tour: TourDto) => {
  const tags = [formatTourDuration(tour), formatTourGuests(tour)].filter(
    (tag): tag is string => Boolean(tag),
  )
  return tags
}

const selectedTour = ref<TourDto | null>(null)

const openTour = (tour: TourDto) => {
  selectedTour.value = tour
}

const closeTour = () => {
  selectedTour.value = null
}
</script>

<template>
  <section id="tours-listing" class="home-section tp-listing" aria-labelledby="tours-listing-heading">
    <div class="container">
      <header class="tp-section-head">
        <h2 id="tours-listing-heading" class="home-display tp-section-head__title">Find Your Perfect Experience</h2>
        <p class="home-lead tp-section-head__lead">
          Choose from our most popular private tours, or create a fully custom itinerary with our concierge team.
        </p>
      </header>

      <div class="tp-list">
        <template v-if="loading">
          <TourCardSkeleton v-for="n in skeletonCount" :key="`tour-skeleton-${n}`" />
        </template>

        <template v-else-if="tours.length">
          <article
            v-for="(tour, index) in tours"
            :key="tour.id"
            class="tp-card"
            :class="{ 'tp-card--reverse': index % 2 === 1 }"
          >
            <div class="tp-card__media">
              <TourImage :src="tour.imageUrl" :alt="tour.title" />
            </div>
            <div class="tp-card__body">
              <p v-if="tour.category" class="tp-card__eyebrow">{{ tour.category }}</p>
              <h3 class="tp-card__title">{{ tour.title }}</h3>
              <p v-if="formatTourMeta(tour)" class="tp-card__meta">{{ formatTourMeta(tour) }}</p>

              <ul v-if="tourTags(tour).length" class="tp-card__tags">
                <li v-for="tag in tourTags(tour)" :key="tag" class="tp-tag">{{ tag }}</li>
              </ul>

              <p v-if="tour.shortDescription" class="tp-card__desc">{{ tour.shortDescription }}</p>

              <div class="tp-card__foot">
                <div class="tp-card__price">
                  <span class="tp-card__price-label">Starting from</span>
                  <span class="tp-card__price-value">{{ formatTourPrice(tour.startingPrice) }}</span>
                </div>
                <button type="button" class="home-btn tp-card__cta" @click="openTour(tour)">
                  View Tour
                </button>
              </div>
            </div>
          </article>
        </template>

        <p v-else class="tp-empty">
          {{
            loadFailed
              ? 'We could not load tours right now. Please refresh the page or try again shortly.'
              : 'No tours are available right now — please check back soon.'
          }}
        </p>
      </div>
    </div>

    <Teleport to="body">
      <TourDetailsModal v-if="selectedTour" :tour="selectedTour" @close="closeTour" />
    </Teleport>
  </section>
</template>
