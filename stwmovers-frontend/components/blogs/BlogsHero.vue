<template>
  <header class="blogs-hero" aria-labelledby="blogs-hero-title">
    <div class="blogs-hero__media" aria-hidden="true">
      <NuxtImg
        src="/img/about/hero.png"
        alt=""
        preset="hero"
        width="1440"
        height="760"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        loading="eager"
        fetchpriority="high"
        preload
        decoding="async"
      />
      <div class="blogs-hero__overlay" />
    </div>
    <div class="blogs-hero__inner blogs-container">
      <p class="blogs-eyebrow">Journal</p>
      <h1 id="blogs-hero-title" class="blogs-hero__title">Stories From The Road.</h1>
      <p class="blogs-hero__lead">
        Travel notes, chauffeur insights, and destination guides from the STW Movers desk —
        curated for travellers who value comfort and clarity.
      </p>
    </div>
  </header>
</template>
