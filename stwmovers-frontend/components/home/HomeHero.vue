<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'

const HERO_SIZES = 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw'

const HERO_SLIDES = [
  { src: '/img/home/hero-1.webp', width: 1440, height: 780 },
  { src: '/img/home/hero-2.webp', width: 1440, height: 820 },
  { src: '/img/home/hero-3.webp', width: 1440, height: 760 },
] as const

const swiperModules = [Autoplay, EffectFade]

const autoplayOptions = {
  delay: 3500,
  disableOnInteraction: false,
  // Don't wait for the CSS transitionend event to resume autoplay. On machines
  // with "reduce motion" (transitions forced to ~0ms) the event can be missed,
  // which is what stalls the loop after the first cycle.
  waitForTransition: false,
}
</script>

<template>
  <header class="home-hero">
    <div class="home-hero__media" aria-hidden="true">
      <div class="home-hero__slider">
        <ClientOnly>
          <Swiper
            class="home-hero__swiper"
            :modules="swiperModules"
            :slides-per-view="1"
            :loop="true"
            effect="fade"
            :fade-effect="{ crossFade: true }"
            :speed="850"
            :autoplay="autoplayOptions"
            :allow-touch-move="true"
          >
            <SwiperSlide
              v-for="(slide, index) in HERO_SLIDES"
              :key="slide.src"
              class="home-hero__slide"
            >
              <NuxtImg
                :src="slide.src"
                alt=""
                preset="hero"
                :width="slide.width"
                :height="slide.height"
                :sizes="HERO_SIZES"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'low'"
                decoding="async"
                draggable="false"
              />
            </SwiperSlide>
          </Swiper>

          <!-- SSR / pre-hydration fallback: render the first frame statically so
               the hero never paints blank before Swiper initializes. -->
          <template #fallback>
            <div class="home-hero__slide">
              <NuxtImg
                :src="HERO_SLIDES[0].src"
                alt=""
                preset="hero"
                :width="HERO_SLIDES[0].width"
                :height="HERO_SLIDES[0].height"
                :sizes="HERO_SIZES"
                loading="eager"
                fetchpriority="high"
                preload
                decoding="async"
                draggable="false"
              />
            </div>
          </template>
        </ClientOnly>
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
