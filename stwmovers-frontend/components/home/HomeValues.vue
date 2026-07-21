<script setup lang="ts">
import { homeValueProps } from '~/data/homeContent'
</script>

<template>
  <section class="home-section home-section--white" aria-labelledby="values-heading">
    <header style="margin-bottom: 5rem; padding: 0 clamp(0, 3vw, 3rem)">
      <h2 id="values-heading" class="home-display home-display--lg" style="margin: 0 0 1.625rem">
        Why The Journey Feels Different.
      </h2>
      <p class="home-lead">Designed Around Comfort, Built On Trust.</p>
    </header>
    <div class="home-values__grid">
      <article v-for="item in homeValueProps" :key="item.title" class="home-value">
        <span class="home-icon-wrap home-value__icon">
          <img class="home-icon" :src="item.icon" alt="" width="32" height="32" loading="lazy" />
        </span>
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </article>
    </div>
  </section>
</template>
