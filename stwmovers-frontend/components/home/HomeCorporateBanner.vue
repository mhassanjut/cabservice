<template>
  <section class="home-corporate" aria-labelledby="corporate-heading">
    <div class="home-corporate__media" aria-hidden="true">
      <NuxtImg
        src="/img/home/corporate-banner.jpg"
        alt=""
        loading="lazy"
        decoding="async"
        width="1440"
        height="612"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
      />
      <div class="home-corporate__overlay" />
    </div>
    <div class="container home-corporate__content-wrap">
      <div class="home-corporate__content">
        <p class="home-corporate__eyebrow">Corporate Travel</p>
        <div class="home-corporate__copy">
          <h2 id="corporate-heading">Executive Travel That Works Around Your Business.</h2>
          <p>
            From airport transfers and executive meetings to conferences and roadshows, we provide reliable
            transportation that moves with your schedule.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
