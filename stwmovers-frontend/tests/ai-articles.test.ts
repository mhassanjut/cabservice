import { describe, expect, it } from 'vitest'
import { findLocalBlogArticle, localArticleToWpPost, localBlogSeo } from '../data/localBlogArticles'

const slugs = ['barcelona-airport-transfer-vs-taxi', 'airport-taxi-barcelona-private-transfer-guide', 'barcelona-airport-to-cruise-port-transfer-guide', 'taxi-van-barcelona-groups-luggage-airport', 'hourly-chauffeur-barcelona-when-it-makes-sense']

describe('evidence-led article refresh', () => {
  it.each(slugs)('%s keeps publication identity and exposes its update', (slug) => {
    const article = findLocalBlogArticle(slug)!
    const post = localArticleToWpPost(article)
    expect(post.date).toBe(article.date)
    expect(post.modified).toBe('2026-10-07T00:00:00.000Z')
    expect(post.content.rendered).toContain('Updated 2026-10-07')
    expect(article.directAnswer.length).toBeGreaterThan(100)
    expect(post.content.rendered).toContain('Sources behind this guide')
    const schema = JSON.stringify(localBlogSeo(article).schema)
    expect(schema).toContain(`"datePublished":"${article.date}"`)
    expect(schema).toContain(`"dateModified":"${article.modified}"`)
    expect(schema).not.toContain('reviewedBy')
    expect(schema).not.toContain('dispatch team')
    expect(article.related.some(link => link.href.startsWith('/services/'))).toBe(true)
  })
  it('does not collapse the van guide into generic airport comparisons', () => {
    const html = localArticleToWpPost(findLocalBlogArticle(slugs[3]!)!).content.rendered
    expect(html).toContain('Confirmed seating and luggage capacity')
    expect(html).not.toContain('7-seat or 8-seat taxi intent')
  })
})
