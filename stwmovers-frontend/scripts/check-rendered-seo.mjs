import { Window } from 'happy-dom'

const origin = process.argv[2] || 'http://127.0.0.1:3002'
const extraPaths = process.argv.slice(3)
const window = new Window()
const parser = new window.DOMParser()
const sitemapResponse = await fetch(new URL('/sitemap.xml', origin))
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`)
const sitemap = parser.parseFromString(await sitemapResponse.text(), 'application/xml')
const entries = Array.from(sitemap.querySelectorAll('url')).map(entry => ({
  path: new URL(entry.querySelector('loc').textContent).pathname,
  lastmod: entry.querySelector('lastmod')?.textContent,
}))
const pages = [...entries, ...extraPaths.map(path => ({ path }))]
const failures = []
let cursor = 0
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < pages.length) {
    const entry = pages[cursor++]
    try {
      const response = await fetch(new URL(entry.path, origin), { signal: AbortSignal.timeout(30000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const document = parser.parseFromString(await response.text(), 'text/html')
      if (!document.title.trim()) throw new Error('Missing title')
      if (document.querySelectorAll('h1').length !== 1) throw new Error('Expected exactly one H1')
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href')
      if (!canonical || !canonical.startsWith('https://')) throw new Error('Missing absolute HTTPS canonical')
      const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || ''
      if (entries.includes(entry) && (robots.includes('noindex') || new URL(canonical).pathname !== entry.path)) {
        throw new Error('Sitemap URL is noncanonical or noindex')
      }
      if (entry.path.startsWith('/landing/') && (!robots.includes('noindex') || !response.headers.get('x-robots-tag')?.includes('noindex'))) {
        throw new Error('Campaign page must be noindex in HTML and HTTP headers')
      }
      for (const node of document.querySelectorAll('script[type="application/ld+json"]')) JSON.parse(node.textContent)
      if (entry.lastmod && !Number.isFinite(Date.parse(entry.lastmod))) throw new Error('Invalid sitemap lastmod')
    } catch (error) {
      failures.push({ path: entry.path, issue: error.message })
    }
  }
}))
await window.happyDOM.close()
console.log(JSON.stringify({ checked: pages.length, sitemapEntries: entries.length, failures }, null, 2))
if (failures.length) process.exitCode = 1
