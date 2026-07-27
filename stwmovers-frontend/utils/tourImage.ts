import { isSvgMediaUrl, resolveMediaUrl } from '~/utils/media'

export const TOUR_IMAGE_PLACEHOLDER = '/img/tours/tour-placeholder.svg'

export function resolveTourImageUrl(src?: string | null): string {
  return resolveMediaUrl(src, TOUR_IMAGE_PLACEHOLDER)
}

export function isSvgTourImageUrl(src?: string | null): boolean {
  return isSvgMediaUrl(src)
}
