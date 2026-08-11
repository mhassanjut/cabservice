<script setup lang="ts">
import { faqCategories } from '~/data/faqContent'
</script>

<template>
  <nav class="faq-jump" aria-label="FAQ categories">
    <div class="faq-container">
      <div class="faq-jump__list">
        <a
          v-for="category in faqCategories"
          :key="category.id"
          class="faq-jump__link"
          :href="`#${category.id}`"
        >
          {{ category.title }}
        </a>
      </div>
    </div>
  </nav>
</template>
