import type { WpPost } from '~/types/wordpress'

export type ParsedSeo = {
  title?: string
  canonical?: string
  meta?: Record<string, unknown>
  og?: Record<string, unknown>
  twitter?: Record<string, unknown>
  article?: Record<string, unknown>
  properties?: Record<string, unknown>
  links?: Record<string, unknown>
  schema?: unknown[]
  rawHead?: string
}

export type BlogDetailDto = {
  post: WpPost
  seo: ParsedSeo
}
