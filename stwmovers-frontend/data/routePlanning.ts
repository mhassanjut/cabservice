export type RoutePlanning = {
  pickup: string
  destination: string
  timing: string
  vehicle: string
  checklist: string[]
  sources: Array<{ label: string; href: string }>
}

const airport = { label: 'Aena airport transport and private-hire information', href: 'https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/getting-there/vehicles-for-hire.html' }
const port = { label: 'Port de Barcelona passenger terminal directory', href: 'https://www.portdebarcelona.cat/en/business-and-services/cruise-ships/information-passenger/passenger-terminals' }
const fira = { label: 'Fira Barcelona venues and addresses', href: 'https://www.firabarcelona.com/en/venues/' }

export const routePlanning: Record<string, RoutePlanning> = {
  'barcelona-airport-to-city-centre-private-transfer': {
    pickup: 'Your confirmed BCN arrival terminal',
    destination: 'The exact Barcelona hotel or apartment address',
    timing: 'Allow for arrivals, baggage and road traffic before arranging a timed check-in or appointment.',
    vehicle: 'Confirm passenger and suitcase numbers together, including pushchairs or oversized bags.',
    checklist: ['Flight number and arrival terminal', 'Hotel name and full street address', 'Vehicle-accessible drop-off point', 'Waiting allowance and total price'],
    sources: [airport],
  },
  'barcelona-airport-to-eixample-private-transfer': {
    pickup: 'Your confirmed BCN arrival terminal',
    destination: 'Your Eixample hotel, apartment or office entrance',
    timing: 'Share any reception closing time, key collection appointment or meeting deadline.',
    vehicle: 'Include suitcases and pushchairs when comparing a sedan with a larger vehicle.',
    checklist: ['Flight number', 'Exact building entrance', 'Check-in or key collection time', 'Passengers, bags and child-seat requests'],
    sources: [airport],
  },
  'barcelona-airport-to-cruise-port-private-transfer': {
    pickup: 'Your confirmed BCN arrival terminal',
    destination: 'The passenger terminal assigned to your ship',
    timing: 'Work back from the cruise boarding deadline, allowing for arrivals, luggage collection and the road journey.',
    vehicle: 'Check the combination of cruise suitcases, passengers and any mobility equipment before booking.',
    checklist: ['Flight number and arrival time', 'Ship name and sailing date', 'Assigned terminal and boarding deadline', 'Passenger and luggage totals'],
    sources: [airport, port],
  },
  'barcelona-cruise-port-to-airport-private-transfer': {
    pickup: 'Your assigned cruise terminal after disembarkation',
    destination: 'The BCN terminal used by your departing airline',
    timing: 'Ship arrival is not the time you will be ready outside. Allow for disembarkation and baggage before airline check-in.',
    vehicle: 'Confirm luggage and seating together, and identify any child-seat or mobility requirements.',
    checklist: ['Ship and disembarkation date', 'Expected time outside the terminal', 'Airline, flight and check-in deadline', 'Contact number available after disembarkation'],
    sources: [port, airport],
  },
  'sitges-private-transfer': {
    pickup: 'Barcelona city, BCN Airport or the cruise terminal agreed in your booking',
    destination: 'Your Sitges hotel, villa or event address',
    timing: 'Include the wedding, event or accommodation arrival time. Confirm waiting if you also need the return journey.',
    vehicle: 'List all passengers, suitcases and event equipment; request a larger vehicle when needed.',
    checklist: ['Exact pickup and Sitges address', 'Airport flight details if applicable', 'Event or check-in deadline', 'Return date or waiting requirements'],
    sources: [airport],
  },
  'barcelona-to-salou-private-transfer': {
    pickup: 'The Barcelona or BCN Airport pickup confirmed for your trip',
    destination: 'Your Salou hotel, resort or PortAventura destination',
    timing: 'Confirm the specific resort entrance and arrival deadline; a hotel drop-off and attraction pickup may be different locations.',
    vehicle: 'Confirm child-seat requirements, pushchairs and suitcase space for the full group.',
    checklist: ['Hotel or attraction name and entrance', 'Flight details for airport arrivals', 'Children and requested seats', 'Return journey and any extra stops'],
    sources: [airport],
  },
  'barcelona-to-girona-private-transfer': {
    pickup: 'Your agreed Barcelona city or airport pickup',
    destination: 'Girona city, a hotel or station; specify Girona Airport separately',
    timing: 'If connecting to a train or flight, supply its departure time and the required check-in or station arrival time.',
    vehicle: 'Confirm seating and luggage space for the longer journey, including oversized items.',
    checklist: ['Exact Girona endpoint', 'Station or flight connection details', 'Passenger and luggage totals', 'Additional stops and return requirements'],
    sources: [airport],
  },
  'barcelona-airport-to-fira-private-transfer': {
    pickup: 'Your confirmed BCN arrival terminal',
    destination: 'Gran Via, Montjuic or CCIB as specified by your event',
    timing: 'Use the event agenda and entrance instructions to set your arrival deadline, and allow for registration.',
    vehicle: 'Include exhibition materials, suitcases and colleague numbers when requesting the vehicle.',
    checklist: ['Event and venue name', 'Gran Via: Av. Joan Carles I, 64', 'Montjuic: Av. Reina Maria Cristina, s/n', 'CCIB: Placa de Willy Brandt, 11-14'],
    sources: [airport, fira],
  },
}
