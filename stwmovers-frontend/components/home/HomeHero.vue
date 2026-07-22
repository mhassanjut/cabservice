<script setup lang="ts">
const HERO_SLIDES = [
  '/img/home/hero-1.png',
  '/img/home/hero-2.png',
  '/img/home/hero-3.png',
] as const

const AUTOPLAY_MS = 5500

const activeIndex = ref(0)
const prefersReducedMotion = ref(false)

let autoplayTimer = 0

const trackStyle = computed(() => ({
  transform: `translate3d(-${activeIndex.value * 100}%, 0, 0)`,
  transition: 'transform 0.85s ease',
}))

function nextSlide() {
  const total = HERO_SLIDES.length
  activeIndex.value = (activeIndex.value + 1) % total
}

function startAutoplay() {
  stopAutoplay()
  if (prefersReducedMotion.value) return
  autoplayTimer = window.setInterval(nextSlide, AUTOPLAY_MS)
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = 0
  }
}

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <header class="home-hero">
    <div class="home-hero__media" aria-hidden="true">
      <div class="home-hero__slider">
        <div class="home-hero__track" :style="trackStyle">
          <div
            v-for="(src, index) in HERO_SLIDES"
            :key="src"
            class="home-hero__slide"
          >
            <NuxtImg
              :src="src"
              alt=""
              width="1440"
              height="794"
              sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : undefined"
              :preload="index === 0 ? true : undefined"
              decoding="async"
              draggable="false"
            />
          </div>
        </div>
      </div>
      <div class="home-hero__overlay" />
    </div>
    <div class="home-hero__content">
      <div class="container container--wide home-hero__content-inner">
        <h1 class="home-hero__title">Travel Begins Before You Arrive.</h1>
        <p class="home-hero__lead">
          From airport arrivals to executive meetings and private occasions, enjoy chauffeur services designed around comfort, reliability, and every detail that matters.
        </p>
      </div>
    </div>
    <div class="home-hero__booking">
      <div class="container container--wide">
        <BookingForm variant="bar" />
      </div>
    </div>
  </header>
</template>
