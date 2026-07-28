import type { CustomerStatsDto, UserProfileDto } from '~/types/api'
import { api } from '~/services/http/api'

export const userService = {
  /** Returns null when the visitor is anonymous (HTTP 200, empty profile). */
  profile(opts?: { silent?: boolean }) {
    return api<UserProfileDto | null>('/api/v1/users/me', opts)
  },
  updateProfile(fullName: string, phone?: string) {
    return api<UserProfileDto>('/api/v1/users/me', {
      method: 'PATCH',
      body: { fullName, phone },
    })
  },
  stats() {
    return api<CustomerStatsDto>('/api/v1/users/me/stats')
  },
}
