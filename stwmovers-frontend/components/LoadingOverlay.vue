<script setup lang="ts">
defineProps<{ show: boolean; label?: string }>()
</script>

<template>
  <div v-if="show" class="loading-overlay" role="status" aria-live="polite">
    <div class="loading-overlay__spinner" />
    <p>{{ label || 'Please wait…' }}</p>
  </div>
</template>
