<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    lead?: string
    titleId?: string
    /** Use h1 for inner pages that do not have a hero title. */
    titleLevel?: 'h1' | 'h2'
  }>(),
  { titleLevel: 'h2' },
)
</script>

<template>
  <header class="section-heading reveal">
    <p class="section-heading__eyebrow eyebrow">{{ eyebrow }}</p>
    <component :is="titleLevel" :id="titleId" class="section-heading__title font-serif">{{ title }}</component>
    <div class="section-heading__rule" aria-hidden="true" />
    <p v-if="lead" class="section-heading__lead">{{ lead }}</p>
  </header>
</template>
