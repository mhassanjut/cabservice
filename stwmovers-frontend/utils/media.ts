/**
 * Resolves a possibly-relative media path (as stored by the backend, e.g. `/api/v1/media/...`)
 * into an absolute URL the browser can load, falling back to a placeholder when empty.
 */
export function resolveMediaUrl(src: string | null | undefined, placeholder: string): string {
  const trimmed = src?.trim()
  if (!trimmed) return placeholder
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

export function isSvgMediaUrl(src?: string | null): boolean {
  const value = src?.trim().toLowerCase() ?? ''
  return value.endsWith('.svg') || value.includes('.svg?')
}
