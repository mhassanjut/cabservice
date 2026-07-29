import type { WpPost } from '~/types/wordpress'

/**
 * Fetch published posts via the Nuxt server proxy (avoids WordPress CORS).
 */
export function useWpPosts(options?: { perPage?: number; page?: number }) {
  const perPage = options?.perPage ?? 12
  const page = options?.page ?? 1

  return useAsyncData(
    `wp-posts-${page}-${perPage}`,
    () =>
      $fetch<WpPost[]>('/api/blogs', {
        query: {
          per_page: perPage,
          page,
        },
      }),
    { default: () => [] as WpPost[] },
  )
}

/**
 * Fetch a single published post by slug via the Nuxt server proxy.
 */
export function useWpPostBySlug(slug: MaybeRefOrGetter<string>) {
  const slugRef = computed(() => toValue(slug))

  return useAsyncData(
    () => `wp-post-${slugRef.value}`,
    () =>
      $fetch<WpPost[]>('/api/blogs', {
        query: {
          slug: slugRef.value,
          per_page: 1,
        },
      }),
    {
      default: () => [] as WpPost[],
      watch: [slugRef],
    },
  )
}
