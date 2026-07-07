import { VEHICLE_IMAGE_PLACEHOLDER } from '~/types/booking'

export function resolveVehicleImageUrl(src?: string | null): string {
  const trimmed = src?.trim()
  if (!trimmed) return VEHICLE_IMAGE_PLACEHOLDER
  if (
    trimmed.startsWith('http://')
    || trimmed.startsWith('https://')
    || trimmed.startsWith('data:')
    || trimmed.startsWith('blob:')
  ) {
    return trimmed
  }
  if (trimmed.startsWith('/api/')) {
    const config = useRuntimeConfig()
    return `${config.public.apiBaseUrl}${trimmed}`
  }
  return trimmed
}

export function isSvgImageUrl(src?: string | null): boolean {
  const value = src?.trim().toLowerCase() ?? ''
  return value.endsWith('.svg') || value.includes('.svg?')
}
