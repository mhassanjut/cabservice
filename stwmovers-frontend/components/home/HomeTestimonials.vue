<template>
  <section class="home-section" aria-labelledby="testimonials-heading">
    <h2 id="testimonials-heading" class="home-display home-display--lg" style="margin: 0 0 5rem">
      Guest Story
    </h2>
    <div class="home-testimonials">
      <blockquote class="home-testimonials__quote">
        "STW Movers has redefined my expectations of global travel. From London to Tokyo, the service is
        flawlessly consistent."
      </blockquote>
      <div class="home-testimonials__visual">
        <div class="home-testimonials__photo-stack">
          <img
            class="home-testimonials__photo"
            src="/img/home/testimonial-photo.jpg"
            alt="STW Movers guest portrait"
            loading="lazy"
            width="187"
            height="162"
          />
        </div>
        <div>
          <p class="home-testimonials__author-name">Jane Doe</p>
          <p class="home-testimonials__author-company">SomeCompany LLC.</p>
          <span class="home-icon-wrap home-testimonials__stars">
            <img class="home-icon" src="/img/home/icons/stars.svg" alt="5 star rating" width="82" height="20" />
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-testimonials__author-name {
  margin: 0 0 0;
  font-family: Poppins, Inter, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #000;
}

.home-testimonials__author-company {
  margin: 0 0 1.5rem;
  font-family: Poppins, Inter, sans-serif;
  font-size: 0.875rem;
  color: #4f4f4f;
}
</style>
