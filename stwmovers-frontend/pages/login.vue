<script setup lang="ts">
import { authService } from '~/services/api/auth.service'

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)
const route = useRoute()

const submit = async () => {
  loading.value = true
  try {
    const res = await authService.login(email.value, password.value)
    auth.setSession(res)
    const redirect = (route.query.redirect as string) || '/'
    await navigateTo(redirect)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="card card--elevated auth-box">
    <h1 class="font-serif">Sign in</h1>
    <input v-model="email" class="input" type="email" placeholder="Email" />
    <input v-model="password" class="input" type="password" placeholder="Password" />
    <button class="btn btn--solid-gold" :disabled="loading" @click="submit">Login</button>
  </section>
</template>
