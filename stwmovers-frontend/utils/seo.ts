import { seoDefaults } from '~/config/seo'

export function absoluteUrl(pathOrUrl: string, siteUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return `${siteUrl.replace(/\/$/, '')}/${pathOrUrl.replace(/^\//, '')}`
}

export function pageTitle(title?: string) {
  return title ? `${title}` : seoDefaults.defaultTitle
}

export function pageDescription(description?: string) {
  return description || seoDefaults.defaultDescription
}

