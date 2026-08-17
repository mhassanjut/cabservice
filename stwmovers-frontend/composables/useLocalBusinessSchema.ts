import { siteConfig } from '~/config/site'

export function useLocalBusinessSchema() {
  const siteRoot = siteConfig.siteUrl.replace(/\/$/, '')
  const orgId = `${siteRoot}/#organization`
  const websiteId = `${siteRoot}/#website`
  const localBusinessId = `${siteRoot}/#localbusiness`

  const json = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TravelAgency',
        '@id': orgId,
        name: 'STW Movers',
        legalName: 'STW Movers',
        url: `${siteRoot}/`,
        logo: `${siteRoot}/favicon-192.png`,
        image: `${siteRoot}/favicon-192.png`,
        description:
          'STW Movers is a premium airport transfer and chauffeur service company providing reliable private transportation, executive travel, and airport transfers across Barcelona, Girona, and Tarragona.',
        email: 'info@stwmovers.com',
        telephone: siteConfig.contactPhone,
        priceRange: '€€ - €€€',
        address: {
          '@type': 'PostalAddress',
          ...siteConfig.contactAddressPostal,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 41.37600189339869,
          longitude: 2.1581348619791694,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: '00:00',
            closes: '23:59',
          },
        ],
        areaServed: [
          {
            '@type': 'City',
            name: 'Barcelona',
          },
          {
            '@type': 'City',
            name: 'Girona',
          },
          {
            '@type': 'City',
            name: 'Tarragona',
          },
        ],
        availableLanguage: ['English', 'Spanish'],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: siteConfig.contactPhone,
          contactType: 'Customer Service',
          availableLanguage: ['English', 'Spanish'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${siteRoot}/`,
        name: 'STW Movers',
        publisher: {
          '@id': orgId,
        },
        inLanguage: ['en', 'es'],
      },
      {
        '@type': 'LocalBusiness',
        '@id': localBusinessId,
        name: 'STW Movers',
        url: `${siteRoot}/`,
        telephone: siteConfig.contactPhone,
        email: 'info@stwmovers.com',
        priceRange: '€€ - €€€',
        address: {
          '@type': 'PostalAddress',
          ...siteConfig.contactAddressPostal,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 41.37600189339869,
          longitude: 2.1581348619791694,
        },
        openingHours: 'Mo-Su 00:00-23:59',
      },
    ],
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
