<script setup lang="ts">
const emit = defineEmits<{
  success: [idToken: string]
  error: [message: string]
}>()

const containerRef = ref<HTMLElement | null>(null)
const { isConfigured, renderButton } = useGoogleSignIn()

const mountButton = async () => {
  if (!containerRef.value || !isConfigured.value) return
  await renderButton(
    containerRef.value,
    (idToken) => emit('success', idToken),
    (message) => emit('error', message),
  )
}

onMounted(async () => {
  await mountButton()
})

watch(isConfigured, async (ready: boolean) => {
  if (ready) await mountButton()
})
</script>

<template>
  <div v-if="isConfigured" ref="containerRef" class="google-signin-slot" />
  <button
    v-else
    class="btn secondary google-signin-slot__fallback"
    type="button"
    disabled
    title="Set NUXT_PUBLIC_GOOGLE_CLIENT_ID in .env"
  >
    <i class="fa-brands fa-google" aria-hidden="true" />
    Continue with Google
  </button>
</template>

<style scoped>
.google-signin-slot {
  width: 100%;
  max-width: 100%;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  padding-block: 3px;
}

.google-signin-slot :deep(div),
.google-signin-slot :deep(iframe) {
  max-width: 100% !important;
}

.google-signin-slot :deep(iframe) {
  display: block;
  min-height: 44px;
}

.google-signin-slot__fallback {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>
