import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')
const fail = (message) => {
  throw new Error(message)
}
const assert = (condition, message) => {
  if (!condition) fail(message)
}

const growth = read('data/growthSeoPages.ts')
const blogs = read('data/localBlogArticles.ts')
const nuxt = read('nuxt.config.ts')
const prerenderRoutesFile = read('config/prerenderRoutes.ts')
const llms = read('public/llms.txt')
const servicesMd = read('public/services.md')
const pricingMd = read('public/pricing.md')
const robots = read('public/robots.txt')

const priorityServiceSlugs = [
  'barcelona-airport-transfer',
  'barcelona-airport-taxi-alternative',
  'cab-service-barcelona',
  'private-driver-barcelona',
  'executive-chauffeur-barcelona',
]

const priorityBlogSlugs = [
  'barcelona-airport-to-eixample-private-transfer-guide',
  'barcelona-airport-to-cruise-port-transfer-guide',
  'barcelona-to-sitges-private-transfer-guide',
  'barcelona-airport-transfer-vs-taxi',
  'airport-taxi-barcelona-private-transfer-guide',
  'cab-service-barcelona-private-chauffeur-guide',
  'private-driver-barcelona-cost-booking-use-cases',
  'chauffeur-barcelona-luxury-airport-business-guide',
]

function objectBlockForSlug(source, slug) {
  const marker = `slug: '${slug}'`
  const start = source.indexOf(marker)
  assert(start >= 0, `Missing slug ${slug}`)

  const next = source.indexOf("\n  {\n", start + marker.length)
  return next >= 0 ? source.slice(start, next) : source.slice(start)
}

for (const slug of priorityServiceSlugs) {
  const block = objectBlockForSlug(growth, slug)
  assert(block.includes('sources:'), `Priority service ${slug} is missing sources`)
  assert(block.includes('primaryCta: bookCta'), `Priority service ${slug} is missing primary quote CTA`)
  assert(block.includes('secondaryCta: contactCta'), `Priority service ${slug} is missing contact CTA`)
}

for (const slug of priorityBlogSlugs) {
  assert(blogs.includes(`slug: '${slug}'`), `Priority article ${slug} missing from local blog data`)
  assert(llms.includes(`/blogs/${slug}`), `Priority article ${slug} missing from llms.txt`)
}

assert(blogs.includes('article-evidence-panel'), 'Local article HTML is missing visible evidence panel')
assert(blogs.includes('citation: articleSources(article).map'), 'Local BlogPosting schema is missing source citations')
assert(blogs.includes('officialAirportSource'), 'Local articles missing official airport evidence source')
assert(blogs.includes('officialTaxiFareSource'), 'Local articles missing official taxi fare evidence source')
assert(blogs.includes('officialVtcSource'), 'Local articles missing official VTC/private-hire evidence source')

for (const path of [
  '/services/barcelona-airport-transfer',
  '/services/barcelona-airport-taxi-alternative',
  '/services/cab-service-barcelona',
  '/services/private-driver-barcelona',
  '/services/executive-chauffeur-barcelona',
  '/blogs/barcelona-airport-transfer-vs-taxi',
  '/blogs/barcelona-airport-to-eixample-private-transfer-guide',
  '/blogs/barcelona-airport-to-cruise-port-transfer-guide',
  '/blogs/barcelona-to-sitges-private-transfer-guide',
  '/blogs/airport-taxi-barcelona-private-transfer-guide',
  '/blogs/cab-service-barcelona-private-chauffeur-guide',
  '/blogs/private-driver-barcelona-cost-booking-use-cases',
  '/blogs/chauffeur-barcelona-luxury-airport-business-guide',
]) {
  assert(
    prerenderRoutesFile.includes(`'${path}'`),
    `Priority route ${path} missing from prerender routes`,
  )
}

assert(llms.includes('Citation guidance'), 'llms.txt missing citation guidance')
assert(servicesMd.includes('Barcelona airport transfer'), 'services.md missing airport transfer catalog section')
assert(
  pricingMd.includes('What affects the quote') && pricingMd.includes('Pickup address or terminal'),
  'pricing.md missing quote-factor guidance',
)
assert(robots.includes('Sitemap:'), 'robots.txt missing sitemap reference')

assert(read('components/seo/GrowthSeoPage.vue').includes('growth_page_hero_action_clicked'), 'Growth page measurement event missing')
assert(read('components/seo/AdsLandingPage.vue').includes('ads_landing_action_clicked'), 'Ads landing measurement event missing')
assert(read('components/WhatsappLeadDialog.vue').includes('whatsapp_lead'), 'WhatsApp lead measurement event missing')

const knownPaths = new Set()
for (const source of [growth, nuxt, llms, servicesMd]) {
  for (const match of source.matchAll(/['"`](\/[a-z0-9][a-z0-9\-/#]*?)['"`]/g)) {
    knownPaths.add(match[1].split('#')[0])
  }
  for (const match of source.matchAll(/https:\/\/www\.stwmovers\.com(\/[a-z0-9][a-z0-9\-/#]*)/g)) {
    knownPaths.add(match[1].split('#')[0])
  }
}

const internalHrefPattern = /href: '([^']+)'/g
const missingLinks = []
for (const file of ['data/growthSeoPages.ts', 'data/localBlogArticles.ts', 'data/adsLandingPages.ts']) {
  const source = read(file)
  for (const match of source.matchAll(internalHrefPattern)) {
    const href = match[1]
    if (!href.startsWith('/')) continue
    const clean = href.split('#')[0]
    if (clean === '' || knownPaths.has(clean)) continue
    missingLinks.push(`${file}: ${href}`)
  }
}
assert(missingLinks.length === 0, `Potential missing internal links:\n${missingLinks.join('\n')}`)

for (const file of ['public/llms.txt', 'public/services.md', 'public/pricing.md']) {
  assert(existsSync(join(root, file)), `${file} is missing`)
}

console.log('SEO/AI local sprint checks passed')
