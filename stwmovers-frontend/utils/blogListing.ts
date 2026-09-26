import type { WpPost } from '../types/wordpress'

export function mergePublishedPosts(local: WpPost[], remote: WpPost[]) {
  const bySlug = new Map<string, WpPost>()
  for (const post of [...local, ...remote]) {
    if (post.status && post.status !== 'publish') continue
    bySlug.set(post.slug, post)
  }
  const date = (post: WpPost) => Date.parse(post.date) || 0
  return [...bySlug.values()].sort((a, b) => date(b) - date(a) || a.slug.localeCompare(b.slug))
}

export function blogTopic(post: WpPost) {
  const slug = post.slug.toLowerCase()
  if (/van|group|family/.test(slug)) return 'Groups'
  if (/airport|bcn/.test(slug)) return 'Airport'
  if (/driver|chauffeur|hourly|executive/.test(slug)) return 'Private Driver'
  return 'Barcelona Travel'
}

export function readingMinutes(html: string) {
  const text = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/&[^;]+;/g, ' ')
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 220))
}
