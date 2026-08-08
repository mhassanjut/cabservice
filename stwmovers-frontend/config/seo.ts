import { siteConfig } from './site'

export const seoDefaults = {
  brandName: 'STW Movers',
  defaultTitle: 'Barcelona Airport Transfer & Executive Chauffeur Service',
  defaultDescription:
    'Private Barcelona airport transfers (BCN), executive chauffeur service, and city-to-city rides to Sitges, Girona and Tarragona. Fixed pricing, meet & greet, premium Mercedes fleet.',
  themeColor: '#0a0a0c',
  defaultOgImagePath: '/og-default.svg',
} as const

export const seoSections = {
  home: {
    primaryTopic: 'Barcelona airport transfer and executive chauffeur service',
    h1: 'Barcelona Airport Transfers & Executive Chauffeur Service',
    keywords: [
      'Barcelona airport transfer',
      'BCN airport chauffeur',
      'executive car service Barcelona',
      'private driver Barcelona',
      'Barcelona to Sitges transfer',
      'Barcelona to Girona chauffeur',
      'Barcelona to Tarragona transfer',
      'luxury Mercedes airport transfer',
      'meet and greet Barcelona airport',
      'city to city chauffeur Spain',
    ],
    serviceGroups: [
      'Barcelona El Prat (BCN) airport transfers',
      'Executive chauffeur & black car service',
      'City-to-city transfers across Catalonia',
    ],
    routes: [
      { name: 'Barcelona Airport (BCN)', slug: 'barcelona-airport-transfer', note: 'Door-to-door meet & greet' },
      { name: 'Barcelona to Sitges', slug: 'barcelona-sitges-transfer', note: 'Coastal executive transfer' },
      { name: 'Barcelona to Girona', slug: 'barcelona-girona-chauffeur', note: 'Costa Brava & business travel' },
      { name: 'Barcelona to Tarragona', slug: 'barcelona-tarragona-transfer', note: 'Costa Dorada chauffeur service' },
    ],
  },
  /**
   * Barcelona tours — keyword research (2026 competitive scan)
   *
   * SERP leaders: chauffeurbarcelona.com, barcelona-tour.com, chauffeurservicebarcelona.com,
   * barcelona-secrets.com, inoutbarcelonatours.com, Viator/GetYourGuide aggregators.
   *
   * High-intent clusters we target:
   * - Branded + service: private Barcelona tour, private tours Barcelona, Barcelona private tour with driver
   * - Chauffeur angle: private chauffeur tour Barcelona, luxury private tour Barcelona, tailor-made Barcelona tour
   * - Landmark: Sagrada Familia private tour, Park Güell private tour, Gothic Quarter private tour
   * - Day trips: Montserrat day trip from Barcelona, Girona day trip from Barcelona, Costa Brava private tour
   *
   * Gaps vs competitors: most pages push hourly tables or generic group tours. We differentiate on
   * fixed-scope luxury Mercedes fleet, same chauffeur desk as airport transfers, WhatsApp confirmation,
   * and fully custom pacing (no shared groups).
   */
  tours: {
    primaryTopic: 'Private Barcelona tours and chauffeur-driven sightseeing',
    pageTitle: 'Private Tours in Spain with Chauffeur',
    metaDescription:
      'Private chauffeur-driven tours across Spain — Montserrat, Barcelona highlights, Costa Brava and wine country. Premium Mercedes fleet, flexible itineraries, and hotel pickup on every experience.',
    h1: 'Discover Spain, One Journey At A Time.',
    lead:
      'Explore carefully curated private experiences with professional chauffeurs and premium vehicles. Every tour is designed to combine comfort, flexibility, and unforgettable destinations.',
    keywords: [
      'private Barcelona tour',
      'private tours Barcelona',
      'Barcelona private tour with driver',
      'private chauffeur tour Barcelona',
      'Barcelona sightseeing private tour',
      'luxury private tour Barcelona',
      'tailor-made Barcelona tour',
      'Sagrada Familia private tour',
      'Park Güell private tour',
      'Gothic Quarter private tour',
      'Montserrat day trip from Barcelona',
      'Girona day trip from Barcelona',
      'Costa Brava private tour from Barcelona',
      'Barcelona city tour private driver',
      'custom Barcelona itinerary chauffeur',
    ],
    experiences: [
      {
        icon: 'fa-landmark',
        title: 'Gaudí & Barcelona highlights',
        summary:
          'Private chauffeur tour of Sagrada Família, Park Güell, Passeig de Gràcia and the Gothic Quarter at your pace.',
        tags: ['Sagrada Família', 'Park Güell', 'Gothic Quarter'],
      },
      {
        icon: 'fa-mountain-sun',
        title: 'Montserrat day trip',
        summary:
          'Full-day private excursion from Barcelona to Montserrat monastery, mountain views and Catalan culture.',
        tags: ['Montserrat', 'Monastery', 'Half & full day'],
      },
      {
        icon: 'fa-water',
        title: 'Girona & Costa Brava',
        summary:
          'Medieval Girona, coastal Tossa de Mar and Costa Brava coves — one private vehicle, one itinerary.',
        tags: ['Girona', 'Costa Brava', 'Coastal villages'],
      },
      {
        icon: 'fa-champagne-glasses',
        title: 'VIP city experience',
        summary:
          'Luxury private Barcelona tour with skip-the-line coordination, fine dining stops and discreet chauffeur service.',
        tags: ['VIP', 'Skip-the-line', 'Evening tours'],
      },
      {
        icon: 'fa-briefcase',
        title: 'Corporate & event hosting',
        summary:
          'Executive sightseeing for delegations, congress guests and incentive groups with premium vans and sedans.',
        tags: ['Corporate', 'Groups', 'Multi-day'],
      },
      {
        icon: 'fa-route',
        title: 'Build-your-own route',
        summary:
          '100% custom Barcelona private tour — you set the stops, timing and pace; we provide the chauffeur and Mercedes.',
        tags: ['Custom', 'Flexible hours', 'Hotel pickup'],
      },
    ],
    faqs: [
      {
        q: 'Can I customize my itinerary?',
        a: 'Yes. Every tour can be adjusted to your pace, interests and schedule — our concierge team will tailor stops, timing and duration around what matters most to you.',
      },
      {
        q: 'Are entrance tickets included?',
        a: 'This varies by experience. Check the "Included" and "Not included" details for each tour, or ask our concierge team when you enquire — we can arrange skip-the-line tickets on request.',
      },
      {
        q: 'Can children join the tours?',
        a: 'Absolutely. Our vehicles are family-friendly and we can arrange child seats on request — just let us know the ages when you book.',
      },
      {
        q: 'Do you offer hotel pickup?',
        a: 'Yes. Every private tour includes complimentary pickup and drop-off at your hotel, villa or port of arrival within the tour region.',
      },
      {
        q: 'Can multiple destinations be combined?',
        a: 'Yes. Our concierge team can combine several destinations into a single custom itinerary spanning one or multiple days — just tell us what you would like to see.',
      },
      {
        q: 'What languages are available?',
        a: 'Our chauffeurs are English-speaking, with Spanish, French and other languages available on request — let us know your preference when enquiring.',
      },
    ],
  },
  faq: {
    pageTitle: 'Barcelona Airport Transfer & Chauffeur FAQ',
    metaDescription:
      'Answers about booking Barcelona airport transfers (BCN), fixed fares, meet & greet, Mercedes fleet, city-to-city routes to Sitges and Girona, luggage, flight delays and WhatsApp confirmation.',
    h1: 'Barcelona Transfer & Chauffeur FAQ',
    lead:
      'Practical answers about private Barcelona airport transfers, executive chauffeur service and fixed-price city-to-city rides — before you book.',
    categories: [
      {
        id: 'booking',
        title: 'Booking & pricing',
        items: [
          {
            q: 'How do I book a Barcelona airport transfer with STW Movers?',
            a: 'Enter your pickup and drop-off on our homepage, choose your Mercedes vehicle, and confirm details over WhatsApp before payment. You can book as a registered customer or continue as a guest with email verification.',
          },
          {
            q: 'Are your Barcelona transfer prices fixed?',
            a: 'Yes. Fares are calculated upfront from your route and vehicle choice — no meter running in traffic and no surprise surcharges for standard airport or city-to-city transfers.',
          },
          {
            q: 'How far in advance should I book a BCN airport transfer?',
            a: 'We recommend booking at least 24 hours ahead for guaranteed availability. Same-day executive dispatch is often possible — contact the concierge desk on WhatsApp for urgent arrivals or departures.',
          },
          {
            q: 'What payment methods do you accept?',
            a: 'Secure card payment is available at checkout after your trip details are confirmed. Corporate accounts and bespoke invoicing can be arranged through the concierge desk.',
          },
        ],
      },
      {
        id: 'airport',
        title: 'Barcelona airport (BCN)',
        items: [
          {
            q: 'Do you include meet and greet at Barcelona El Prat (BCN)?',
            a: 'Yes. For airport arrivals we offer meet & greet in the arrivals hall with your chauffeur holding a name board, plus flight tracking so we adjust pickup if your landing time changes.',
          },
          {
            q: 'What happens if my flight to Barcelona is delayed?',
            a: 'We monitor your flight number and adjust pickup accordingly at no extra charge for reasonable delays. Share your flight details when booking so dispatch can track your arrival in real time.',
          },
          {
            q: 'Can you pick up from Barcelona cruise port or the city centre?',
            a: 'Yes. We provide door-to-door private transfers from Barcelona cruise terminals, hotels, apartments and business addresses to BCN airport and across Catalonia.',
          },
          {
            q: 'How long does a Barcelona airport transfer to the city take?',
            a: 'Most BCN to central Barcelona journeys take 25–45 minutes depending on traffic, terminal and exact destination. Your quoted fare already reflects the route distance — not waiting time in normal airport pickup windows.',
          },
        ],
      },
      {
        id: 'fleet',
        title: 'Vehicles, luggage & passengers',
        items: [
          {
            q: 'Which vehicles do you use for Barcelona transfers?',
            a: 'Our fleet includes Mercedes E Class and S Class sedans, Mercedes V Class and Vito passenger vans, and larger Mercedes Sprinter options for groups — all operated by professional English-speaking chauffeurs.',
          },
          {
            q: 'How much luggage can I bring on an airport transfer?',
            a: 'Luggage capacity depends on the vehicle you select. Sedans suit 2–3 passengers with standard suitcases; vans accommodate larger groups and extra bags. Choose the vehicle that matches your party size and luggage on the fleet page.',
          },
          {
            q: 'Can you provide child seats for Barcelona airport transfers?',
            a: 'Child and infant seats are available on request. Add your requirements when booking or message the concierge desk before travel so the correct seat is fitted before pickup.',
          },
          {
            q: 'Are your vehicles private or shared?',
            a: 'Every booking is 100% private — your party travels alone with a dedicated chauffeur and vehicle. We do not operate shared shuttles or group minibus pools.',
          },
        ],
      },
      {
        id: 'routes',
        title: 'Routes & destinations',
        items: [
          {
            q: 'Do you offer Barcelona to Sitges private transfers?',
            a: 'Yes. Sitges is one of our most booked coastal routes — fixed-price executive transfers from Barcelona city, BCN airport or your hotel with direct door-to-door service.',
          },
          {
            q: 'Can I book a chauffeur from Barcelona to Girona or Tarragona?',
            a: 'Yes. We provide fixed-price city-to-city chauffeur service from Barcelona to Girona, the Costa Brava, Tarragona and the Costa Dorada — ideal for business travel and leisure trips.',
          },
          {
            q: 'Do you only operate within Barcelona?',
            a: 'Barcelona and BCN airport are our base, but we regularly serve destinations across Catalonia and Spain on pre-booked executive routes. Contact us for bespoke long-distance chauffeur hire.',
          },
        ],
      },
      {
        id: 'day-of',
        title: 'On the day & after booking',
        items: [
          {
            q: 'How does WhatsApp confirmation work?',
            a: 'After you submit your trip, our desk confirms pickup details, vehicle class and fare over WhatsApp before you pay. You receive driver contact and meeting instructions closer to your pickup time.',
          },
          {
            q: 'Can I change or cancel my Barcelona transfer booking?',
            a: 'Changes to pickup time, address or vehicle are handled by the concierge desk subject to availability. Cancellation terms depend on how close you are to the scheduled pickup — contact us as early as possible for flexibility.',
          },
          {
            q: 'Will my chauffeur speak English?',
            a: 'Yes. All STW Movers chauffeurs speak English and are experienced with international travellers, corporate guests and Barcelona airport procedures.',
          },
          {
            q: 'Where can I get help if I cannot find my driver?',
            a: `Use the driver contact shared before pickup, message us on WhatsApp, or call the concierge desk at ${siteConfig.contactPhoneDisplay}. For arrivals, your chauffeur waits in the agreed meeting point with a name board.`,
          },
        ],
      },
    ],
  },
} as const
