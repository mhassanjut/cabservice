import { siteConfig } from '~/config/site'
import { contactPointSchema, primaryServiceItems, quoteActionSchema, siteAbsoluteUrl } from '~/utils/schema'

export function useLocalBusinessSchema() {
  const siteUrl = siteConfig.siteUrl
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`
  const localBusinessId = `${siteUrl}/#localbusiness`
  const digitalPartnerId = `${siteConfig.digitalPartner.url}/#organization`

  const json = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'STW Movers',
        legalName: 'STW Movers',
        url: `${siteUrl}/`,
        logo: `${siteUrl}/favicon-192.png`,
        image: `${siteUrl}/favicon-192.png`,
        description:
          'STW Movers is a Barcelona chauffeur, airport-transfer, and executive transportation service for private and corporate journeys.',
        slogan: 'Private Barcelona chauffeur transfers planned before pickup.',
        foundingLocation: {
          '@type': 'Place',
          name: 'Barcelona',
        },
        email: siteConfig.contactEmail,
        telephone: siteConfig.contactPhone,
        address: {
          '@type': 'PostalAddress',
          ...siteConfig.contactAddressPostal,
        },
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
        contactPoint: [contactPointSchema('customer service'), contactPointSchema('booking desk')],
        knowsAbout: [
          'Barcelona airport transfer',
          'Barcelona taxi alternative',
          'Barcelona cab alternative',
          'Private driver Barcelona',
          'Executive chauffeur Barcelona',
          'Barcelona cruise port transfer',
          'Hourly chauffeur service',
        ],
      },
      {
        '@type': 'Organization',
        '@id': digitalPartnerId,
        name: siteConfig.digitalPartner.name,
        url: siteConfig.digitalPartner.url,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${siteUrl}/`,
        name: 'STW Movers',
        publisher: {
          '@id': organizationId,
        },
        inLanguage: 'en',
        about: {
          '@id': localBusinessId,
        },
        creator: {
          '@id': digitalPartnerId,
        },
        creditText: siteConfig.digitalPartner.creditLine,
      },
      {
        '@type': 'LocalBusiness',
        '@id': localBusinessId,
        name: 'STW Movers',
        alternateName: ['STW Movers Barcelona', 'STW Movers Chauffeur Service'],
        url: `${siteUrl}/`,
        telephone: siteConfig.contactPhone,
        email: siteConfig.contactEmail,
        description:
          'Barcelona chauffeur service for airport transfers, private driver hire, and executive transport.',
        priceRange: '€€ - €€€',
        paymentAccepted: ['Credit Card', 'Debit Card'],
        currenciesAccepted: 'EUR',
        address: {
          '@type': 'PostalAddress',
          ...siteConfig.contactAddressPostal,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59',
          },
        ],
        parentOrganization: {
          '@id': organizationId,
        },
        areaServed: [
          {
            '@type': 'City',
            name: 'Barcelona',
          },
          {
            '@type': 'AdministrativeArea',
            name: 'Catalonia',
          },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Barcelona chauffeur and transfer services',
          itemListElement: primaryServiceItems.map((item) => ({
            '@type': 'Offer',
            url: siteAbsoluteUrl(item.path),
            itemOffered: {
              '@type': 'Service',
              name: item.name,
              description: item.description,
              provider: {
                '@id': localBusinessId,
              },
            },
          })),
        },
        potentialAction: quoteActionSchema(),
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
