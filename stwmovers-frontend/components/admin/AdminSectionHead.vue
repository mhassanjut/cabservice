<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <header class="admin-section-head">
    <h2 class="admin-section-head__title font-serif">{{ title }}</h2>
    <p class="admin-section-head__lead">{{ description }}</p>
  </header>
</template>
