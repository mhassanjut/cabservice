<script setup lang="ts">
defineProps<{ busy?: boolean }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="vehicle-search-error" role="alert">
    <div>
      <strong>Vehicle prices are temporarily unavailable.</strong>
      <p>Your trip details are kept here. Try again or contact our team for a quote.</p>
    </div>
    <div class="vehicle-search-error__actions">
      <button type="button" :disabled="busy" @click="$emit('retry')">{{ busy ? 'Trying again…' : 'Try again' }}</button>
      <NuxtLink to="/contact">Contact our team</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.vehicle-search-error { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; width: 100%; padding: 16px; margin-block: 12px; border: 1px solid #b48d3c; border-radius: 8px; background: #202b30; color: #f4f5f5; }
.vehicle-search-error strong { font-size: 15px; }
.vehicle-search-error p { margin: 6px 0 0; color: #d0d7d9; font-size: 14px; line-height: 1.5; }
.vehicle-search-error__actions { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.vehicle-search-error button, .vehicle-search-error a { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; padding: 8px 14px; font: inherit; font-size: 14px; border-radius: 6px; }
.vehicle-search-error button { color: #17191a; background: #e1bd55; border: 1px solid #e1bd55; cursor: pointer; }
.vehicle-search-error button:disabled { opacity: .65; cursor: wait; }
.vehicle-search-error a { color: #f0d587; text-decoration: underline; text-underline-offset: 3px; }
.vehicle-search-error button:focus-visible, .vehicle-search-error a:focus-visible { outline: 2px solid #f0d587; outline-offset: 3px; }
</style>
