<script setup lang="ts">
const toast = useToastStore()
</script>

<template>
  <div class="toast-stack" aria-live="polite">
    <div v-for="t in toast.items" :key="t.id" class="toast" :class="`toast--${t.kind}`">
      {{ t.message }}
    </div>
  </div>
</template>
