/** Minimal WordPress REST API post shape (wp/v2/posts). */

export type WpRendered = {
  rendered: string
  protected?: boolean
}

export type WpFeaturedMedia = {
  source_url?: string
  alt_text?: string
  media_details?: {
    sizes?: Record<string, { source_url?: string; width?: number; height?: number }>
  }
}

export type WpPost = {
  id: number
  date: string
  modified?: string
  slug: string
  link: string
  status?: string
  title: WpRendered
  excerpt: WpRendered
  content: WpRendered
  _embedded?: {
    'wp:featuredmedia'?: WpFeaturedMedia[]
    author?: Array<{ name?: string }>
  }
}
