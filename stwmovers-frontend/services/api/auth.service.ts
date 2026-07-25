import type { AuthDto, BookingDto } from '~/types/api'
import { api } from '~/services/http/api'

export const authService = {
  login(email: string, password: string, opts?: { silent?: boolean }) {
    return api<AuthDto>('/api/v1/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
      silent: opts?.silent,
    })
  },
  register(email: string, password: string, fullName: string, phone?: string) {
    return api<AuthDto>('/api/v1/auth/register', {
      method: 'POST',
      body: { email, password, fullName, phone },
      auth: false,
    })
  },
  googleLogin(idToken: string) {
    return api<AuthDto>('/api/v1/auth/google', {
      method: 'POST',
      body: { idToken },
      auth: false,
    })
  },
  refresh() {
    return api<AuthDto>('/api/v1/auth/refresh', { method: 'POST' })
  },
  logout() {
    return api<void>('/api/v1/auth/logout', { method: 'POST' })
  },
  sendOtp(email: string, bookingReference: string) {
    return api<{ email: string; bookingReference: string; ttlSeconds: number }>(
      '/api/v1/auth/guest/otp/send',
      { method: 'POST', body: { email, bookingReference }, auth: false },
    )
  },
  verifyOtp(email: string, otp: string, bookingReference: string) {
    return api<BookingDto>('/api/v1/auth/guest/otp/verify', {
      method: 'POST',
      body: { email, otp, bookingReference },
      auth: false,
    })
  },
}
