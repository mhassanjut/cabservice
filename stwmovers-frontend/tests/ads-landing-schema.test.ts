import { describe, expect, it } from 'vitest'
import { adsLandingPageSchema, adsLandingPages } from '../data/adsLandingPages'
import { canonicalPathFor } from '../config/seoPagePolicy'

describe('paid landing page structured data', () => {
  it.each(Object.values(adsLandingPages).map((page) => [page.slug, page] as const))(
    '%s describes only page-visible entities',
    (_slug, page) => {
    const graph = adsLandingPageSchema(page, 'https://www.stwmovers.com')['@graph']
    const types = graph.map((node) => node['@type'])
    const faq = graph.find((node) => node['@type'] === 'FAQPage')
    const service = graph.find((node) => node['@type'] === 'Service')

    expect(types).toEqual(['WebPage', 'Service', 'FAQPage', 'BreadcrumbList'])
    expect(service).toMatchObject({
      provider: { '@id': 'https://www.stwmovers.com/#localbusiness' },
      url: `https://www.stwmovers.com${canonicalPathFor(page.path)}`,
    })
    expect(faq?.mainEntity).toEqual(page.faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })))
    expect(JSON.stringify(graph)).not.toMatch(/HowTo|trust-signals|comparison points|totalTime/)
    },
  )

  it('keeps every paid landing page path unique', () => {
    const paths = Object.values(adsLandingPages).map((page) => page.path)
    expect(new Set(paths).size).toBe(paths.length)
  })
})
