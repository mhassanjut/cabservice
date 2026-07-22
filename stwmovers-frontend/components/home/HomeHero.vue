<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

const HERO_SLIDES = [
  '/img/home/hero-1.png',
  '/img/home/hero-2.png',
  '/img/home/hero-3.png',
] as const

const swiperModules = [Autoplay]

const autoplayOptions = {
  delay: 3500,
  disableOnInteraction: false,
}
</script>

<template>
  <header class="home-hero">
    <div class="home-hero__media" aria-hidden="true">
      <div class="home-hero__slider">
        <Swiper
          class="home-hero__swiper"
          :modules="swiperModules"
          :slides-per-view="1"
          :loop="true"
          :speed="850"
          :autoplay="autoplayOptions"
          :allow-touch-move="true"
        >
          <SwiperSlide
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
          </SwiperSlide>
        </Swiper>
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
