<template>
  <header class="tours-hero" aria-labelledby="tours-hero-title">
    <div class="tours-hero__media" aria-hidden="true">
      <NuxtImg
        src="/img/tours/hero.webp"
        alt=""
        preset="hero"
        width="1600"
        height="911"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        loading="eager"
        fetchpriority="high"
        preload
        decoding="async"
      />
      <div class="tours-hero__overlay" />
    </div>
    <div class="tours-hero__content">
      <div class="container container--wide tours-hero__content-inner">
        <div class="tours-hero__header-stack">
          <p class="tours-hero__eyebrow">Private Tours</p>
          <h1 id="tours-hero-title" class="tours-hero__title">
            Discover Spain, One Journey At A Time.
          </h1>
        </div>
        <p class="tours-hero__lead">
          Explore carefully curated private experiences with professional chauffeurs and local
          guides. Every tour is designed to combine comfort, flexibility, and unforgettable
          destinations.
        </p>
      </div>
    </div>
  </header>
</template>
