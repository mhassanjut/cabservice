import type { BlogDetailDto } from '~/types/blog'
import type { WpPost } from '~/types/wordpress'
import { blogService } from '~/services/api/blog.service'

export function useBlogPosts(options?: { perPage?: number; page?: number }) {
  const perPage = options?.perPage ?? 12
  const page = options?.page ?? 1

  return useAsyncData(
    `blog-posts-${page}-${perPage}`,
    () => blogService.list(page, perPage),
    { default: () => [] as WpPost[] },
  )
}

export function useBlogPost(slug: MaybeRefOrGetter<string>) {
  const slugRef = computed(() => toValue(slug))

  return useAsyncData(
    () => `blog-post-${slugRef.value}`,
    () => blogService.getBySlug(slugRef.value),
    {
      default: () => null as BlogDetailDto | null,
      watch: [slugRef],
    },
  )
}
