<script setup lang="ts">
import { homeExperienceTiles } from '~/data/homeContent'
</script>

<template>
  <section id="experience" class="home-section" aria-labelledby="experience-heading">
    <div class="home-experience__header">
      <h2 id="experience-heading" class="home-display home-display--lg">
        From Arrival To Destination, Every Detail Is Taken Care Of.
      </h2>
      <p class="home-lead" style="margin-top: 2.5rem">
        Whether you're arriving for business, celebrating a special occasion, or discovering a new city, your
        journey is handled with professionalism, discretion, and genuine hospitality from start to finish.
      </p>
    </div>
    <div class="home-experience__tiles">
      <article
        v-for="tile in homeExperienceTiles"
        :key="tile.title"
        class="home-experience__tile"
      >
        <img
          :src="tile.image"
          :alt="`${tile.title} — STW Movers Barcelona chauffeur service`"
          loading="lazy"
          decoding="async"
          width="628"
          height="520"
        />
        <div class="home-experience__tile-overlay" aria-hidden="true" />
        <div class="home-experience__tile-copy">
          <h3>{{ tile.title }}</h3>
          <p>{{ tile.subtitle }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
