export type AiReferralSource = 'chatgpt' | 'perplexity' | 'copilot' | 'gemini' | 'claude'

const sources: Record<string, AiReferralSource> = {
  'chatgpt.com': 'chatgpt',
  'chat.openai.com': 'chatgpt',
  'perplexity.ai': 'perplexity',
  'copilot.microsoft.com': 'copilot',
  'gemini.google.com': 'gemini',
  'claude.ai': 'claude',
}

/** Attribution is a referral hint, not proof of a citation or recommendation. */
export function classifyAiReferral(landingUrl: string, referrer: string): AiReferralSource | undefined {
  try {
    const source = new URL(landingUrl).searchParams.get('utm_source')?.toLowerCase()
    if (source && sources[source]) return sources[source]
  } catch { /* Invalid URLs carry no attribution. */ }

  try {
    const hostname = new URL(referrer).hostname.toLowerCase().replace(/^www\./, '')
    return sources[hostname]
  } catch {
    return undefined
  }
}

let captured = false
let source: AiReferralSource | undefined

export function captureAiReferral(landingUrl: string, referrer: string) {
  if (captured) return
  captured = true
  source = classifyAiReferral(landingUrl, referrer)
}

export function getAiReferral() {
  return source
}
