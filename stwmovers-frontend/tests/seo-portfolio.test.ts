import { describe, expect, it } from 'vitest'
import { canonicalPathFor } from '../config/seoPagePolicy'
import { sitemapEntries, sitemapXml } from '../config/sitemap'
import { growthPages, growthPageSchema } from '../data/growthSeoPages'
import { localBlogArticles } from '../data/localBlogArticles'
import { robotsForPath } from '../utils/seo'

describe('organic page ownership', () => {
  it('keeps campaign pages out of organic indexing without hiding service pages', () => {
    expect(robotsForPath('/landing/airport-taxi-barcelona')).toBe('noindex,follow')
    expect(robotsForPath('/services/barcelona-airport-transfer')).toBe('index,follow')
    expect(canonicalPathFor('/airport-transfer')).toBe('/services/barcelona-airport-transfer')
    expect(canonicalPathFor('/locations/barcelona-airport-chauffeur-service')).toBe('/services/barcelona-airport-transfer')
  })
  it('does not send hourly itineraries into one-way instant pricing', () => {
    expect(growthPages.find(page => page.slug === 'hourly-chauffeur-barcelona')?.primaryCta).toEqual({ label: 'Request a tailored itinerary', href: '/contact' })
  })
  it('includes only unique, indexable canonical sitemap entries', () => {
    const entries = sitemapEntries()
    expect(entries.length).toBeGreaterThan(60)
    expect(new Set(entries.map(entry => entry.path)).size).toBe(entries.length)
    for (const entry of entries) {
      expect(robotsForPath(entry.path)).toBe('index,follow')
      expect(canonicalPathFor(entry.path)).toBe(entry.path)
      if (entry.lastmod) {
        expect(entry.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}\.\d{3}Z)?$/)
        expect(Number.isFinite(Date.parse(entry.lastmod))).toBe(true)
      }
    }
  })
  it('uses content modification dates, not deployment dates', () => {
    const entries = sitemapEntries()
    for (const article of localBlogArticles) {
      expect(entries.find(entry => entry.path === `/blogs/${article.slug}`)?.lastmod).toBe(article.modified || article.date)
    }
    for (const page of growthPages.filter(page => canonicalPathFor(page.path) === page.path)) {
      expect(entries.find(entry => entry.path === page.path)?.lastmod).toBe(page.lastUpdated)
    }
    expect(sitemapXml('https://example.com/', [{ path: '/test?a=1&b=2' }])).toContain('https://example.com/test?a=1&amp;b=2')
  })
  it('provides practical route facts without synthetic comparison lists', () => {
    const routes = growthPages.filter(page => page.journey)
    expect(routes).toHaveLength(8)
    for (const page of routes) {
      expect(page.journey?.checklist.length).toBeGreaterThanOrEqual(3)
      expect(page.sources?.length).toBeGreaterThan(0)
      expect(growthPageSchema(page)['@graph'].some(node => node['@type'] === 'ItemList')).toBe(false)
    }
  })
})
