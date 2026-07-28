/**
 * Fleet image manifest — maps backend car records to static assets in /public/img/vehicles/.
 * Images: real model-accurate photographs (Wikimedia Commons, CC BY-SA 4.0). See ATTRIBUTION.md.
 * Production paths use pre-optimized WebP; PNG masters remain alongside for re-export.
 */
export const fleetImageManifest = [
  {
    backendId: 'c0000001-0000-0000-0000-000000000001',
    backendName: 'Mercedes Vito Van',
    imagePath: '/img/vehicles/mercedes-vito-van.webp',
    verifiedModel: 'Mercedes-Benz Vito Tourer W447',
  },
  {
    backendId: 'c0000001-0000-0000-0000-000000000002',
    backendName: 'Mercedes V Class',
    imagePath: '/img/vehicles/mercedes-v-class.webp',
    verifiedModel: 'Mercedes-Benz V-Class (W447)',
  },
  {
    backendId: 'c0000001-0000-0000-0000-000000000003',
    backendName: 'Mercedes Van',
    imagePath: '/img/vehicles/mercedes-van-8-passenger.webp',
    verifiedModel: 'Mercedes-Benz Sprinter Tourer VS30 (8+ seats)',
  },
  {
    backendId: 'c0000001-0000-0000-0000-000000000004',
    backendName: 'Mercedes E Class',
    imagePath: '/img/vehicles/mercedes-e-class.webp',
    verifiedModel: 'Mercedes-Benz E-Class W213 (full side profile)',
  },
  {
    backendId: 'c0000001-0000-0000-0000-000000000005',
    backendName: 'Mercedes S Class',
    imagePath: '/img/vehicles/mercedes-s-class.webp',
    verifiedModel: 'Mercedes-Benz S-Class (W222)',
  },
  {
    backendId: 'c0000001-0000-0000-0000-000000000006',
    backendName: 'Tesla Model S',
    imagePath: '/img/vehicles/tesla-model-s.webp',
    verifiedModel: 'Tesla Model S',
  },
  {
    backendId: 'c0000001-0000-0000-0000-000000000007',
    backendName: 'Hyundai Ionic',
    imagePath: '/img/vehicles/hyundai-ioniq.webp',
    verifiedModel: 'Hyundai Ioniq Electric',
  },
  {
    backendId: 'c0000001-0000-0000-0000-000000000008',
    backendName: 'Toyota Corolla Familiar',
    imagePath: '/img/vehicles/toyota-corolla-familiar.webp',
    verifiedModel: 'Toyota Corolla Touring Sports (estate)',
  },
] as const

export type FleetImageManifestEntry = (typeof fleetImageManifest)[number]
