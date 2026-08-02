export function useLocalBusinessSchema() {
  const json = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TravelAgency',
        '@id': 'https://stwmovers.com/#organization',
        name: 'STW Movers',
        legalName: 'STW Movers',
        url: 'https://stwmovers.com/',
        logo: 'https://stwmovers.com/_nuxt/Logo.CAzUtKks.svg',
        image: 'https://stwmovers.com/_nuxt/Logo.CAzUtKks.svg',
        description:
          'STW Movers is a premium airport transfer and chauffeur service company providing reliable private transportation, executive travel, and airport transfers across Barcelona, Girona, and Tarragona.',
        email: 'info@stwmovers.com',
        telephone: '+34627408522',
        priceRange: '€€ - €€€',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Carrer Rocafort #20 bj 2',
          addressLocality: 'Barcelona',
          postalCode: '08015',
          addressCountry: 'ES',
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
          telephone: '+34627408522',
          contactType: 'Customer Service',
          availableLanguage: ['English', 'Spanish'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://stwmovers.com/#website',
        url: 'https://stwmovers.com/',
        name: 'STW Movers',
        publisher: {
          '@id': 'https://stwmovers.com/#organization',
        },
        inLanguage: ['en', 'es'],
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://stwmovers.com/#localbusiness',
        name: 'STW Movers',
        url: 'https://stwmovers.com/',
        telephone: '+34627408522',
        email: 'info@stwmovers.com',
        priceRange: '€€ - €€€',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Carrer Rocafort #20 bj 2',
          addressLocality: 'Barcelona',
          postalCode: '08015',
          addressCountry: 'ES',
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
