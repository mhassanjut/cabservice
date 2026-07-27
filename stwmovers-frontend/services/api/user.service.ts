import type { CustomerStatsDto, UserProfileDto } from '~/types/api'
import { api } from '~/services/http/api'

export const userService = {
  profile(opts?: { silent?: boolean }) {
    return api<UserProfileDto>('/api/v1/users/me', opts)
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
