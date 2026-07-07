<script setup lang="ts">
defineProps<{ rows?: number }>()
</script>

<template>
  <div class="admin-skeleton">
    <div v-for="n in rows ?? 4" :key="n" class="admin-skeleton__row" />
  </div>
</template>
