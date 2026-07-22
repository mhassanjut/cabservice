<script setup lang="ts">
import { routes } from '~/constants/routes'
import {
  homeFleetTabs,
  homeFleetVehicles,
  type HomeFleetTabId,
} from '~/data/homeContent'

const activeTab = ref<HomeFleetTabId>('all')
const carouselRef = ref<HTMLElement | null>(null)
const activePage = ref(0)
const cardsPerView = ref(2)

const filtered = computed(() => {
  const tab = activeTab.value
  if (tab === 'all') return homeFleetVehicles
  return homeFleetVehicles.filter((vehicle) => vehicle.categories.includes(tab))
})

const totalPages = computed(() => {
  const count = filtered.value.length
  if (!count) return 1
  return Math.ceil(count / cardsPerView.value)
})

const paginationBars = computed(() =>
  Array.from({ length: totalPages.value }, (_, index) => ({
    index,
    active: index === activePage.value,
  })),
)

function updateCardsPerView() {
  cardsPerView.value = window.matchMedia('(min-width: 900px)').matches ? 2 : 1
}

function getPageStride(el: HTMLElement, card: HTMLElement) {
  const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || '0')
  return (card.offsetWidth + gap) * cardsPerView.value
}

const canGoPrev = computed(() => activePage.value > 0)
const canGoNext = computed(() => activePage.value < totalPages.value - 1)

function syncActivePage() {
  const el = carouselRef.value
  if (!el) return

  const card = el.querySelector<HTMLElement>('.home-fleet__card')
  if (!card) {
    activePage.value = 0
    return
  }

  const maxScroll = el.scrollWidth - el.clientWidth
  if (maxScroll <= 1) {
    activePage.value = 0
    return
  }

  if (el.scrollLeft <= 1) {
    activePage.value = 0
    return
  }

  if (el.scrollLeft >= maxScroll - 1) {
    activePage.value = totalPages.value - 1
    return
  }

  const stride = getPageStride(el, card)
  activePage.value = Math.min(
    totalPages.value - 1,
    Math.max(0, Math.round(el.scrollLeft / stride)),
  )
}

function scrollToPage(page: number) {
  const el = carouselRef.value
  if (!el) return

  const card = el.querySelector<HTMLElement>('.home-fleet__card')
  if (!card) return

  const stride = getPageStride(el, card)
  const nextPage = Math.min(totalPages.value - 1, Math.max(0, page))

  el.scrollTo({ left: stride * nextPage, behavior: 'smooth' })
  activePage.value = nextPage
}

function goPrev() {
  scrollToPage(activePage.value - 1)
}

function goNext() {
  scrollToPage(activePage.value + 1)
}

watch(activeTab, () => {
  activePage.value = 0
  nextTick(() => {
    carouselRef.value?.scrollTo({ left: 0, behavior: 'auto' })
    syncActivePage()
  })
})

watch(totalPages, (pages) => {
  if (activePage.value > pages - 1) {
    activePage.value = Math.max(0, pages - 1)
    nextTick(() => scrollToPage(activePage.value))
  }
})

function onResize() {
  updateCardsPerView()
  nextTick(() => syncActivePage())
}

let carouselEl: HTMLElement | null = null

onMounted(() => {
  updateCardsPerView()
  carouselEl = carouselRef.value
  syncActivePage()
  window.addEventListener('resize', onResize)
  carouselEl?.addEventListener('scroll', syncActivePage, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  carouselEl?.removeEventListener('scroll', syncActivePage)
})
</script>

<template>
  <section id="fleet" class="home-section home-section--white home-fleet" aria-labelledby="fleet-heading">
    <div class="container container--wide">
      <header class="home-fleet__header">
      <h2 id="fleet-heading" class="home-fleet__heading">
        Travel In Exceptional Comfort.
      </h2>
      <p class="home-fleet__lead">
        A carefully selected fleet of luxury sedans, executive SUVs, and spacious vans—maintained to the highest
        standards for every journey.
      </p>
    </header>

    <div class="home-fleet__controls">
      <div class="home-fleet__tabs" role="tablist" aria-label="Filter fleet">
        <button
          v-for="tab in homeFleetTabs"
          :key="tab.id"
          type="button"
          class="home-fleet__tab"
          :class="{ 'is-active': activeTab === tab.id }"
          role="tab"
          :aria-selected="activeTab === tab.id"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="home-fleet__nav">
        <button
          type="button"
          class="home-fleet__nav-btn home-fleet__nav-btn--prev"
          aria-label="Previous vehicles"
          :disabled="!canGoPrev"
          @click="goPrev"
        >
          <span class="home-icon-wrap home-fleet__nav-icon">
            <NuxtImg class="home-icon" src="/img/home/icons/arrow-back.svg" alt="" width="17" height="17" />
          </span>
        </button>
        <button
          type="button"
          class="home-fleet__nav-btn home-fleet__nav-btn--next"
          aria-label="Next vehicles"
          :disabled="!canGoNext"
          @click="goNext"
        >
          <span class="home-icon-wrap home-fleet__nav-icon home-fleet__nav-icon--next">
            <NuxtImg class="home-icon" src="/img/home/icons/arrow-back.svg" alt="" width="17" height="17" />
          </span>
        </button>
      </div>
    </div>

    <div class="home-fleet__stage">
      <div ref="carouselRef" class="home-fleet__carousel" role="list">
        <article
          v-for="vehicle in filtered"
          :key="vehicle.id"
          class="home-fleet__card"
          role="listitem"
        >
          <div class="home-fleet__card-head">
            <h3 class="home-fleet__card-title">{{ vehicle.name }}</h3>
            <div class="home-fleet__card-meta">
              <span class="home-fleet__badge">
                <span class="home-icon-wrap home-fleet__badge-icon home-fleet__badge-icon--person">
                  <NuxtImg class="home-icon" src="/img/home/icons/person.svg" alt="" width="20" height="20" />
                </span>
                <span class="home-fleet__badge-value">{{ vehicle.seats }}</span>
              </span>
              <span class="home-fleet__badge">
                <span class="home-icon-wrap home-fleet__badge-icon home-fleet__badge-icon--work">
                  <NuxtImg class="home-icon" src="/img/home/icons/work.svg" alt="" width="17" height="17" />
                </span>
                <span class="home-fleet__badge-value">{{ vehicle.bags }}</span>
              </span>
            </div>
          </div>

          <div class="home-fleet__card-media">
            <NuxtImg
              class="home-fleet__card-image"
              :src="vehicle.image"
              :alt="`${vehicle.name} — executive chauffeur vehicle Barcelona`"
              loading="lazy"
              decoding="async"
            />
          </div>

          <NuxtLink class="home-fleet__card-cta" :to="routes.cars">
            Book Now
            <span class="home-fleet__card-cta-icon">
              <NuxtImg class="home-icon" src="/img/home/icons/arrow-outward-light.svg" alt="" width="17" height="17" />
            </span>
          </NuxtLink>
        </article>
      </div>

      <div class="home-fleet__pagination" aria-hidden="true">
        <span
          v-for="bar in paginationBars"
          :key="bar.index"
          class="home-fleet__pagination-bar"
          :class="{ 'is-active': bar.active }"
        />
      </div>
    </div>
    </div>
  </section>
</template>
