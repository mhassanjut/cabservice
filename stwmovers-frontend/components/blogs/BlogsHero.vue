<template>
  <header class="blogs-hero" aria-labelledby="blogs-hero-title">
    <div class="blogs-hero__media" aria-hidden="true">
      <NuxtImg
        src="/img/home/generated/luxury-chauffeur-barcelona-hero.webp"
        alt=""
        preset="hero"
        width="1672"
        height="941"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        loading="eager"
        fetchpriority="high"
        preload
        decoding="async"
      />
      <div class="blogs-hero__overlay" />
    </div>
    <div class="blogs-hero__inner blogs-container">
      <p class="blogs-eyebrow">STW Movers Insights</p>
      <h1 id="blogs-hero-title" class="blogs-hero__title">Luxury Transfer Insights For Barcelona Travellers.</h1>
      <p class="blogs-hero__lead">
        Local advice for Barcelona airport transfers, private drivers, taxi alternatives and journeys beyond the city.
      </p>
      <div class="blogs-hero__actions">
        <NuxtLink class="blogs-btn blogs-btn--gold" to="/journey#book-journey">
          Request private quote
        </NuxtLink>
        <NuxtLink class="blogs-btn blogs-btn--glass" to="/answers">
          Browse transfer answers
        </NuxtLink>
      </div>
      <ul class="blogs-hero__signals" aria-label="Insights coverage">
        <li>Direct answers</li>
        <li>Comparison tables</li>
        <li>Quote checklists</li>
        <li>Luxury transfer planning</li>
      </ul>
    </div>
  </header>
</template>
