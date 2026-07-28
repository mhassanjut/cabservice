import type { AuthDto, Role, UserProfileDto } from '~/types/api'
import type { GuestDetails } from '~/types/booking'

const AUTH_KEY = 'stwmovers.auth.v1'
const GUEST_KEY = 'stwmovers.guest.v1'
const AUTH_EVENT = 'stwmovers-auth-changed'

export type GuestSession = GuestDetails & {
  bookingReference?: string
}

let bootstrapPromise: Promise<boolean> | null = null

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
    authReady: false,
  }),
  getters: {
    isLoggedIn(state): boolean {
      if (state.cookieAuthEnabled) {
        return state.sessionVerified && Boolean(state.userId && state.role)
      }
      return Boolean(state.token)
    },
    isCustomer: (s) => s.role === 'CUSTOMER',
    isAdmin: (s) => s.role === 'ADMIN',
    isDriver: (s) => s.role === 'DRIVER',
    isGuestSession(state): boolean {
      if (state.cookieAuthEnabled) {
        return Boolean(state.guestSession && !state.sessionVerified)
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
        this.token = d.accessToken ?? ''
        this.refreshToken = d.refreshToken ?? this.refreshToken
        this.persistLegacyAuth()
      } else {
        this.token = ''
        this.refreshToken = ''
        this.sessionVerified = true
        this.authReady = true
      }
      this.guestSession = null
      if (import.meta.client) {
        sessionStorage.removeItem(GUEST_KEY)
        useBookingStore().clearGuestDetails()
      }
      this.broadcastAuthChange()
    },
    applyProfile(profile: Pick<UserProfileDto, 'userId' | 'email' | 'fullName' | 'role' | 'profilePictureUrl'>) {
      this.userId = profile.userId
      this.email = profile.email
      this.fullName = profile.fullName
      this.role = profile.role
      this.profilePictureUrl = profile.profilePictureUrl ?? ''
    },
    clearProfile() {
      this.userId = ''
      this.email = ''
      this.fullName = ''
      this.role = null
      this.profilePictureUrl = ''
      this.sessionVerified = false
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
      if (this.cookieAuthEnabled) {
        localStorage.removeItem(AUTH_KEY)
      } else {
        this.syncLegacyAuthFromStorage()
      }
      this.loadGuestSession()
      this.hydrated = true
    },
    syncLegacyAuthFromStorage() {
      if (!import.meta.client) return
      const raw = localStorage.getItem(AUTH_KEY)
      if (!raw) {
        if (this.userId || this.token) {
          this.token = ''
          this.refreshToken = ''
          this.clearProfile()
        }
        return
      }
      try {
        const parsed = JSON.parse(raw) as Partial<typeof this.$state>
        this.token = parsed.token ?? ''
        this.refreshToken = parsed.refreshToken ?? ''
        this.userId = parsed.userId ?? ''
        this.email = parsed.email ?? ''
        this.fullName = parsed.fullName ?? ''
        this.role = parsed.role ?? null
        this.profilePictureUrl = parsed.profilePictureUrl ?? ''
      } catch {
        localStorage.removeItem(AUTH_KEY)
        this.clear()
      }
    },
    loadGuestSession() {
      if (!import.meta.client || this.isLoggedIn) {
        if (this.isLoggedIn) this.guestSession = null
        return
      }
      const guestRaw = sessionStorage.getItem(GUEST_KEY)
      if (!guestRaw) {
        this.guestSession = null
        return
      }
      try {
        this.guestSession = JSON.parse(guestRaw) as GuestSession
      } catch {
        sessionStorage.removeItem(GUEST_KEY)
        this.guestSession = null
      }
    },
    persistLegacyAuth() {
      if (!import.meta.client || this.cookieAuthEnabled) return
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({
          token: this.token,
          refreshToken: this.refreshToken,
          userId: this.userId,
          email: this.email,
          fullName: this.fullName,
          role: this.role,
          profilePictureUrl: this.profilePictureUrl,
        }),
      )
    },
    async bootstrapSession(): Promise<boolean> {
      if (!import.meta.client || !this.cookieAuthEnabled) return this.isLoggedIn
      if (this.authReady && this.sessionVerified) return true
      if (this.authReady && !this.sessionVerified) return false
      if (bootstrapPromise) return bootstrapPromise

      bootstrapPromise = (async () => {
        try {
          const { userService } = await import('~/services/api/user.service')
          const profile = await userService.profile({ silent: true })
          if (!profile) {
            this.clearProfile()
            this.authReady = true
            this.loadGuestSession()
            return false
          }
          this.applyProfile(profile)
          this.sessionVerified = true
          this.authReady = true
          this.loadGuestSession()
          return true
        } catch {
          this.clearProfile()
          this.authReady = true
          this.loadGuestSession()
          return false
        } finally {
          bootstrapPromise = null
        }
      })()

      return bootstrapPromise
    },
    async ensureSession(): Promise<boolean> {
      this.hydrate()
      if (this.cookieAuthEnabled) return this.bootstrapSession()
      return this.isLoggedIn
    },
    /** @deprecated Use bootstrapSession */
    async verifySession() {
      return this.bootstrapSession()
    },
    /** @deprecated Use bootstrapSession */
    async restoreSession() {
      return this.bootstrapSession()
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
      this.clearProfile()
      this.authReady = this.cookieAuthEnabled
      this.clearGuestSession()
      if (import.meta.client && !this.cookieAuthEnabled) localStorage.removeItem(AUTH_KEY)
    },
    applyAuthPayload(payload: Partial<typeof this.$state>) {
      Object.assign(this, payload)
      if (!this.cookieAuthEnabled) this.persistLegacyAuth()
    },
    broadcastAuthChange() {
      if (!import.meta.client) return
      window.dispatchEvent(new CustomEvent(AUTH_EVENT))
    },
    listenForAuthChanges(onChange: () => void) {
      if (!import.meta.client) return () => {}
      const handler = () => onChange()
      window.addEventListener(AUTH_EVENT, handler)
      return () => window.removeEventListener(AUTH_EVENT, handler)
    },
  },
})
