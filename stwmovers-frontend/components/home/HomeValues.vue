<script setup lang="ts">
import { homeValueProps } from '~/data/homeContent'
</script>

<template>
  <section id="values" class="home-section home-section--white home-values" aria-labelledby="values-heading">
    <div class="container">
      <header class="home-values__header">
        <h2 id="values-heading" class="home-values__heading">
          Why The Journey Feels Different.
        </h2>
        <p class="home-values__lead">Designed Around Comfort, Built On Trust.</p>
      </header>
      <div class="home-values__grid">
        <article v-for="item in homeValueProps" :key="item.title" class="home-value">
          <span class="home-icon-wrap home-value__icon">
            <NuxtImg class="home-icon" :src="item.icon" alt="" width="32" height="32" loading="lazy" />
          </span>
          <h3 class="home-value__title">{{ item.title }}</h3>
          <p class="home-value__text">{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
