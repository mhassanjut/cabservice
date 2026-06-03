import { siteConfig } from '~/config/site'

export function useLocalBusinessSchema() {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://stwmovers.com').replace(/\/$/, '')

  const json = {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: 'STW Movers',
    image: `${siteUrl}/favicon.svg`,
    url: siteUrl,
    telephone: `+${siteConfig.whatsappNumber.replace(/\D/g, '')}`,
    email: 'concierge@stwmovers.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Passeig de Gràcia 21',
      addressLocality: 'Barcelona',
      postalCode: '08007',
      addressCountry: 'ES',
    },
    areaServed: ['Barcelona', 'Spain'],
    priceRange: '€€',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '06:00',
      closes: '23:00',
    },
  }

  useHead({
    script: [
      {
        key: 'ld-json-stwmovers',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(json),
      },
    ],
  })
}
