import { growthPages } from '~/data/growthSeoPages'
import { localBlogArticles } from '~/data/localBlogArticles'
import { legalPages } from '~/data/legalPages'
import { canonicalPathFor } from './seoPagePolicy'
import { robotsForPath } from '~/utils/seo'

export type SitemapEntry = { path: string; lastmod?: string }

const evergreenPaths = [
  '/', '/services', '/locations', '/answers', '/blogs', '/about-us', '/contact',
  '/journey', '/tours', '/faq', '/barcelona-taxi-alternative',
  '/executive-business-travel', '/chauffeur-service', '/chauffeur-service-barcelona-08015',
  '/website-credits',
]

// Published CMS articles remain discoverable independently of CMS availability.
const cmsArticlePaths = ['/blogs/barcelona-to-costa-brava', '/blogs/barcelona-tour', '/blogs/stw-movers']

export function sitemapEntries(): SitemapEntry[] {
  const candidates: SitemapEntry[] = [
    ...evergreenPaths.map((path) => ({ path })),
    ...cmsArticlePaths.map((path) => ({ path })),
    ...growthPages.map((page) => ({ path: page.path, lastmod: page.lastUpdated })),
    ...localBlogArticles.map((article) => ({ path: `/blogs/${article.slug}`, lastmod: article.modified || article.date })),
    ...legalPages.map((page) => ({ path: `/${page.slug}`, lastmod: new Date(`${page.updated} 00:00:00 UTC`).toISOString().slice(0, 10) })),
  ]
  return candidates.filter((page, index) =>
    robotsForPath(page.path) === 'index,follow'
    && canonicalPathFor(page.path) === page.path
    && candidates.findIndex((other) => other.path === page.path) === index,
  )
}

function xmlEscape(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]!)
}

export function sitemapXml(siteUrl: string, entries = sitemapEntries()) {
  const origin = siteUrl.replace(/\/$/, '')
  const rows = entries.map((page) => {
    const modified = page.lastmod ? `<lastmod>${xmlEscape(page.lastmod)}</lastmod>` : ''
    return `  <url><loc>${xmlEscape(`${origin}${page.path}`)}</loc>${modified}</url>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>\n`
}
