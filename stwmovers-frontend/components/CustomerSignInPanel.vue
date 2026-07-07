<script setup lang="ts">
import { authService } from '~/services/api/auth.service'
import { homeAnchors, routes } from '~/constants/routes'

const props = withDefaults(defineProps<{
  redirect?: string
  showGuestLink?: boolean
}>(), {
  showGuestLink: true,
})

const emit = defineEmits<{
  signedIn: []
  close: []
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
  googleLoading.value = true
  try {
    const res = await authService.googleLogin(idToken)
    auth.setSession(res)
    auth.clearGuestSession()
    emit('signedIn')
    const target = props.redirect || routes.dashboard
    await navigateTo(target)
  } catch {
    toast.show('Google sign-in failed. Please try again.', 'error')
  } finally {
    googleLoading.value = false
  }
}

const onGoogleError = (message: string) => {
  toast.show(message, 'error')
}
</script>

<template>
  <article class="sign-in-panel card card--elevated">
    <div class="sign-in-panel__icon" aria-hidden="true">
      <i class="fa-brands fa-google" />
    </div>

    <h2 id="sign-in-modal-title" class="sign-in-panel__title font-serif">Sign in with Google</h2>
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

    <LoadingOverlay :show="googleLoading" label="Signing in with Google…" />
  </article>
</template>
