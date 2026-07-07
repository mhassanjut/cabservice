<script setup lang="ts">
definePageMeta({ middleware: ['customer', 'no-guest-dashboard'], ssr: false })

import { userService } from '~/services/api/user.service'

usePageSeo({ title: 'Account', path: '/dashboard/account' })

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const profile = ref<Awaited<ReturnType<typeof userService.profile>> | null>(null)
const fullName = ref('')
const phone = ref('')
const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
  auth.hydrate()
  if (!auth.isLoggedIn || !auth.token) {
    loading.value = false
    return
  }
  try {
    profile.value = await userService.profile()
    fullName.value = profile.value.fullName
    phone.value = profile.value.phone ?? ''
    if (profile.value.profilePictureUrl) {
      auth.applyAuthPayload({ profilePictureUrl: profile.value.profilePictureUrl })
    }
  } catch {
    /* api client handles user-facing errors */
  } finally {
    loading.value = false
  }
})

const save = async () => {
  saving.value = true
  try {
    profile.value = await userService.updateProfile(fullName.value.trim(), phone.value.trim() || undefined)
    phone.value = profile.value.phone ?? ''
    auth.applyAuthPayload({ fullName: profile.value.fullName })
    toast.show('Profile updated.', 'success')
  } catch {
    toast.show('Could not update profile.', 'error')
  } finally {
    saving.value = false
  }
}

const logout = async () => {
  await auth.logout()
  await router.push('/')
}
</script>

<template>
  <DashboardShell>
    <section class="account-page">
      <LoadingOverlay :show="loading" label="Loading account…" />
      <article class="card card--elevated">
        <h1 class="font-serif">Account Settings</h1>
        <div class="account-page__profile">
          <UserAvatar size="lg" :name="auth.fullName" />
          <div class="account-page__identity">
            <p class="account-page__email">{{ auth.email }}</p>
            <p v-if="profile?.googleId" class="help">Connected with Google</p>
          </div>
        </div>
        <form class="account-page__form" @submit.prevent="save">
          <div class="field">
            <label class="label" for="full-name">Full name</label>
            <input id="full-name" v-model="fullName" class="input" required />
          </div>
          <div class="field">
            <label class="label" for="phone">Phone</label>
            <input id="phone" v-model="phone" class="input" type="tel" autocomplete="tel" inputmode="tel" placeholder="+34 600 000 000" />
          </div>
          <button class="btn btn--solid-gold" type="submit" :disabled="saving">Save changes</button>
        </form>
      </article>
      <article class="card card--elevated account-page__danger">
        <h2 class="font-serif">Session</h2>
        <button class="btn secondary" type="button" @click="logout">Logout</button>
      </article>
    </section>
  </DashboardShell>
</template>

<style scoped>
.account-page {
  display: grid;
  gap: clamp(1rem, 3vw, 1.25rem);
}

.account-page .card {
  padding: clamp(1.25rem, 3vw, 1.75rem);
}

.account-page h1 {
  margin: 0 0 0.25rem;
  font-size: clamp(1.35rem, 4vw, 1.75rem);
}

.account-page h2 {
  margin: 0 0 1rem;
  font-size: 1.15rem;
}

.account-page__profile {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 1.25rem 0 0;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.account-page__avatar {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.account-page__avatar--initial {
  display: grid;
  place-items: center;
  background: var(--color-gold-subtle);
  color: var(--color-gold-bright);
  font-weight: 700;
  font-size: 1.125rem;
}

.account-page__identity {
  min-width: 0;
}

.account-page__email {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-text);
  word-break: break-word;
}

.account-page__identity .help {
  margin: 4px 0 0;
}

.account-page__form {
  display: grid;
  gap: 1rem;
  margin-top: 1.25rem;
}

.account-page__danger {
  border-color: rgba(220, 80, 80, 0.35);
}

.account-page__danger .btn {
  width: 100%;
  justify-content: center;
}

@media (min-width: 480px) {
  .account-page__danger .btn {
    width: auto;
  }
}
</style>
