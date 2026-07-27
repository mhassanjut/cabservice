import { siteConfig } from '~/config/site'
import { seoDefaults, seoSections } from '~/config/seo'

export function useLocalBusinessSchema() {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://stwmovers.com').replace(/\/$/, '')

  const json = {
    '@context': 'https://schema.org',
    '@type': 'LimousineBusiness',
    name: seoDefaults.brandName,
    description: seoDefaults.defaultDescription,
    image: `${siteUrl}${seoDefaults.defaultOgImagePath}`,
    url: siteUrl,
    telephone: `+${siteConfig.whatsappNumber.replace(/\D/g, '')}`,
    email: siteConfig.contactEmail,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Passeig de Gràcia 21',
      addressLocality: 'Barcelona',
      postalCode: '08007',
      addressCountry: 'ES',
    },
    areaServed: [
      { '@type': 'City', name: 'Barcelona' },
      { '@type': 'City', name: 'Sitges' },
      { '@type': 'City', name: 'Girona' },
      { '@type': 'City', name: 'Tarragona' },
      { '@type': 'Country', name: 'Spain' },
    ],
    knowsAbout: seoSections.home.keywords,
    priceRange: '€€€',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
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
