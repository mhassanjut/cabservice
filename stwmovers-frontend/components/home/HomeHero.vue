<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import { siteConfig } from '~/config/site'
import { buildWhatsappUrl } from '~/utils/whatsapp'

const HERO_SIZES = 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw'

const HERO_SLIDES = [
  {
    src: '/img/home/generated/hero-desktop-airport-arrival-v4.webp',
    mobileSrc: '/img/home/generated/hero-mobile-user-airport-v1.webp',
    width: 1672,
    height: 941,
    mobileWidth: 941,
    mobileHeight: 1672,
  },
] as const

const swiperModules = [Autoplay, EffectFade, Pagination]

const autoplayOptions = {
  delay: 3500,
  disableOnInteraction: false,
  // Don't wait for the CSS transitionend event to resume autoplay. On machines
  // with "reduce motion" (transitions forced to ~0ms) the event can be missed,
  // which is what stalls the loop after the first cycle.
  waitForTransition: false,
}

const whatsappHref = buildWhatsappUrl({
  phone: siteConfig.whatsappNumber,
  text: 'Hello STW Movers, I want a private taxi, cab, or chauffeur quote in Barcelona.',
})

const heroIntents = [
  { icon: 'fa-solid fa-plane', label: 'Airport transfer', href: '/airport-transfer-barcelona' },
  { icon: 'fa-regular fa-building', label: 'Taxi alternative', href: '/barcelona-taxi-alternative' },
  { icon: 'fa-solid fa-crown', label: 'Cab service', href: '/cab-service-barcelona' },
  { icon: 'fa-solid fa-shield-halved', label: 'Private driver', href: '/private-driver-barcelona' },
] as const
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
            :loop="HERO_SLIDES.length > 1"
            effect="fade"
            :fade-effect="{ crossFade: true }"
            :speed="850"
            :autoplay="HERO_SLIDES.length > 1 ? autoplayOptions : false"
            :pagination="HERO_SLIDES.length > 1 ? { clickable: true } : false"
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
                class="home-hero__image home-hero__image--desktop"
              />
              <NuxtImg
                v-if="'mobileSrc' in slide"
                :src="slide.mobileSrc"
                alt=""
                preset="hero"
                :width="slide.mobileWidth"
                :height="slide.mobileHeight"
                sizes="xs:100vw sm:100vw"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'low'"
                decoding="async"
                draggable="false"
                class="home-hero__image home-hero__image--mobile"
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
                class="home-hero__image home-hero__image--desktop"
              />
              <NuxtImg
                :src="HERO_SLIDES[0].mobileSrc"
                alt=""
                preset="hero"
                :width="HERO_SLIDES[0].mobileWidth"
                :height="HERO_SLIDES[0].mobileHeight"
                sizes="xs:100vw sm:100vw"
                loading="eager"
                fetchpriority="high"
                preload
                decoding="async"
                draggable="false"
                class="home-hero__image home-hero__image--mobile"
              />
            </div>
          </template>
        </ClientOnly>
      </div>
      <div class="home-hero__overlay" aria-hidden="true" />
      <div class="home-hero__copy-scrim" aria-hidden="true" />
    </div>
    <div class="home-hero__content">
      <div class="container container--wide home-hero__content-inner">
        <p class="home-hero__eyebrow">Barcelona chauffeur, taxi & cab alternative</p>
        <h1 class="home-hero__title">
          Barcelona Airport Transfers.
          <span>Private Chauffeur.</span>
        </h1>
        <p class="home-hero__lead">
          Pre-book a polished private driver for BCN arrivals, hotels, cruise port pickups, and business trips.
        </p>
        <div class="home-hero__actions">
          <a class="home-hero__cta home-hero__cta--gold" href="#booking-section">
            Get Private Quote
          </a>
          <a class="home-hero__cta home-hero__cta--glass" :href="whatsappHref" target="_blank" rel="noopener noreferrer">
            WhatsApp Trip Details
          </a>
        </div>
        <ul class="home-hero__intent" aria-label="Popular transfer searches">
          <li v-for="intent in heroIntents" :key="intent.label">
            <NuxtLink :to="intent.href">
              <i :class="intent.icon" aria-hidden="true" />
              <span>{{ intent.label }}</span>
            </NuxtLink>
          </li>
        </ul>
        <a class="home-hero__scroll" href="#booking-section" aria-label="Scroll to quote form">
          <i class="fa-solid fa-arrow-down" aria-hidden="true" />
        </a>
      </div>
    </div>
    <aside class="home-hero__note" aria-hidden="true">
      <span>More than</span>
      <strong>A transfer.</strong>
      <strong>A better journey.</strong>
    </aside>
    <div class="home-hero__booking">
      <div class="container container--wide">
        <BookingForm variant="bar" />
      </div>
    </div>
  </header>
</template>
