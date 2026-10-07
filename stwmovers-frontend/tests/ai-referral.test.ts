import { describe, expect, it, vi } from 'vitest'
import { classifyAiReferral } from '../utils/aiReferral'

describe('AI referral hints', () => {
  it('keeps the first landing classification through internal navigation', async () => {
    vi.resetModules()
    const referral = await import('../utils/aiReferral')
    referral.captureAiReferral('https://www.stwmovers.com/?utm_source=chatgpt.com', '')
    referral.captureAiReferral('https://www.stwmovers.com/journey', '')
    expect(referral.getAiReferral()).toBe('chatgpt')
  })
  it('does not relabel an ordinary visit after an internal navigation', async () => {
    vi.resetModules()
    const referral = await import('../utils/aiReferral')
    referral.captureAiReferral('https://www.stwmovers.com/', '')
    referral.captureAiReferral('https://www.stwmovers.com/journey?utm_source=chatgpt.com', '')
    expect(referral.getAiReferral()).toBeUndefined()
  })
  it('recognizes the ChatGPT source parameter without retaining other data', () => {
    expect(classifyAiReferral('https://www.stwmovers.com/?utm_source=chatgpt.com&email=private', '')).toBe('chatgpt')
  })
  it.each([
    ['https://www.perplexity.ai/search/example', 'perplexity'],
    ['https://copilot.microsoft.com/', 'copilot'],
    ['https://gemini.google.com/app', 'gemini'],
    ['https://claude.ai/chat/example', 'claude'],
  ])('recognizes %s', (referrer, expected) => {
    expect(classifyAiReferral('https://www.stwmovers.com/', referrer)).toBe(expected)
  })
  it.each(['https://google.com/search?q=airport', 'https://chatgpt.com.evil.example/', '', 'invalid'])('does not infer AI visibility from %s', (referrer) => {
    expect(classifyAiReferral('https://www.stwmovers.com/', referrer)).toBeUndefined()
  })
})
