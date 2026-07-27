import type { AuthDto, Role, UserProfileDto } from '~/types/api'
import type { GuestDetails } from '~/types/booking'

const AUTH_KEY = 'stwmovers.auth.v1'
const GUEST_KEY = 'stwmovers.guest.v1'
const AUTH_EVENT = 'stwmovers-auth-changed'

export type GuestSession = GuestDetails & {
  bookingReference?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    refreshToken: '' as string,
    userId: '' as string,
    email: '',
    fullName: '',
    role: null as Role | null,
    profilePictureUrl: '' as string,
    guestSession: null as GuestSession | null,
    hydrated: false,
    cookieAuthEnabled: false,
    sessionVerified: false,
  }),
  getters: {
    isLoggedIn(state): boolean {
      if (state.cookieAuthEnabled) {
        return Boolean(state.userId && state.role)
      }
      return Boolean(state.token)
    },
    isCustomer: (s) => s.role === 'CUSTOMER',
    isAdmin: (s) => s.role === 'ADMIN',
    isDriver: (s) => s.role === 'DRIVER',
    isGuestSession(state): boolean {
      if (state.cookieAuthEnabled) {
        return Boolean(state.guestSession && !(state.userId && state.role))
      }
      return Boolean(state.guestSession && !state.token)
    },
    firstName: (s) => s.fullName.trim().split(/\s+/)[0] || s.email.split('@')[0] || 'Guest',
    displayName: (s) => s.fullName || s.guestSession?.fullName || s.email || 'Guest',
    avatarUrl: (s) => s.profilePictureUrl || '',
    avatarInitial: (s) => {
      const name = s.fullName || s.guestSession?.fullName || s.email || 'G'
      return name.trim().charAt(0).toUpperCase()
    },
  },
  actions: {
    setSession(d: AuthDto) {
      this.applyProfile({
        userId: d.userId,
        email: d.email,
        fullName: d.fullName,
        role: d.role,
        profilePictureUrl: d.profilePictureUrl,
      })
      if (!this.cookieAuthEnabled) {
        this.token = d.accessToken
        this.refreshToken = d.refreshToken ?? this.refreshToken
      } else {
        this.token = ''
        this.refreshToken = ''
        this.sessionVerified = true
      }
      this.guestSession = null
      if (import.meta.client) {
        sessionStorage.removeItem(GUEST_KEY)
        useBookingStore().clearGuestDetails()
      }
      this.persistAuth()
      this.broadcastAuthChange()
      if (import.meta.client && this.cookieAuthEnabled) {
        void this.verifySession()
      }
    },
    applyProfile(profile: Pick<UserProfileDto, 'userId' | 'email' | 'fullName' | 'role' | 'profilePictureUrl'>) {
      this.userId = profile.userId
      this.email = profile.email
      this.fullName = profile.fullName
      this.role = profile.role
      this.profilePictureUrl = profile.profilePictureUrl ?? ''
    },
    setGuestSession(guest: GuestSession) {
      this.guestSession = { ...guest }
      if (import.meta.client) sessionStorage.setItem(GUEST_KEY, JSON.stringify(this.guestSession))
    },
    clearGuestSession() {
      this.guestSession = null
      if (import.meta.client) sessionStorage.removeItem(GUEST_KEY)
    },
    hydrate() {
      if (!import.meta.client || this.hydrated) return
      const config = useRuntimeConfig()
      this.cookieAuthEnabled = Boolean(config.public.cookieAuth)
      this.migrateLegacyAuthStorage()
      this.syncFromStorage()
      this.hydrated = true
    },
    migrateLegacyAuthStorage() {
      if (!import.meta.client || !this.cookieAuthEnabled) return
      const raw = localStorage.getItem(AUTH_KEY)
      if (!raw) return
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>
        if ('token' in parsed || 'refreshToken' in parsed) {
          delete parsed.token
          delete parsed.refreshToken
          localStorage.setItem(AUTH_KEY, JSON.stringify(parsed))
        }
      } catch {
        localStorage.removeItem(AUTH_KEY)
      }
    },
    syncFromStorage() {
      if (!import.meta.client) return
      const raw = localStorage.getItem(AUTH_KEY)
      if (!raw) {
        if (this.userId || this.token) {
          this.token = ''
          this.refreshToken = ''
          this.userId = ''
          this.email = ''
          this.fullName = ''
          this.role = null
          this.profilePictureUrl = ''
          this.sessionVerified = false
        }
      } else {
        try {
          const parsed = JSON.parse(raw) as Partial<typeof this.$state>
          if (!this.cookieAuthEnabled) {
            this.token = parsed.token ?? ''
            this.refreshToken = parsed.refreshToken ?? ''
          }
          this.userId = parsed.userId ?? ''
          this.email = parsed.email ?? ''
          this.fullName = parsed.fullName ?? ''
          this.role = parsed.role ?? null
          this.profilePictureUrl = parsed.profilePictureUrl ?? ''
          this.sessionVerified = false
        } catch {
          localStorage.removeItem(AUTH_KEY)
          this.clear()
        }
      }
      if (!this.isLoggedIn) {
        const guestRaw = sessionStorage.getItem(GUEST_KEY)
        if (guestRaw) {
          try {
            this.guestSession = JSON.parse(guestRaw) as GuestSession
          } catch {
            sessionStorage.removeItem(GUEST_KEY)
            this.guestSession = null
          }
        } else {
          this.guestSession = null
        }
      }
    },
    persistAuth() {
      if (!import.meta.client) return
      const payload: Record<string, unknown> = {
        userId: this.userId,
        email: this.email,
        fullName: this.fullName,
        role: this.role,
        profilePictureUrl: this.profilePictureUrl,
      }
      if (!this.cookieAuthEnabled) {
        payload.token = this.token
        payload.refreshToken = this.refreshToken
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(payload))
    },
    async verifySession() {
      if (!import.meta.client) return false
      try {
        const { userService } = await import('~/services/api/user.service')
        const profile = await userService.profile()
        this.applyProfile(profile)
        this.sessionVerified = true
        this.persistAuth()
        return true
      } catch {
        if (this.cookieAuthEnabled && this.isLoggedIn) {
          this.clear()
          this.broadcastAuthChange()
        }
        return false
      }
    },
    async restoreSession() {
      if (!import.meta.client || !this.cookieAuthEnabled) return false
      try {
        const { userService } = await import('~/services/api/user.service')
        const profile = await userService.profile()
        this.applyProfile(profile)
        this.sessionVerified = true
        this.persistAuth()
        this.broadcastAuthChange()
        return true
      } catch {
        return false
      }
    },
    async logout() {
      try {
        const { authService } = await import('~/services/api/auth.service')
        await authService.logout()
      } catch {
        /* client logout still proceeds */
      }
      this.clear()
      this.broadcastAuthChange()
    },
    clear() {
      this.token = ''
      this.refreshToken = ''
      this.userId = ''
      this.email = ''
      this.fullName = ''
      this.role = null
      this.profilePictureUrl = ''
      this.sessionVerified = false
      this.clearGuestSession()
      if (import.meta.client) localStorage.removeItem(AUTH_KEY)
    },
    applyAuthPayload(payload: Partial<typeof this.$state>) {
      Object.assign(this, payload)
      this.persistAuth()
    },
    broadcastAuthChange() {
      if (!import.meta.client) return
      window.dispatchEvent(new CustomEvent(AUTH_EVENT))
    },
    listenForAuthChanges(onChange: () => void) {
      if (!import.meta.client) return () => {}
      const handler = () => onChange()
      window.addEventListener(AUTH_EVENT, handler)
      window.addEventListener('storage', (e) => {
        if (e.key === AUTH_KEY) handler()
      })
      return () => window.removeEventListener(AUTH_EVENT, handler)
    },
  },
})
