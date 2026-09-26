<script setup lang="ts">
import { homeFaqItems } from '~/data/homeFaq'

const openIndex = ref<number | null>(null)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="home-section home-section--white" aria-labelledby="faq-heading">
    <div class="container">
      <h2 id="faq-heading" class="home-display" style="font-size: clamp(1.75rem, 3vw, 2.5rem); margin: 0 0 3rem">
        Frequently Asked Questions
      </h2>
      <div class="home-faq__list">
      <div
        v-for="(item, index) in homeFaqItems"
        :key="item.question"
        class="home-faq__item"
        :class="{ 'is-open': openIndex === index }"
      >
        <button
          type="button"
          class="home-faq__trigger"
          :aria-expanded="openIndex === index"
          @click="toggle(index)"
        >
          {{ item.question }}
          <span class="home-icon-wrap home-faq__icon">
            <NuxtImg class="home-icon" src="/img/home/icons/plus.svg" alt="" width="20" height="20" />
          </span>
        </button>
        <div v-show="openIndex === index" class="home-faq__panel">
          {{ item.answer }}
        </div>
      </div>
    </div>
      
    </div>
  </section>
</template>
