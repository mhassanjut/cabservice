import type { AuthDto, Role } from '~/types/api'

const KEY = 'stwmovers.auth.v1'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    userId: '' as string,
    email: '',
    fullName: '',
    role: null as Role | null,
  }),
  getters: {
    isLoggedIn: (s) => Boolean(s.token),
    isAdmin: (s) => s.role === 'ADMIN',
    isDriver: (s) => s.role === 'DRIVER',
  },
  actions: {
    setSession(d: AuthDto) {
      this.token = d.accessToken
      this.userId = d.userId
      this.email = d.email
      this.fullName = d.fullName
      this.role = d.role
      if (import.meta.client) localStorage.setItem(KEY, JSON.stringify(this.$state))
    },
    hydrate() {
      if (!import.meta.client) return
      const raw = localStorage.getItem(KEY)
      if (!raw) return
      try {
        Object.assign(this, JSON.parse(raw))
      } catch {
        localStorage.removeItem(KEY)
      }
    },
    clear() {
      this.token = ''
      this.userId = ''
      this.email = ''
      this.fullName = ''
      this.role = null
      if (import.meta.client) localStorage.removeItem(KEY)
    },
  },
})
