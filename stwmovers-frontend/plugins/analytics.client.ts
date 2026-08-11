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
    let clarityLoaded = false

    const ensureClarity = (path: string) => {
      if (!shouldTrackPath(path)) return
      if (clarityId && !clarityLoaded) {
        loadMicrosoftClarity(clarityId)
        clarityLoaded = true
      }
    }

    ensureClarity(router.currentRoute.value.path)

    router.afterEach((to) => {
      ensureClarity(to.path)

      if (gaId && shouldTrackPath(to.path)) {
        window.gtag?.('config', gaId, { page_path: to.fullPath })
      }
    })
  },
})
