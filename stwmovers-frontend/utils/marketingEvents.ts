import { getAiReferral } from './aiReferral'
import { getCampaignAttribution, getMeasurementConsent } from './measurementConsent'

type MarketingEventParams = Record<string, string | number | boolean | null | undefined | unknown[]>

export function trackMarketingEvent(eventName: string, params: MarketingEventParams = {}) {
  if (!import.meta.client) return
  if (getMeasurementConsent() !== 'granted') return

  getCampaignAttribution()
  const payload = Object.fromEntries(
    Object.entries({ ...params, ai_referral_source: getAiReferral() }).filter(([, value]) => value !== undefined && value !== null),
  )

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: eventName,
    ...payload,
  })

  window.gtag?.('event', eventName, payload)
  window.clarity?.('event', eventName)
}

export function trackGoogleAdsPurchase(input: {
  conversionId: string
  conversionLabel: string
  transactionId: string
  value: number
  currency: string
}) {
  if (!import.meta.client || getMeasurementConsent() !== 'granted') return
  if (!/^AW-\d+$/.test(input.conversionId) || !input.conversionLabel || !input.transactionId) return
  if (!Number.isFinite(input.value) || input.value < 0) return

  window.gtag?.('event', 'conversion', {
    send_to: `${input.conversionId}/${input.conversionLabel}`,
    transaction_id: input.transactionId,
    value: input.value,
    currency: input.currency,
  })
}
