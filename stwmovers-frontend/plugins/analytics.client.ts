import { getCampaignAttribution, getMeasurementConsent } from '~/utils/measurementConsent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] }
  }
}

function shouldTrackPath(path: string): boolean {
  return !path.startsWith('/admin')
}

function injectAsyncScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return
  const script = document.createElement('script')
  script.async = true
  script.src = src
  const firstScript = document.getElementsByTagName('script')[0]
  firstScript?.parentNode?.insertBefore(script, firstScript)
}

function loadMicrosoftClarity(projectId: string) {
  const w = window as Window & { clarity?: ((...args: unknown[]) => void) & { q?: unknown[] } }
  w.clarity =
    w.clarity ||
    function clarityQueue(...args: unknown[]) {
      ;(w.clarity!.q = w.clarity!.q || []).push(args)
    }

  injectAsyncScript(`https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`)
}

function loadGoogleAnalytics(gaId: string, pagePath: string) {
  if (!/^G-[A-Z0-9]+$/.test(gaId)) return

  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtagQueue(...args: unknown[]) {
      window.dataLayer!.push(args)
    }
  window.gtag('js', new Date())
  window.gtag('config', gaId, { page_path: pagePath, send_page_view: true })

  injectAsyncScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`)
}

function setGoogleConsent(consent: 'granted' | 'denied') {
  window.gtag?.('consent', 'update', {
    analytics_storage: consent,
    ad_storage: consent,
    ad_user_data: consent,
    ad_personalization: consent,
  })
}

function onIdleOrIntent(callback: () => void) {
  let called = false
  let timeoutId: number | undefined

  const run = () => {
    if (called) return
    called = true
    if (timeoutId) window.clearTimeout(timeoutId)
    window.removeEventListener('pointerdown', run)
    window.removeEventListener('keydown', run)
    window.removeEventListener('scroll', run)
    window.removeEventListener('touchstart', run)
    callback()
  }

  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
  }

  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(run, { timeout: 4500 })
  } else {
    timeoutId = window.setTimeout(run, 4500)
  }

  window.addEventListener('pointerdown', run, { once: true, passive: true })
  window.addEventListener('keydown', run, { once: true })
  window.addEventListener('scroll', run, { once: true, passive: true })
  window.addEventListener('touchstart', run, { once: true, passive: true })
}

export default defineNuxtPlugin({
  name: 'analytics',
  setup() {
    const config = useRuntimeConfig()
    const gaId = String(config.public.googleAnalyticsId || '').trim()
    const adsId = String(config.public.googleAdsConversionId || '').trim()
    const clarityId = String(config.public.microsoftClarityId || '').trim()

    if (!gaId && !clarityId && !adsId) return

    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function gtagQueue(...args: unknown[]) {
      window.dataLayer!.push(args)
    }
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    })

    const router = useRouter()
    let gaLoaded = false
    let adsConfigured = false
    let clarityLoaded = false

    const ensureAnalytics = (path: string, fullPath = path) => {
      if (!shouldTrackPath(path)) return
      if (gaId && !gaLoaded) {
        loadGoogleAnalytics(gaId, fullPath)
        gaLoaded = true
      }
      if (adsId && !adsConfigured) {
        if (!gaId) {
          window.gtag?.('js', new Date())
          injectAsyncScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(adsId)}`)
        }
        window.gtag?.('config', adsId)
        adsConfigured = true
      }
      if (clarityId && !clarityLoaded) {
        loadMicrosoftClarity(clarityId)
        clarityLoaded = true
      }
    }

    const enableMeasurement = () => {
      if (getMeasurementConsent() !== 'granted') return
      setGoogleConsent('granted')
      getCampaignAttribution()
      const current = router.currentRoute.value
      ensureAnalytics(current.path, current.fullPath)
      if (clarityId && !clarityLoaded) {
        loadMicrosoftClarity(clarityId)
        clarityLoaded = true
      }
    }

    if (getMeasurementConsent() === 'granted') {
      enableMeasurement()
      onIdleOrIntent(enableMeasurement)
    }

    window.addEventListener('stw:measurement-consent', ((event: CustomEvent<'granted' | 'denied'>) => {
      if (event.detail === 'granted') {
        enableMeasurement()
      } else {
        setGoogleConsent('denied')
        window.location.reload()
      }
    }) as EventListener)

    router.afterEach((to) => {
      if (getMeasurementConsent() !== 'granted') return
      const wasGaLoaded = gaLoaded
      ensureAnalytics(to.path, to.fullPath)
      if (gaId && wasGaLoaded && shouldTrackPath(to.path)) {
        window.gtag?.('config', gaId, { page_path: to.fullPath })
      }
    })
  },
})
