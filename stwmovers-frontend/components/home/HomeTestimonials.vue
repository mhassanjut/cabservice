<template>
  <section class="home-section" aria-labelledby="testimonials-heading">
    <div class="container">
      <h2 id="testimonials-heading" class="home-display home-display--lg home-testimonials__title">
        Guest Story
      </h2>
      <div class="home-testimonials">
      <blockquote class="home-testimonials__quote">
        "STW Movers has redefined my expectations of global travel. From London to Tokyo, the service is
        flawlessly consistent."
      </blockquote>
      <div class="home-testimonials__visual">
        <div class="home-testimonials__photo-stack">
          <NuxtImg
            class="home-testimonials__photo"
            src="/img/home/testimonial-photo.jpg"
            alt="STW Movers guest portrait"
            loading="lazy"
            decoding="async"
            placeholder
            width="187"
            height="162"
            sizes="xs:187px sm:187px md:187px lg:187px xl:187px xxl:187px"
          />
        </div>
        <div class="home-testimonials__author-meta">
          <div class="home-testimonials__author-info">
            <p class="home-testimonials__author-name">Jane Doe</p>
            <p class="home-testimonials__author-company">SomeCompany LLC.</p>
          </div>
          <span class="home-icon-wrap home-testimonials__social">
            <NuxtImg
              class="home-icon"
              src="/img/home/icons/stars.svg"
              alt="Jane Doe on Facebook, Instagram, and Twitter"
              width="82"
              height="20"
            />
          </span>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>
