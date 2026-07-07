<template>
  <div class="admin-layout-root">
    <slot />
    <AppToast />
  </div>
</template>

<style scoped>
.admin-layout-root {
  min-height: 100dvh;
  background: var(--color-bg-deep);
}
</style>
