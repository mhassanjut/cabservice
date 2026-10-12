import { describe, expect, it } from 'vitest'
import { bookingAttribution, sanitizeCampaignAttribution } from '../utils/campaignAttribution'

describe('consented booking attribution', () => {
  it('does not attach attribution without consent', () => {
    expect(bookingAttribution({ gclid: 'click-id' }, false)).toBeUndefined()
    expect(bookingAttribution({}, true)).toBeUndefined()
  })
  it('whitelists campaign data and strips private URL query strings', () => {
    expect(bookingAttribution({
      gclid: ' click-id ', landing_page: '/landing/airport?email=private#form',
      referrer: 'https://example.com/path?email=private', email: 'private@example.com',
    }, true)).toEqual({ gclid: 'click-id', landing_page: '/landing/airport', referrer: 'https://example.com', consent: 'granted' })
  })
  it('ignores malformed storage and unsafe URLs', () => {
    for (const input of [null, [], 'not-json', { landing_page: '//example.com', referrer: 'javascript:alert(1)', utm_campaign: 17 }]) {
      expect(sanitizeCampaignAttribution(input)).toEqual({})
    }
  })
  it('bounds campaign values and normalizes timestamps', () => {
    const data = sanitizeCampaignAttribution({ utm_campaign: 'x'.repeat(700), gclid: 'a\nb', attribution_captured_at: '2026-10-12T10:00:00Z' })
    expect(data.utm_campaign).toHaveLength(500)
    expect(data.gclid).toBe('ab')
    expect(data.attribution_captured_at).toBe('2026-10-12T10:00:00.000Z')
  })
})
