const campaignKeys = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_content', 'utm_term'] as const

export function sanitizeCampaignAttribution(input: unknown): Record<string, string> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {}
  const source = input as Record<string, unknown>
  const result: Record<string, string> = {}
  for (const key of campaignKeys) {
    if (typeof source[key] === 'string') {
      const value = Array.from(source[key]).filter(character => character.charCodeAt(0) > 31 && character.charCodeAt(0) !== 127).join('').trim().slice(0, 500)
      if (value) result[key] = value
    }
  }
  if (typeof source.landing_page === 'string' && source.landing_page.startsWith('/') && !source.landing_page.startsWith('//')) {
    result.landing_page = source.landing_page.split(/[?#]/)[0]!.slice(0, 500)
  }
  if (typeof source.referrer === 'string') {
    try {
      const url = new URL(source.referrer)
      if (url.protocol === 'https:' || url.protocol === 'http:') result.referrer = url.origin
    } catch { /* Invalid referrers add no attribution. */ }
  }
  if (typeof source.attribution_captured_at === 'string' && Number.isFinite(Date.parse(source.attribution_captured_at))) {
    result.attribution_captured_at = new Date(source.attribution_captured_at).toISOString()
  }
  return result
}

export function bookingAttribution(input: unknown, consentGranted: boolean) {
  if (!consentGranted) return undefined
  const attribution = sanitizeCampaignAttribution(input)
  return Object.keys(attribution).length ? { ...attribution, consent: 'granted' } : undefined
}
