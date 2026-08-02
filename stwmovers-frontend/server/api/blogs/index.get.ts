export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = String(config.public.wordpressUrl || '').replace(/\/$/, '')
  const query = getQuery(event)

  // Do not pass `status` — unauthenticated WP REST rejects it; public default is publish-only.
  return await $fetch(`${base}/wp-json/wp/v2/posts`, {
    query: {
      per_page: query.per_page ?? 12,
      page: query.page ?? 1,
      _embed: true,
      ...(typeof query.slug === 'string' && query.slug ? { slug: query.slug } : {}),
    },
  })
})
