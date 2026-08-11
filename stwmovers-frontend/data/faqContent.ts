/**
 * Content for the FAQ page.
 * Q&A copy lives in `config/seo.ts` (seoSections.faq); presentation data lives here
 * so section components stay presentational.
 */

import { seoSections } from '~/config/seo'
import { routes } from '~/constants/routes'

export type FaqItem = {
  q: string
  a: string
}

export type FaqCategory = {
  id: string
  title: string
  items: readonly FaqItem[]
}

export const faqHero = {
  eyebrow: 'Help centre · Barcelona transfers',
  title: seoSections.faq.h1,
  body: seoSections.faq.lead,
  image: '/img/services/airport.png',
  pills: ['BCN airport', 'Fixed pricing', 'Meet & greet', 'Mercedes fleet'] as const,
  primaryCta: { label: 'Book a transfer', href: routes.journey },
} as const

export const faqCategories = seoSections.faq.categories as readonly FaqCategory[]

export const faqFinalCta = {
  eyebrow: 'Ready to travel?',
  heading: 'Still have questions about your Barcelona transfer?',
  body:
    'Our concierge desk confirms every trip on WhatsApp before payment — or start with an instant quote online.',
  image: '/img/services/cta.png',
  primary: { label: 'Get instant quote', href: routes.journey },
  secondary: { label: 'Contact our team', href: routes.contact },
} as const
