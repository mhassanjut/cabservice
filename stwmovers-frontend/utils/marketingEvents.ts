type MarketingEventParams = Record<string, string | number | boolean | null | undefined>

export function trackMarketingEvent(eventName: string, params: MarketingEventParams = {}) {
  if (!import.meta.client) return

  const payload = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
  )

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: eventName,
    ...payload,
  })

  window.gtag?.('event', eventName, payload)
  window.clarity?.('event', eventName)
}
