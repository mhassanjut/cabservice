import type { WpPost } from '~/types/wordpress'

/** Strip HTML tags from WordPress rendered fields. */
export function stripHtml(html: string | undefined | null): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Decode common HTML entities in WP titles/excerpts (SSR-safe). */
export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/gi, ' ')
}

export function wpTitle(post: WpPost): string {
  return decodeHtmlEntities(stripHtml(post.title?.rendered))
}

export function wpExcerpt(post: WpPost): string {
  return decodeHtmlEntities(stripHtml(post.excerpt?.rendered))
}

export function wpFeaturedImage(post: WpPost): { src: string; alt: string } | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  const src =
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.source_url
  if (!src) return null
  return {
    src,
    alt: media?.alt_text || wpTitle(post),
  }
}

export function formatWpDate(iso: string, locale = 'en-GB'): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function blogPath(slug: string): string {
  return `/blogs/${slug}`
}
