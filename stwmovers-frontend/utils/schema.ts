import { siteConfig } from '~/config/site'
import { seoDefaults } from '~/config/seo'

export type SchemaNode = Record<string, unknown>
export type SchemaFaq = {
  question: string
  answer: string
}

export function siteAbsoluteUrl(path = '/') {
  return `${siteConfig.siteUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

export function schemaGraph(nodes: SchemaNode[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}

export function organizationRef() {
  return { '@id': `${siteConfig.siteUrl}/#organization` }
}

export function websiteRef() {
  return { '@id': `${siteConfig.siteUrl}/#website` }
}

export function localBusinessRef() {
  return { '@id': `${siteConfig.siteUrl}/#localbusiness` }
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: siteAbsoluteUrl(item.path),
    })),
  }
}

export function faqPageSchema(name: string, faqs: SchemaFaq[]) {
  return {
    '@type': 'FAQPage',
    name,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function webPageSchema(input: {
  id: string
  path: string
  name: string
  description: string
  type?: string
  about?: string[]
}) {
  return {
    '@type': input.type || 'WebPage',
    '@id': `${siteAbsoluteUrl(input.path)}#${input.id}`,
    url: siteAbsoluteUrl(input.path),
    name: input.name,
    description: input.description,
    inLanguage: 'en',
    isPartOf: websiteRef(),
    publisher: organizationRef(),
    about: input.about,
  }
}

export function quoteActionSchema() {
  return {
    '@type': 'ReserveAction',
    name: 'Request a private chauffeur quote',
    target: siteAbsoluteUrl('/journey#book-journey'),
    result: {
      '@type': 'Reservation',
      name: 'Private chauffeur transfer quote request',
    },
  }
}

export function chauffeurServiceSchema(input: {
  id: string
  path: string
  name: string
  description: string
  serviceType?: string
}) {
  return {
    '@type': 'Service',
    '@id': `${siteAbsoluteUrl(input.path)}#${input.id}`,
    name: input.name,
    alternateName: ['Barcelona taxi alternative', 'Barcelona cab alternative', 'Private driver Barcelona'],
    description: input.description,
    serviceType: input.serviceType || 'Private chauffeur and transfer service',
    url: siteAbsoluteUrl(input.path),
    provider: localBusinessRef(),
    areaServed: [
      { '@type': 'City', name: 'Barcelona', addressCountry: 'ES' },
      { '@type': 'Place', name: 'Barcelona-El Prat Airport' },
      { '@type': 'Place', name: 'Barcelona Cruise Port' },
      { '@type': 'AdministrativeArea', name: 'Catalonia', addressCountry: 'ES' },
    ],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: siteAbsoluteUrl('/journey#book-journey'),
      description:
        'Private quote based on pickup, destination, date, time, passengers, luggage, vehicle fit, flight details, waiting time, and route needs.',
    },
    potentialAction: quoteActionSchema(),
  }
}

export function serviceItemListSchema(
  items: Array<{ name: string; path: string; description: string }>,
  name = 'STW Movers priority chauffeur services',
) {
  return {
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: siteAbsoluteUrl(item.path),
      name: item.name,
      description: item.description,
    })),
  }
}

export const primaryServiceItems = [
  {
    name: 'Barcelona Airport Transfer',
    path: '/services/barcelona-airport-transfer',
    description: 'Private BCN airport transfer for arrivals, departures, hotels, cruise port links, and luggage travel.',
  },
  {
    name: 'Private Driver Barcelona',
    path: '/services/private-driver-barcelona',
    description: 'Private driver and hourly chauffeur support for city trips, meetings, dinners, shopping, and guests.',
  },
  {
    name: 'Executive Chauffeur Barcelona',
    path: '/services/executive-chauffeur-barcelona',
    description: 'Chauffeur service for business travel, Fira Barcelona, meetings, corporate hosting, and events.',
  },
  {
    name: 'Barcelona Cruise Port Transfer',
    path: '/services/barcelona-cruise-port-transfer',
    description: 'Private cruise terminal transfers with luggage-aware planning to airport, hotels, and onward routes.',
  },
] as const

export function contactPointSchema(contactType = 'customer service') {
  return {
    '@type': 'ContactPoint',
    telephone: siteConfig.contactPhone,
    email: siteConfig.contactEmail,
    contactType,
    areaServed: 'ES',
    availableLanguage: ['English', 'Spanish'],
  }
}

export function brandMentionSchema() {
  return {
    '@type': 'Thing',
    name: seoDefaults.brandName,
    sameAs: siteConfig.siteUrl,
  }
}
