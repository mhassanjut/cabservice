import type { CarsWithFareRequest, Paged, CarWithFare } from '~/types/api'
import { api } from '~/services/http/api'

export const ridesService = {
  carsWithFare(req: CarsWithFareRequest) {
    return api<Paged<CarWithFare>>('/api/v1/rides/cars', { method: 'POST', body: req, auth: false })
  },
}
