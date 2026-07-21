<template>
  <header class="home-hero">
    <div class="home-hero__media" aria-hidden="true">
      <img
        src="/img/home/hero.jpg"
        alt=""
        width="1440"
        height="794"
        fetchpriority="high"
        decoding="async"
      />
      <div class="home-hero__overlay" />
    </div>
    <div class="home-hero__content">
      <h1 class="home-hero__title">Travel Begins Before You Arrive.</h1>
      <p class="home-hero__lead">
        From airport arrivals to executive meetings and private occasions, enjoy chauffeur services designed around comfort, reliability, and every detail that matters.
      </p>
    </div>
    <div class="home-hero__booking">
      <BookingForm variant="bar" />
    </div>
  </header>
</template>
