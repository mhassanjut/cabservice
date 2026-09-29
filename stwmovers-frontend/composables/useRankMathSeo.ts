import type { ParsedSeo } from '~/types/blog'

type RankMathMetaEntry =
  | { name: string; content: string }
  | { property: string; content: string }

type OgType =
  | 'article'
  | 'website'
  | 'book'
  | 'profile'
  | 'music.song'
  | 'music.album'
  | 'music.playlist'
  | 'music.radio_station'
  | 'video.movie'
  | 'video.episode'
  | 'video.tv_show'
  | 'video.other'
  | 'payment.link'

type TwitterCard = 'summary' | 'summary_large_image' | 'app' | 'player'

const OG_TYPES = new Set<OgType>([
  'article',
  'website',
  'book',
  'profile',
  'music.song',
  'music.album',
  'music.playlist',
  'music.radio_station',
  'video.movie',
  'video.episode',
  'video.tv_show',
  'video.other',
  'payment.link',
])

const TWITTER_CARDS = new Set<TwitterCard>(['summary', 'summary_large_image', 'app', 'player'])

function seoScalar(value: unknown): string | undefined {
  if (typeof value === 'string' && value.length > 0) return value
  if (Array.isArray(value)) {
    for (const item of value) {
      const s = seoScalar(item)
      if (s) return s
    }
  }
  return undefined
}

function metaEntries(
  bucket: Record<string, unknown> | undefined,
  kind: 'name' | 'property',
  prefix?: string,
  skipKeys: string[] = [],
): RankMathMetaEntry[] {
  if (!bucket) return []
  const out: RankMathMetaEntry[] = []
  for (const [key, value] of Object.entries(bucket)) {
    if (skipKeys.includes(key)) continue
    const content = seoScalar(value)
    if (!content) continue
    const tagName = prefix ? `${prefix}${key}` : key
    out.push(kind === 'name' ? { name: tagName, content } : { property: tagName, content })
  }
  return out
}

function ogTypeValue(value: unknown): OgType {
  const raw = seoScalar(value)
  return raw && OG_TYPES.has(raw as OgType) ? raw as OgType : 'article'
}

function twitterCardValue(value: unknown): TwitterCard {
  const raw = seoScalar(value)
  return raw && TWITTER_CARDS.has(raw as TwitterCard) ? raw as TwitterCard : 'summary_large_image'
}

/**
 * Applies Rank Math SEO (parsed by the BFF) during SSR via Unhead.
 */
export function useRankMathSeo(seo: MaybeRefOrGetter<ParsedSeo | null | undefined>) {
  const seoRef = computed(() => toValue(seo))

  const title = computed(() => seoRef.value?.title)
  const description = computed(() => seoScalar(seoRef.value?.meta?.description))
  const robots = computed(() => seoScalar(seoRef.value?.meta?.robots))
  const canonical = computed(() => seoRef.value?.canonical)

  const ogTitle = computed(() => seoScalar(seoRef.value?.og?.title) ?? title.value)
  const ogDescription = computed(() => seoScalar(seoRef.value?.og?.description) ?? description.value)
  const ogUrl = computed(() => seoScalar(seoRef.value?.og?.url) ?? canonical.value)
  const ogImage = computed(() => seoScalar(seoRef.value?.og?.image))
  const ogType = computed(() => ogTypeValue(seoRef.value?.og?.type))

  const twitterCard = computed(() => twitterCardValue(seoRef.value?.twitter?.card))
  const twitterTitle = computed(() => seoScalar(seoRef.value?.twitter?.title) ?? ogTitle.value)
  const twitterDescription = computed(
    () => seoScalar(seoRef.value?.twitter?.description) ?? ogDescription.value,
  )
  const twitterImage = computed(() => seoScalar(seoRef.value?.twitter?.image) ?? ogImage.value)

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    robots: () => robots.value,
    ogTitle: () => ogTitle.value,
    ogDescription: () => ogDescription.value,
    ogUrl: () => ogUrl.value,
    ogImage: () => ogImage.value,
    ogType: () => ogType.value,
    twitterCard: () => twitterCard.value,
    twitterTitle: () => twitterTitle.value,
    twitterDescription: () => twitterDescription.value,
    twitterImage: () => twitterImage.value,
  })

  useHead({
    titleTemplate: '%s',
    link: computed(() => (canonical.value ? [{ rel: 'canonical', href: canonical.value }] : [])),
    meta: computed(() => {
      const s = seoRef.value
      if (!s) return []
      return [
        ...metaEntries(s.meta, 'name', undefined, ['description', 'robots']),
        ...metaEntries(s.og, 'property', 'og:', [
          'title',
          'description',
          'url',
          'image',
          'type',
        ]),
        ...metaEntries(s.twitter, 'name', 'twitter:', [
          'card',
          'title',
          'description',
          'image',
        ]),
        ...metaEntries(s.article, 'property', 'article:'),
        ...metaEntries(s.properties, 'property'),
      ]
    }) as unknown as RankMathMetaEntry[],
    script: computed(() => {
      const schemas = seoRef.value?.schema
      if (!schemas?.length) return []
      return schemas.map((node: unknown, index: number) => ({
        key: `rank-math-ld-json-${index}`,
        type: 'application/ld+json',
        innerHTML: JSON.stringify(node),
      }))
    }),
  })
}
