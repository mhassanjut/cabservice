export function useJsonLdSchema(key: string, schema: Record<string, unknown>) {
  useHead({
    script: [
      {
        key: `ld-json-${key}`,
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
      },
    ],
  })
}
