<script setup lang="ts">
import { routes } from '~/constants/routes'
import { seoSections } from '~/config/seo'

type FaqItem = { q: string; a: string }

const faqItems: FaqItem[] = seoSections.faq.categories
  .flatMap((category) => category.items.map((item) => ({ q: item.q, a: item.a })))
  .slice(0, 6)
const openIndex = ref<number | null>(null)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="home-section home-section--white" aria-labelledby="faq-heading">
    <div class="container">
      <h2 id="faq-heading" class="home-display" style="font-size: clamp(2rem, 4vw, 3rem); margin: 0 0 4rem">
        Frequently Asked Questions
      </h2>
      <div class="home-faq__list">
      <div
        v-for="(item, index) in faqItems"
        :key="item.q"
        class="home-faq__item"
        :class="{ 'is-open': openIndex === index }"
      >
        <button
          type="button"
          class="home-faq__trigger"
          :aria-expanded="openIndex === index"
          @click="toggle(index)"
        >
          {{ item.q }}
          <span class="home-icon-wrap home-faq__icon">
            <img class="home-icon" src="/img/home/icons/plus.svg" alt="" width="20" height="20" />
          </span>
        </button>
        <div v-show="openIndex === index" class="home-faq__panel">
          {{ item.a }}
        </div>
      </div>
    </div>
      
    </div>
  </section>
</template>
