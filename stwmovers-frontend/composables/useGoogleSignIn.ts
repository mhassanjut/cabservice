type GoogleCredentialResponse = {
  credential: string
  select_by?: string
}

type GoogleIdentityConfig = {
  client_id: string
  callback: (response: GoogleCredentialResponse) => void
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
}

type GoogleIdentityServices = {
  accounts: {
    id: {
      initialize: (config: GoogleIdentityConfig) => void
      renderButton: (
        parent: HTMLElement,
        options: {
          type?: string
          theme?: string
          size?: string
          text?: string
          width?: number
          shape?: string
        },
      ) => void
    }
  }
}

declare global {
  interface Window {
    google?: GoogleIdentityServices
  }
}

let scriptPromise: Promise<void> | null = null

export function useGoogleSignIn() {
  const config = useRuntimeConfig()
  const clientId = computed(() => (config.public.googleClientId as string)?.trim() ?? '')
  const isConfigured = computed(() => Boolean(clientId.value))

  const loadScript = () => {
    if (import.meta.server) return Promise.reject(new Error('Google Sign-In is client-only'))
    if (window.google?.accounts?.id) return Promise.resolve()
    if (scriptPromise) return scriptPromise

    scriptPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector('script[data-google-gsi="true"]')
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true })
        existing.addEventListener('error', () => reject(new Error('Google Sign-In failed to load')), { once: true })
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.dataset.googleGsi = 'true'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Google Sign-In failed to load'))
      document.head.appendChild(script)
    })

    return scriptPromise
  }

  const renderButton = async (
    container: HTMLElement,
    onSuccess: (idToken: string) => void,
    onError: (message: string) => void,
  ) => {
    if (!isConfigured.value) {
      onError('Google Sign-In is not configured')
      return
    }

    try {
      await loadScript()
      window.google!.accounts.id.initialize({
        client_id: clientId.value,
        callback: (response) => onSuccess(response.credential),
        auto_select: false,
        cancel_on_tap_outside: true,
      })
      container.replaceChildren()
      window.google!.accounts.id.renderButton(container, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: Math.max(container.clientWidth, 280),
      })
    } catch {
      onError('Google Sign-In failed to load. Allow popups for this site or try again.')
    }
  }

  return {
    clientId,
    isConfigured,
    loadScript,
    renderButton,
  }
}
