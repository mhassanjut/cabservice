<script setup lang="ts">
import { authService } from '~/services/api/auth.service'
import { homeAnchors } from '~/constants/routes'
import googleGUrl from '~/assets/icons/google-g.svg?url'

const props = withDefaults(defineProps<{
  redirect?: string
  showGuestLink?: boolean
  externalLoader?: boolean
}>(), {
  showGuestLink: true,
  externalLoader: false,
})

const emit = defineEmits<{
  signedIn: []
  close: []
  signingIn: []
  signInError: []
}>()

const auth = useAuthStore()
const toast = useToastStore()
const googleLoading = ref(false)

const benefits = [
  'Skip email verification at checkout',
  'View and manage all your bookings',
  'Faster reservations on future rides',
]

const onGoogleSuccess = async (idToken: string) => {
  if (props.externalLoader) emit('signingIn')
  googleLoading.value = true
  try {
    const res = await authService.googleLogin(idToken)
    auth.setSession(res)
    auth.clearGuestSession()
    emit('signedIn')
    if (props.redirect) {
      await navigateTo(props.redirect)
    }
  } catch {
    toast.show('Google sign-in failed. Please try again.', 'error')
    if (props.externalLoader) emit('signInError')
    googleLoading.value = false
  }
}

const onGoogleError = (message: string) => {
  toast.show(message, 'error')
}
</script>

<template>
  <article class="sign-in-panel">
    <div class="sign-in-panel__icon" aria-hidden="true">
      <img :src="googleGUrl" alt="" width="28" height="28" />
    </div>

    <h2 id="sign-in-modal-title" class="sign-in-panel__title">Sign in with Google</h2>
    <p class="sign-in-panel__lead">
      Use your Google account to access your dashboard and enjoy a smoother booking experience.
    </p>

    <ul class="sign-in-panel__benefits" aria-label="Member benefits">
      <li v-for="benefit in benefits" :key="benefit">
        <i class="fa-solid fa-check" aria-hidden="true" />
        <span>{{ benefit }}</span>
      </li>
    </ul>

    <GoogleSignInButton
      class="sign-in-panel__google"
      @success="onGoogleSuccess"
      @error="onGoogleError"
    />

    <p v-if="showGuestLink" class="sign-in-panel__guest">
      No account needed.
      <a :href="homeAnchors.booking" @click="emit('close')">Book as a guest</a>
    </p>

    <LoadingOverlay
      v-if="!externalLoader"
      :show="googleLoading"
      label="Signing in with Google…"
    />
  </article>
</template>
