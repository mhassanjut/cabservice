import { VEHICLE_IMAGE_PLACEHOLDER } from '~/types/booking'
import { isSvgMediaUrl, resolveMediaUrl } from '~/utils/media'

export function resolveVehicleImageUrl(src?: string | null): string {
  return resolveMediaUrl(src, VEHICLE_IMAGE_PLACEHOLDER)
}

export function isSvgImageUrl(src?: string | null): boolean {
  return isSvgMediaUrl(src)
}
