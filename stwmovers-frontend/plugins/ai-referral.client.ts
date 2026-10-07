import { captureAiReferral } from '~/utils/aiReferral'

export default defineNuxtPlugin(() => {
  // Memory only: never retain query strings, trip details or personal data.
  captureAiReferral(window.location.href, document.referrer)
})
