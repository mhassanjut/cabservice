export function useServicePageSchema(schema: Record<string, unknown>, key: string) {
  useHead({
    script: [
      {
        key: `ld-json-service-${key}`,
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
      },
    ],
  })
}
