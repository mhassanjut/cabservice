import { seoDefaults } from '~/config/seo'

const NOINDEX_PATH_PREFIXES = [
  '/admin',
  '/booking',
  '/bookings',
  '/cars',
  '/confirm',
  '/dashboard',
  '/driver',
  '/guest',
  '/login',
  '/payment',
]

export function absoluteUrl(pathOrUrl: string, siteUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return `${siteUrl.replace(/\/$/, '')}/${pathOrUrl.replace(/^\//, '')}`
}

export function robotsForPath(path?: string) {
  if (!path) return 'index,follow'
  return NOINDEX_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
    ? 'noindex,follow'
    : 'index,follow'
}

export function pageTitle(title?: string) {
  return title ? `${title}` : seoDefaults.defaultTitle
}

export function pageDescription(description?: string) {
  return description || seoDefaults.defaultDescription
}
