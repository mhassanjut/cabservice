import type { BlogDetailDto } from '~/types/blog'
import type { WpPost } from '~/types/wordpress'
import { api } from '~/services/http/api'

export const blogService = {
  list: (page = 1, perPage = 12) =>
    api<WpPost[]>(`/api/v1/blogs?page=${page}&per_page=${perPage}`, {
      auth: false,
      silent: true,
    }),

  getBySlug: (slug: string) =>
    api<BlogDetailDto>(`/api/v1/blogs/${encodeURIComponent(slug)}`, {
      auth: false,
      silent: true,
    }),
}
