<script setup lang="ts">
const { isOpen, redirectTo, close } = useCustomerSignIn()
const auth = useAuthStore()

onMounted(() => auth.hydrate())

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}

watch(isOpen, (open: boolean) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    window.addEventListener('keydown', onKeydown)
  } else {
    window.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && !auth.isLoggedIn"
      class="sign-in-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-in-modal-title"
      @click.self="close"
    >
      <div class="sign-in-modal__dialog">
        <button
          type="button"
          class="sign-in-modal__close"
          aria-label="Close sign in"
          @click="close"
        >
          <i class="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        <CustomerSignInPanel
          :redirect="redirectTo ?? undefined"
          @signed-in="close"
          @close="close"
        />
      </div>
    </div>
  </Teleport>
</template>
