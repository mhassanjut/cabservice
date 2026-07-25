<script setup lang="ts">
defineProps<{ show: boolean; label?: string }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="app-loader-fade">
      <div v-if="show" class="loading-overlay" role="status" aria-live="polite" aria-busy="true">
        <AppLoader :label="label || 'Please wait…'" size="md" />
      </div>
    </Transition>
  </Teleport>
</template>
