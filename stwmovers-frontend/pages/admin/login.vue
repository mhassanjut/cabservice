<script setup lang="ts">
import { authService } from '~/services/api/auth.service'
import { routes } from '~/constants/routes'

definePageMeta({ layout: false })

const auth = useAuthStore()
const toast = useToastStore()
const email = ref('admin@stwmovers.com')
const password = ref('')
const loading = ref(false)

usePageSeo({ title: 'Admin login', path: routes.adminLogin })

onMounted(() => {
  auth.hydrate()
  if (auth.isAdmin) navigateTo(routes.adminHome)
})

const submit = async () => {
  loading.value = true
  try {
    const res = await authService.login(email.value, password.value)
    if (res.role !== 'ADMIN') {
      toast.show('Admin account required', 'error')
      return
    }
    auth.setSession(res)
    await navigateTo(routes.adminHome)
  } catch {
    toast.show('Invalid email or password', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <section class="auth-panel card card--elevated" aria-labelledby="admin-login-title">
      <div class="auth-panel__icon" aria-hidden="true">
        <i class="fa-solid fa-shield-halved" />
      </div>
      <h1 id="admin-login-title" class="auth-panel__title font-serif">Admin login</h1>
      <p class="auth-panel__lead">Sign in to manage bookings, fleet and the operations dashboard.</p>

      <form class="auth-panel__form" @submit.prevent="submit">
        <div class="field">
          <label class="label" for="admin-email">Email</label>
          <input
            id="admin-email"
            v-model="email"
            class="input"
            type="email"
            autocomplete="username"
            inputmode="email"
            required
          />
        </div>
        <div class="field auth-panel__field">
          <label class="label" for="admin-password">Password</label>
          <input
            id="admin-password"
            v-model="password"
            class="input"
            type="password"
            autocomplete="current-password"
            required
          />
        </div>
        <button class="btn btn--solid-gold auth-panel__submit" type="submit" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </section>
  </div>
</template>
