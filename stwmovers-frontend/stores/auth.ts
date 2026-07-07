import type { AuthDto, Role } from '~/types/api'
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
    userId: '' as string,
    email: '',
    fullName: '',
    role: null as Role | null,
    profilePictureUrl: '' as string,
    guestSession: null as GuestSession | null,
    hydrated: false,
  }),
  getters: {
    isLoggedIn: (s) => Boolean(s.token),
    isCustomer: (s) => s.role === 'CUSTOMER',
    isAdmin: (s) => s.role === 'ADMIN',
    isDriver: (s) => s.role === 'DRIVER',
    isGuestSession: (s) => Boolean(s.guestSession && !s.token),
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
      this.token = d.accessToken
      this.userId = d.userId
      this.email = d.email
      this.fullName = d.fullName
      this.role = d.role
      this.profilePictureUrl = d.profilePictureUrl ?? ''
      this.guestSession = null
      if (import.meta.client) {
        sessionStorage.removeItem(GUEST_KEY)
        useBookingStore().clearGuestDetails()
      }
      this.persistAuth()
      this.broadcastAuthChange()
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
      this.syncFromStorage()
      this.hydrated = true
    },
    syncFromStorage() {
      if (!import.meta.client) return
      const raw = localStorage.getItem(AUTH_KEY)
      if (!raw) {
        if (this.token) {
          this.token = ''
          this.userId = ''
          this.email = ''
          this.fullName = ''
          this.role = null
          this.profilePictureUrl = ''
        }
      } else {
        try {
          const parsed = JSON.parse(raw) as Partial<typeof this.$state>
          this.token = parsed.token ?? ''
          this.userId = parsed.userId ?? ''
          this.email = parsed.email ?? ''
          this.fullName = parsed.fullName ?? ''
          this.role = parsed.role ?? null
          this.profilePictureUrl = parsed.profilePictureUrl ?? ''
        } catch {
          localStorage.removeItem(AUTH_KEY)
          this.token = ''
          this.userId = ''
          this.email = ''
          this.fullName = ''
          this.role = null
          this.profilePictureUrl = ''
        }
      }
      if (!this.token) {
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
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({
          token: this.token,
          userId: this.userId,
          email: this.email,
          fullName: this.fullName,
          role: this.role,
          profilePictureUrl: this.profilePictureUrl,
        }),
      )
    },
    async logout() {
      try {
        if (this.token) {
          const { authService } = await import('~/services/api/auth.service')
          await authService.logout()
        }
      } catch {
        /* client logout still proceeds */
      }
      this.clear()
      this.broadcastAuthChange()
    },
    clear() {
      this.token = ''
      this.userId = ''
      this.email = ''
      this.fullName = ''
      this.role = null
      this.profilePictureUrl = ''
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
