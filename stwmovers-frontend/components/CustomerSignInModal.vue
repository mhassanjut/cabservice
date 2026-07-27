<script setup lang="ts">
const { isOpen, redirectTo, close } = useCustomerSignIn()
const auth = useAuthStore()

const isBusy = ref(false)

onMounted(() => auth.hydrate())

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && !isBusy.value) close()
}

function handleSigningIn() {
  isBusy.value = true
}

async function handleSignedIn() {
  close()
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 280))
  isBusy.value = false
}

function handleSignInError() {
  isBusy.value = false
}

watch([isOpen, isBusy], ([open, busy]: [boolean, boolean]) => {
  if (!import.meta.client) return
  document.body.style.overflow = open || busy ? 'hidden' : ''
})

watch(isOpen, (open: boolean) => {
  if (!import.meta.client) return
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
      v-if="isOpen"
      class="sign-in-modal"
      :class="{ 'sign-in-modal--busy': isBusy }"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-in-modal-title"
      @click.self="!isBusy && close()"
    >
      <div class="sign-in-modal__dialog">
        <button
          type="button"
          class="sign-in-modal__close"
          aria-label="Close sign in"
          :disabled="isBusy"
          @click="close"
        >
          <i class="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        <CustomerSignInPanel
          external-loader
          :redirect="redirectTo ?? undefined"
          @signing-in="handleSigningIn"
          @signed-in="handleSignedIn"
          @sign-in-error="handleSignInError"
          @close="close"
        />
      </div>
    </div>
  </Teleport>

  <LoadingOverlay :show="isBusy" label="Signing you in…" />
</template>
