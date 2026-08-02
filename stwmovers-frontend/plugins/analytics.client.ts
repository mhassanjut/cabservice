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

function loadGoogleAnalytics(measurementId: string) {
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  document.head.appendChild(script)
}

function loadMicrosoftClarity(projectId: string) {
  const w = window as Window & { clarity?: ((...args: unknown[]) => void) & { q?: unknown[] } }
  w.clarity =
    w.clarity ||
    function clarityQueue(...args: unknown[]) {
      ;(w.clarity!.q = w.clarity!.q || []).push(args)
    }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`
  const firstScript = document.getElementsByTagName('script')[0]
  firstScript?.parentNode?.insertBefore(script, firstScript)
}

export default defineNuxtPlugin({
  name: 'analytics',
  setup() {
    const config = useRuntimeConfig()
    const gaId = String(config.public.googleAnalyticsId || '').trim()
    const clarityId = String(config.public.microsoftClarityId || '').trim()

    if (!gaId && !clarityId) return

    const router = useRouter()
    let gaLoaded = false
    let clarityLoaded = false

    const ensureAnalytics = (path: string) => {
      if (!shouldTrackPath(path)) return

      if (gaId && !gaLoaded) {
        loadGoogleAnalytics(gaId)
        gaLoaded = true
      }

      if (clarityId && !clarityLoaded) {
        loadMicrosoftClarity(clarityId)
        clarityLoaded = true
      }
    }

    ensureAnalytics(router.currentRoute.value.path)

    router.afterEach((to) => {
      ensureAnalytics(to.path)

      if (gaId && gaLoaded && shouldTrackPath(to.path)) {
        window.gtag?.('config', gaId, { page_path: to.fullPath })
      }
    })
  },
})
