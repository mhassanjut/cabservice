export type BookingDraft = {
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string // YYYY-MM-DD
  pickupTime: string // HH:mm
}

export type Vehicle = {
  id: string
  name: string
  seats: number
  bags: number
  priceEur: number
  description: string
  imagePath: string
}

