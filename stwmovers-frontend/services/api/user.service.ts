import type { CustomerStatsDto, UserProfileDto } from '~/types/api'
import { api } from '~/services/http/api'

export const userService = {
  profile() {
    return api<UserProfileDto>('/api/v1/users/me')
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
