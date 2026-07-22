<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { homeExperienceTiles } from '~/data/homeContent'

const line1Ref = ref<HTMLElement | null>(null)
const line2Ref = ref<HTMLElement | null>(null)

const swiperModules = [Autoplay]

// Continuous marquee: lower speed (ms per slide) = faster scroll.
const MARQUEE_SPEED = 4200

const autoplayOptions = {
  delay: 0,
  disableOnInteraction: false,
}

let headingResizeObserver: ResizeObserver | null = null

function syncHeadingLine2Width() {
  const line1 = line1Ref.value
  const line2 = line2Ref.value
  if (!line1 || !line2) return

  // On mobile the heading wraps naturally; don't pin line 2 to line 1's width.
  if (window.matchMedia('(max-width: 767px)').matches) {
    line2.style.width = ''
    return
  }

  line2.style.width = `${line1.getBoundingClientRect().width}px`
}

onMounted(() => {
  nextTick(() => {
    syncHeadingLine2Width()
    headingResizeObserver = new ResizeObserver(syncHeadingLine2Width)
    if (line1Ref.value) headingResizeObserver.observe(line1Ref.value)
    window.addEventListener('resize', syncHeadingLine2Width, { passive: true })
    document.fonts?.ready.then(syncHeadingLine2Width)
  })
})

onUnmounted(() => {
  headingResizeObserver?.disconnect()
  window.removeEventListener('resize', syncHeadingLine2Width)
})
</script>

<template>
  <section id="experience" class="home-section home-experience" aria-labelledby="experience-heading">
    <div class="container">
      <div class="home-experience__inner">
        <div class="home-experience__header">
          <div class="home-experience__header-copy">
            <h2 id="experience-heading" class="home-experience__heading">
              <span ref="line1Ref" class="home-experience__heading-line1">From Arrival To Destination, Every</span>
              <span ref="line2Ref" class="home-experience__heading-line2">Detail Is Taken Care Of.</span>
            </h2>
            <p class="home-experience__lead">
              Whether you're arriving for business, celebrating a special occasion, or discovering a new city, your
              journey is handled with professionalism, discretion, and genuine hospitality from start to finish.
            </p>
          </div>
        </div>
        <div class="home-experience__carousel-viewport">
          <Swiper
            class="home-experience__carousel"
            :modules="swiperModules"
            slides-per-view="auto"
            :space-between="24"
            :loop="true"
            :speed="MARQUEE_SPEED"
            :autoplay="autoplayOptions"
            :allow-touch-move="false"
            role="region"
            aria-roledescription="carousel"
            aria-label="Experience services"
          >
            <SwiperSlide
              v-for="(tile, index) in homeExperienceTiles"
              :key="tile.title"
              class="home-experience__tile"
              :style="{ '--tile-height': `${tile.height}px` }"
              role="group"
              :aria-label="`${index + 1} of ${homeExperienceTiles.length}: ${tile.title}`"
            >
              <!-- Bundled (?url) asset — keep as <img>; @nuxt/image IPX can't process build-asset URLs -->
              <img
                :src="tile.image"
                :alt="`${tile.title} — STW Movers Barcelona chauffeur service`"
                loading="lazy"
                decoding="async"
                draggable="false"
                width="628"
                :height="tile.height"
              />
              <div class="home-experience__tile-overlay" aria-hidden="true" />
              <div class="home-experience__tile-copy">
                <h3>{{ tile.title }}</h3>
                <p>{{ tile.subtitle }}</p>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  </section>
</template>
