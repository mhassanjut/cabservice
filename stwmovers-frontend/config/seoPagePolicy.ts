/** Existing URLs stay accessible while shared service intent points to one preferred page. */
export const serviceCanonicalPaths: Record<string, string> = {
  '/airport-transfer': '/services/barcelona-airport-transfer',
  '/airport-transfer-barcelona': '/services/barcelona-airport-transfer',
  '/locations/barcelona-airport-chauffeur-service': '/services/barcelona-airport-transfer',
  '/private-driver-barcelona': '/services/private-driver-barcelona',
  '/cab-service-barcelona': '/services/cab-service-barcelona',
}

export function canonicalPathFor(path: string) {
  return serviceCanonicalPaths[path] || path
}

export function isPaidCampaignPath(path: string) {
  return path.startsWith('/landing/')
}
