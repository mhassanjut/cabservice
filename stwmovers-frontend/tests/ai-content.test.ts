import { describe, expect, it } from 'vitest'
import { findGrowthPage, growthPageSchema, growthPages } from '../data/growthSeoPages'

const priority = ['barcelona-airport-transfer', 'private-driver-barcelona', 'executive-chauffeur-barcelona', 'barcelona-cruise-port-transfer', 'barcelona-van-transfer']

describe('AI visibility content safeguards', () => {
  it.each(priority)('%s has useful answers and booking guidance', (slug) => {
    const page = findGrowthPage('service', slug)!
    expect(page).toBeDefined()
    expect(page.directAnswer!.length).toBeGreaterThan(100)
    expect(page.sections.length).toBeGreaterThanOrEqual(3)
    expect(page.lastUpdated).toBe('2026-10-07')
    expect(page.primaryCta?.href).toBe('/journey#book-journey')
    expect(JSON.stringify(page)).not.toMatch(/Competitors rank|Compete with|paid ads|search intent/i)
    const schema = growthPageSchema(page)['@graph']
    const faq = schema.find(node => node['@type'] === 'FAQPage')
    expect(faq).toMatchObject({ mainEntity: page.faqs.map(item => ({ name: item.question, acceptedAnswer: { text: item.answer } })) })
  })
  it('does not invent a reviewer in structured data', () => {
    for (const page of growthPages) {
      if (!page.reviewedBy) expect(JSON.stringify(growthPageSchema(page))).not.toContain('reviewedBy')
    }
  })
  it('retains unique route ownership', () => {
    expect(new Set(growthPages.map(page => page.path)).size).toBe(growthPages.length)
  })
})
