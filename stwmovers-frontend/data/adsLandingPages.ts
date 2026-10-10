import { siteConfig } from '~/config/site'

export type AdsLandingPage = {
  slug: string
  path: string
  eyebrow: string
  title: string
  description: string
  image: string
  audience: string
  primaryIntent: string
  proof: string[]
  benefits: Array<{
    title: string
    body: string
  }>
  comparison: Array<{
    factor: string
    stw: string
    alternative: string
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
  related: Array<{
    label: string
    href: string
  }>
}

export const adsLandingPages: Record<string, AdsLandingPage> = {
  'airport-transfer-barcelona': {
    slug: 'airport-transfer-barcelona',
    path: '/airport-transfer-barcelona',
    eyebrow: 'Barcelona airport transfer',
    title: 'Private Barcelona Airport Transfer, Planned Before You Land',
    description:
      'Book a premium BCN airport transfer with STW Movers. A private chauffeur alternative to airport taxi and cab searches, built for luggage, families, business guests, and direct hotel transfers.',
    image: '/img/services/airport.png',
    audience: 'Airport arrivals, departures, hotels, cruise port, and business travellers',
    primaryIntent: 'Airport taxi BCN, Barcelona airport transfer, private cab Barcelona airport',
    proof: ['BCN Terminal 1 and 2', 'Flight-aware timing', 'Private vehicle planning', 'WhatsApp support'],
    benefits: [
      {
        title: 'No airport queue guessing',
        body:
          'Send your flight, destination, passengers, and luggage before travel so the pickup and vehicle fit are planned in advance.',
      },
      {
        title: 'Luxury arrival experience',
        body:
          'A private chauffeur option for travellers who want a calmer handoff than a standard airport cab search.',
      },
      {
        title: 'Useful for real trips',
        body:
          'Airport to hotel, office, apartment, cruise port, Sitges, Costa Brava, or return transfer with sensible timing.',
      },
    ],
    comparison: [
      {
        factor: 'Best for',
        stw: 'Pre-booked arrivals, luggage, families, business guests, and direct hotel or cruise transfers.',
        alternative: 'Simple on-demand airport taxi or cab rides when waiting is acceptable.',
      },
      {
        factor: 'Planning',
        stw: 'Flight, passengers, luggage, and destination reviewed before pickup.',
        alternative: 'Usually decided after landing at the airport taxi queue.',
      },
      {
        factor: 'Experience',
        stw: 'Private vehicle, direct support, and premium arrival feel.',
        alternative: 'Standard cab experience that can vary by vehicle and queue.',
      },
    ],
    faqs: [
      {
        question: 'Can I book a private airport transfer instead of a taxi?',
        answer:
          'Yes. STW Movers is a pre-booked private chauffeur and transfer service for travellers who want a premium airport taxi alternative.',
      },
      {
        question: 'What details do you need for a quote?',
        answer:
          'Send flight number, date, pickup time, destination, passengers, luggage, and any child-seat or extra-stop requests.',
      },
    ],
    related: [
      { label: 'Airport transfer service page', href: '/services/barcelona-airport-transfer' },
      { label: 'Airport transfer cost guide', href: '/answers/barcelona-airport-transfer-cost' },
      { label: 'Airport transfer vs taxi article', href: '/blogs/barcelona-airport-transfer-vs-taxi' },
    ],
  },
  'private-driver-barcelona': {
    slug: 'private-driver-barcelona',
    path: '/private-driver-barcelona',
    eyebrow: 'Private driver Barcelona',
    title: 'Private Driver in Barcelona for Calm, Flexible City Travel',
    description:
      'Hire a private driver in Barcelona for airport arrivals, dinners, shopping, meetings, events, and hourly chauffeur service. A premium alternative to taxi and cab searches.',
    image: '/img/services/hero.png',
    audience: 'Travellers who need point-to-point, hourly, or multi-stop movement',
    primaryIntent: 'Private driver Barcelona, private cab Barcelona, taxi alternative Barcelona',
    proof: ['Hourly availability', 'Multi-stop planning', 'Executive vehicles', 'Barcelona local support'],
    benefits: [
      {
        title: 'One driver for the whole plan',
        body:
          'Use hourly service when the car should wait between restaurants, shops, meetings, or sightseeing stops.',
      },
      {
        title: 'Built around your itinerary',
        body:
          'Share pickup, destination, route needs, passengers, and luggage so the quote matches the real journey.',
      },
      {
        title: 'Premium taxi alternative',
        body:
          'For travellers searching cab or taxi but wanting a more private, polished, and pre-arranged experience.',
      },
    ],
    comparison: [
      {
        factor: 'Best for',
        stw: 'Multi-stop days, dinner transfers, shopping, guests, and flexible city plans.',
        alternative: 'Short spontaneous taxi or cab rides with no waiting time.',
      },
      {
        factor: 'Booking',
        stw: 'Pre-booked quote based on itinerary, vehicle fit, and time.',
        alternative: 'On-demand ride chosen at the moment of travel.',
      },
      {
        factor: 'Control',
        stw: 'Clear timing, support, and the option to keep the chauffeur available.',
        alternative: 'Each ride depends on local availability and queue/app timing.',
      },
    ],
    faqs: [
      {
        question: 'Can a private driver wait between stops?',
        answer:
          'Yes. Waiting and multi-stop travel can be quoted as hourly chauffeur service.',
      },
      {
        question: 'Is this different from booking a taxi?',
        answer:
          'Yes. STW Movers is pre-booked and planned around your itinerary, vehicle needs, timing, and support before travel.',
      },
    ],
    related: [
      { label: 'Private driver service page', href: '/services/private-driver-barcelona' },
      { label: 'Hourly chauffeur service', href: '/services/hourly-chauffeur-barcelona' },
      { label: 'Private driver cost guide', href: '/blogs/private-driver-barcelona-cost-booking-use-cases' },
    ],
  },
  'barcelona-taxi-alternative': {
    slug: 'barcelona-taxi-alternative',
    path: '/barcelona-taxi-alternative',
    eyebrow: 'Barcelona taxi alternative',
    title: 'A Premium Barcelona Taxi Alternative for Planned Private Travel',
    description:
      'Searching for a Barcelona taxi or cab but want something more private? STW Movers offers pre-booked chauffeur transfers for airport, business, family, and event travel.',
    image: '/img/services/business.png',
    audience: 'Visitors comparing taxi, cab, private driver, and chauffeur options',
    primaryIntent: 'Barcelona taxi alternative, private taxi Barcelona, private cab Barcelona',
    proof: ['Pre-booked trips', 'Premium presentation', 'Airport and port routes', 'Direct quote support'],
    benefits: [
      {
        title: 'Same clear goal, better planning',
        body:
          'People search taxi or cab because they need a ride. STW Movers adds route review, vehicle fit, and chauffeur-level presentation.',
      },
      {
        title: 'Stronger for high-value trips',
        body:
          'Airport arrivals, executive guests, cruise transfers, family travel, and event schedules benefit from planning before pickup.',
      },
      {
        title: 'Easy quote path',
        body:
          'Send trip details once and get guidance toward the right private transfer or hourly chauffeur option.',
      },
    ],
    comparison: [
      {
        factor: 'Best for',
        stw: 'Planned airport, hotel, cruise port, business, family, and event transfers.',
        alternative: 'Simple city taxi rides when immediate availability matters most.',
      },
      {
        factor: 'Vehicle fit',
        stw: 'Quoted around passengers, luggage, route, and requested vehicle style.',
        alternative: 'Vehicle depends on what is available at the queue or app.',
      },
      {
        factor: 'Support',
        stw: 'Quote form, WhatsApp, phone, and pre-trip coordination.',
        alternative: 'Mostly handled at the moment of ride.',
      },
    ],
    faqs: [
      {
        question: 'Is STW Movers a private taxi company?',
        answer:
          'STW Movers is a pre-booked private chauffeur and transfer service. It can serve travellers who search for taxi or cab but want a premium planned option.',
      },
      {
        question: 'Can I use this for airport and cruise port transfers?',
        answer:
          'Yes. Airport and cruise port routes are strong use cases for private chauffeur transfers.',
      },
    ],
    related: [
      { label: 'Private driver vs taxi', href: '/answers/private-driver-vs-taxi-barcelona' },
      { label: 'Barcelona cab vs chauffeur', href: '/blogs/barcelona-cab-vs-chauffeur-business-travel' },
      { label: 'Services overview', href: '/services' },
    ],
  },
  'cab-service-barcelona': {
    slug: 'cab-service-barcelona',
    path: '/cab-service-barcelona',
    eyebrow: 'Cab service Barcelona',
    title: 'Private Cab Service in Barcelona for Airport and City Journeys',
    description:
      'STW Movers is a private chauffeur and transfer option for travellers searching cab service Barcelona, airport cab, private cab, or premium taxi alternative.',
    image: '/img/services/hourly.png',
    audience: 'Airport arrivals, hotel pickups, business trips, and local transfers in Barcelona',
    primaryIntent: 'Cab service Barcelona, airport cab BCN, private cab Barcelona',
    proof: ['Private quote', 'Passenger and luggage planning', 'Door-to-door routes', 'Luxury transfer feel'],
    benefits: [
      {
        title: 'Cab convenience, chauffeur standards',
        body:
          'Arrange a private vehicle for airport, hotel, business, or city travel, with trip details planned before pickup.',
      },
      {
        title: 'Better for groups and luggage',
        body:
          'Share passenger and luggage count before the trip so the vehicle can be matched to the journey.',
      },
      {
        title: 'Straightforward ways to book',
        body:
          'Compare vehicle options online, or contact the team by phone or WhatsApp if you need help planning your trip.',
      },
    ],
    comparison: [
      {
        factor: 'Best for',
        stw: 'Airport cab alternatives, private hotel transfers, events, business guests, and hourly needs.',
        alternative: 'Short, spontaneous rides where vehicle type and timing are less important.',
      },
      {
        factor: 'Quote',
        stw: 'Route, timing, passengers, luggage, and vehicle fit reviewed in advance.',
        alternative: 'Price and vehicle depend on local cab availability and route rules.',
      },
      {
        factor: 'Feel',
        stw: 'Premium private transfer with direct support.',
        alternative: 'Standard cab ride experience.',
      },
    ],
    faqs: [
      {
        question: 'Can I book STW Movers like a cab?',
        answer:
          'You can request a fast private quote by form, phone, or WhatsApp, but the service is pre-booked rather than street-hailed.',
      },
      {
        question: 'Can I book a street-hail taxi through STW Movers?',
        answer:
          'No. STW Movers provides pre-booked private transfers and chauffeur journeys rather than street-hail taxi rides.',
      },
    ],
    related: [
      { label: 'Private driver Barcelona', href: '/services/private-driver-barcelona' },
      { label: 'Airport cab alternative', href: '/airport-transfer-barcelona' },
      { label: 'Hourly chauffeur guide', href: '/blogs/hourly-chauffeur-barcelona-when-it-makes-sense' },
    ],
  },
  'airport-taxi-barcelona': {
    slug: 'airport-taxi-barcelona',
    path: '/landing/airport-taxi-barcelona',
    eyebrow: 'Airport taxi Barcelona',
    title: 'Barcelona Airport Taxi Alternative with a Private Chauffeur',
    description:
      'Arrange a private BCN airport transfer with your pickup time and destination planned before travel. Compare available vehicles and prices for your journey.',
    image: '/img/services/airport.png',
    audience: 'BCN airport arrivals, hotel transfers, cruise-port connections, and departures',
    primaryIntent: 'airport taxi Barcelona, BCN airport taxi, airport cab Barcelona',
    proof: ['BCN Terminal 1 and 2', 'Flight-aware quote', 'Luggage planning', 'Fast WhatsApp support'],
    benefits: [
      {
        title: 'Plan your airport pickup ahead',
        body:
          'Share your route and travel time in advance, then compare available vehicles and prices for the transfer.',
      },
      {
        title: 'Quote before arrival',
        body:
          'Flight number, destination, passengers, and luggage can be reviewed before pickup instead of after landing.',
      },
      {
        title: 'Better for premium trips',
        body:
          'Families, executives, cruise guests, and luggage-heavy arrivals benefit from a private transfer plan.',
      },
    ],
    comparison: [
      {
        factor: 'Planning',
        stw: 'A private airport transfer planned before the flight arrives.',
        alternative: 'An on-demand taxi arranged after arrival.',
      },
      {
        factor: 'Best fit',
        stw: 'Luggage, families, business guests, cruise port links, and hotel arrivals.',
        alternative: 'Simple airport-to-city rides when waiting and vehicle variation are acceptable.',
      },
      {
        factor: 'Booking',
        stw: 'Enter trip details online or contact the team for assistance.',
        alternative: 'Arrange a ride on arrival, subject to local availability.',
      },
    ],
    faqs: [
      {
        question: 'Is this an official airport taxi page?',
        answer:
          'No. STW Movers is a pre-booked private chauffeur and transfer service for travellers comparing airport taxi, cab, and private transfer options.',
      },
      {
        question: 'Can I request the quote before my flight?',
        answer:
          'Yes. Send flight number, destination, date, passengers, luggage, and any child-seat or extra-stop needs.',
      },
    ],
    related: [
      { label: 'Airport taxi alternative service', href: '/services/barcelona-airport-taxi-alternative' },
      { label: 'Airport taxi cost answer', href: '/answers/barcelona-airport-taxi-cost-2026' },
      { label: 'Airport taxi guide', href: '/blogs/airport-taxi-barcelona-private-transfer-guide' },
    ],
  },
  'cab-barcelona': {
    slug: 'cab-barcelona',
    path: '/landing/cab-barcelona',
    eyebrow: 'Cab Barcelona',
    title: 'Private Cab in Barcelona for Airport, Hotel, and City Travel',
    description:
      'A dedicated cab Barcelona landing page for travellers who want a fast ride but prefer a premium private driver, luggage planning, and direct support.',
    image: '/img/services/hourly.png',
    audience: 'Travellers arranging airport pickups, hotel journeys, business trips, and city transfers',
    primaryIntent: 'cab Barcelona, cab service Barcelona, private cab Barcelona',
    proof: ['Private quote path', 'Premium cab alternative', 'Airport and city routes', 'Phone and WhatsApp actions'],
    benefits: [
      {
        title: 'Private travel, arranged in advance',
        body:
          'Choose a pre-booked private vehicle for trips where timing, pickup details, or direct assistance matter.',
      },
      {
        title: 'Choose how to arrange your trip',
        body:
          'Enter your journey details online, or contact the team by phone or WhatsApp for help before booking.',
      },
      {
        title: 'Strong for higher-value rides',
        body:
          'Airport, hotel, executive, event, family, and cruise port journeys get a more controlled experience than a standard cab.',
      },
    ],
    comparison: [
      {
        factor: 'Best for',
        stw: 'Planned private rides where timing, luggage, or presentation matters.',
        alternative: 'Short city rides with immediate availability.',
      },
      {
        factor: 'Vehicle fit',
        stw: 'Discussed before pickup with passengers and luggage included.',
        alternative: 'Depends on what is available at the time.',
      },
      {
        factor: 'Support',
        stw: 'Quote form, phone, WhatsApp, and pre-trip coordination.',
        alternative: 'Mostly handled during the ride request.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers replace a cab for important trips?',
        answer:
          'STW Movers offers pre-booked private chauffeur journeys for travellers who prefer to arrange their trip in advance.',
      },
      {
        question: 'What should I send for a cab-style private quote?',
        answer:
          'Send pickup, destination, date, time, passenger count, luggage count, and airport or cruise details if relevant.',
      },
    ],
    related: [
      { label: 'Cab service Barcelona', href: '/services/cab-service-barcelona' },
      { label: 'Cab vs chauffeur guide', href: '/blogs/cab-service-barcelona-private-chauffeur-guide' },
      { label: 'Cab service vs chauffeur answer', href: '/answers/barcelona-cab-service-vs-chauffeur' },
    ],
  },
  'private-transfer-barcelona': {
    slug: 'private-transfer-barcelona',
    path: '/landing/private-transfer-barcelona',
    eyebrow: 'Private transfer Barcelona',
    title: 'Private Transfer Barcelona for Airport, Port, Hotel, and City Routes',
    description:
      'Book a private Barcelona transfer with chauffeur-level planning for airport arrivals, cruise port trips, hotels, families, business guests, and city-to-city routes.',
    image: '/img/contact/destination-sunset.png',
    audience: 'Airport and cruise-port arrivals, hotel guests, families, and business travellers',
    primaryIntent: 'private transfer Barcelona, Barcelona transfer service, private airport transfer Barcelona',
    proof: ['Airport and port routes', 'City-to-city options', 'Family and business fit', 'Private quote pricing'],
    benefits: [
      {
        title: 'Airport, port, and city-to-city journeys',
        body:
          'Plan a direct transfer between Barcelona Airport, the cruise port, hotels, and destinations beyond the city.',
      },
      {
        title: 'Planned before pickup',
        body:
          'Route, passengers, luggage, date, time, and flight or cruise details shape the quote before travel.',
      },
      {
        title: 'Plan around your travel needs',
        body:
          'Share your route, timing, and passenger count so you can review suitable vehicle options before booking.',
      },
    ],
    comparison: [
      {
        factor: 'Best for',
        stw: 'Airport, port, hotel, business, family, and longer transfer routes.',
        alternative: 'Simple short rides where planning is not important.',
      },
      {
        factor: 'Route scope',
        stw: 'Barcelona plus Sitges, Costa Brava, Girona, Tarragona, Salou, and custom routes.',
        alternative: 'Usually local city trips or meter-based taxi journeys.',
      },
      {
        factor: 'Booking style',
        stw: 'Private quote based on the real journey.',
        alternative: 'On-demand ride or public transport decision.',
      },
    ],
    faqs: [
      {
        question: 'Can private transfers go beyond Barcelona city?',
        answer:
          'Yes. STW Movers can quote city-to-city transfers from Barcelona to nearby destinations when route details are provided.',
      },
      {
        question: 'Can I book an airport or cruise-port transfer?',
        answer:
          'Yes. STW Movers offers pre-booked transfers for airport, cruise-port, hotel, business, and onward journeys.',
      },
    ],
    related: [
      { label: 'Private transfer guide', href: '/blogs/private-transfer-barcelona-airport-port-hotels' },
      { label: 'City-to-city transfers', href: '/services/city-to-city-transfers-barcelona' },
      { label: 'Airport to cruise port', href: '/locations/barcelona-airport-to-cruise-port-private-transfer' },
    ],
  },
  'taxi-van-barcelona': {
    slug: 'taxi-van-barcelona',
    path: '/landing/taxi-van-barcelona',
    eyebrow: 'Taxi van Barcelona',
    title: 'Private Van Transfer in Barcelona for Groups and Luggage',
    description:
      'A dedicated landing page for groups, families, cruise guests, and luggage-heavy airport arrivals comparing taxi van Barcelona and private van transfer options.',
    image: '/img/home/fleet-section/mercedes-v-class.webp',
    audience: 'Families, groups, and travellers carrying extra luggage around Barcelona',
    primaryIntent: 'taxi van Barcelona, airport van transfer Barcelona, 7 seat taxi Barcelona',
    proof: ['Group and luggage fit', 'Airport and cruise routes', 'Family transfers', 'Private vehicle planning'],
    benefits: [
      {
        title: 'Built for capacity questions',
        body:
          'Share the number of passengers when comparing vehicles. Contact the team to confirm suitcase, stroller, and bulky-item space.',
      },
      {
        title: 'Better than splitting vehicles',
        body:
          'One planned transfer can be simpler than dividing people and bags between separate taxis.',
      },
      {
        title: 'Quick trip details on mobile',
        body:
          'Enter your route, travel time, and passenger count from your phone to compare available vehicle options.',
      },
    ],
    comparison: [
      {
        factor: 'Best for',
        stw: 'Families, groups, cruise guests, airport arrivals, and bulky luggage.',
        alternative: 'Small groups with light luggage or short spontaneous rides.',
      },
      {
        factor: 'Planning',
        stw: 'Passenger and suitcase counts reviewed before quote.',
        alternative: 'Vehicle capacity discovered when the taxi arrives.',
      },
      {
        factor: 'Experience',
        stw: 'Group stays together in a private transfer when suitable vehicle is available.',
        alternative: 'Group may split across multiple cabs.',
      },
    ],
    faqs: [
      {
        question: 'Can I request a larger vehicle for airport pickup?',
        answer:
          'Yes. Include passengers, suitcases, strollers, and bulky items so the team can review the right vehicle option.',
      },
      {
        question: 'Is this a taxi van or chauffeur van page?',
        answer:
          'STW Movers offers pre-booked private van transfers with a chauffeur, rather than an on-demand street taxi.',
      },
    ],
    related: [
      { label: 'Barcelona van transfer', href: '/services/barcelona-van-transfer' },
      { label: 'Taxi van guide', href: '/blogs/taxi-van-barcelona-groups-luggage-airport' },
      { label: 'Family airport transfer', href: '/services/family-airport-transfer-barcelona' },
    ],
  },
  'chauffeur-barcelona': {
    slug: 'chauffeur-barcelona',
    path: '/landing/chauffeur-barcelona',
    eyebrow: 'Chauffeur Barcelona',
    title: 'Chauffeur Barcelona for Airport, Business, Events, and Private Travel',
    description:
      'Book a private chauffeur in Barcelona for airport pickups, executive travel, hourly driver service, and private transfers.',
    image: '/img/services/business.png',
    audience: 'Business travellers, event guests, private hosts, and visitors arranging airport pickups',
    primaryIntent: 'chauffeur Barcelona, executive chauffeur Barcelona, private chauffeur Barcelona',
    proof: ['Executive presentation', 'Airport and hotel routes', 'Hourly availability', 'Luxury private transfer feel'],
    benefits: [
      {
        title: 'Premium from the first screen',
        body:
          'The copy and page flow signal luxury, discretion, timing, and a more polished arrival than generic transport pages.',
      },
      {
        title: 'For business and special occasions',
        body:
          'Arrange a chauffeur for airport arrivals, Fira events, meetings, hosted guests, dinners, and multi-stop days.',
      },
      {
        title: 'Share the details that matter',
        body:
          'Enter your route, travel time, and passenger count online. Contact the team to discuss luggage or vehicle requirements.',
      },
    ],
    comparison: [
      {
        factor: 'Best for',
        stw: 'Luxury airport, business, event, hourly, and guest transport.',
        alternative: 'Basic point-to-point taxi or cab rides.',
      },
      {
        factor: 'Presentation',
        stw: 'Private chauffeur experience planned around guest expectations.',
        alternative: 'Standard transport experience with less pre-trip context.',
      },
      {
        factor: 'Flexibility',
        stw: 'Can support direct transfers or hourly multi-stop plans.',
        alternative: 'Usually one ride at a time.',
      },
    ],
    faqs: [
      {
        question: 'Can chauffeur service include airport pickup?',
        answer:
          'Yes. Chauffeur service can start at Barcelona Airport and continue to a hotel, meeting, dinner, or hourly itinerary.',
      },
      {
        question: 'Who is this page best for?',
        answer:
          'Executives, hosts, families, VIP guests, event visitors, and travellers who care about comfort, timing, and arrival presentation.',
      },
    ],
    related: [
      { label: 'Chauffeur Barcelona guide', href: '/blogs/chauffeur-barcelona-luxury-airport-business-guide' },
      { label: 'Executive chauffeur service', href: '/services/executive-chauffeur-barcelona' },
      { label: 'Hourly chauffeur service', href: '/services/hourly-chauffeur-barcelona' },
    ],
  },
}

export const adsLandingRoutes = Object.values(adsLandingPages).map((page) => page.path)

export function findAdsLandingPage(slug: string) {
  return adsLandingPages[slug]
}

export function adsLandingPageSchema(page: AdsLandingPage, siteUrl: string) {
  const absolute = (path: string) => `${siteUrl.replace(/\/$/, '')}${path}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${absolute(page.path)}#webpage`,
        url: absolute(page.path),
        name: page.title,
        description: page.description,
        inLanguage: 'en',
        mainEntity: {
          '@id': `${absolute(page.path)}#service`,
        },
      },
      {
        '@type': 'Service',
        '@id': `${absolute(page.path)}#service`,
        name: page.title,
        description: page.description,
        serviceType: 'Private chauffeur and transfer service',
        provider: {
          '@type': 'LocalBusiness',
          '@id': `${siteUrl}/#localbusiness`,
          name: 'STW Movers',
          url: siteUrl,
          telephone: siteConfig.contactPhone,
          email: siteConfig.contactEmail,
          address: {
            '@type': 'PostalAddress',
            ...siteConfig.contactAddressPostal,
          },
        },
        areaServed: {
          '@type': 'City',
          name: 'Barcelona',
          addressCountry: 'ES',
        },
        potentialAction: {
          '@type': 'ViewAction',
          target: absolute(`${page.path}#ads-booking`),
          name: 'Compare available vehicles and prices',
        },
      },
      {
        '@type': 'HowTo',
        '@id': `${absolute(page.path)}#quote-process`,
        name: `How to compare vehicles for ${page.eyebrow}`,
        description: `Steps to view available private transfer vehicles and prices for ${page.title}.`,
        totalTime: 'PT2M',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Choose pickup and destination',
            text: 'Share the pickup point and drop-off destination for the Barcelona journey.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Add timing and passenger details',
            text: 'Choose the travel date, pickup time, and passenger count to help compare suitable vehicle options.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'View vehicle options and prices',
            text: 'Review available vehicles and prices, then continue through the booking steps. Contact STW Movers for help with additional requirements.',
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${absolute(page.path)}#trust-signals`,
        name: `${page.eyebrow} trust signals`,
        itemListElement: page.proof.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item,
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${absolute(page.path)}#comparison`,
        name: `${page.eyebrow} comparison points`,
        itemListElement: page.comparison.map((row, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: row.factor,
          description: `${row.stw} Compared with taxi or cab: ${row.alternative}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: absolute('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.title,
            item: absolute(page.path),
          },
        ],
      },
    ],
  }
}
