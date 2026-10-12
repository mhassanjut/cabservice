import { sanitizeCampaignAttribution } from './campaignAttribution'

export const MEASUREMENT_CONSENT_KEY = 'stw:measurement-consent:v1'
export const CAMPAIGN_ATTRIBUTION_KEY = 'stw:campaign-attribution:v1'

export type MeasurementConsent = 'granted' | 'denied'

export function getMeasurementConsent(): MeasurementConsent | null {
  if (!import.meta.client) return null

  try {
    const value = localStorage.getItem(MEASUREMENT_CONSENT_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

export function saveMeasurementConsent(consent: MeasurementConsent) {
  if (!import.meta.client) return

  try {
    localStorage.setItem(MEASUREMENT_CONSENT_KEY, consent)
    if (consent === 'denied') sessionStorage.removeItem(CAMPAIGN_ATTRIBUTION_KEY)
  } catch {
    // Measurement remains disabled when browser storage is unavailable.
  }

  window.dispatchEvent(new CustomEvent('stw:measurement-consent', { detail: consent }))
}

export function getCampaignAttribution(): Record<string, string> {
  if (!import.meta.client || getMeasurementConsent() !== 'granted') return {}

  try {
    const stored = sessionStorage.getItem(CAMPAIGN_ATTRIBUTION_KEY)
    if (stored) return sanitizeCampaignAttribution(JSON.parse(stored))

    const url = new URL(window.location.href)
    const attribution: Record<string, string> = {}
    const keys = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_content', 'utm_term']

    for (const key of keys) {
      const value = url.searchParams.get(key)
      if (value) attribution[key] = value.slice(0, 500)
    }

    attribution.landing_page = url.pathname
    if (document.referrer) attribution.referrer = new URL(document.referrer).origin
    attribution.attribution_captured_at = new Date().toISOString()
    const safeAttribution = sanitizeCampaignAttribution(attribution)
    sessionStorage.setItem(CAMPAIGN_ATTRIBUTION_KEY, JSON.stringify(safeAttribution))
    return safeAttribution
  } catch {
    return {}
  }
}
