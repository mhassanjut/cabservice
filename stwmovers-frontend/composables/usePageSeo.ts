import { absoluteUrl, pageDescription, pageTitle, robotsForPath } from '~/utils/seo'
import { seoDefaults } from '~/config/seo'

type PageSeoInput = {
  title?: string
  description?: string
  path?: string
  ogImagePath?: string
  robots?: string
}

export function usePageSeo(input: PageSeoInput) {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://www.stwmovers.com'
  const canonical = input.path ? absoluteUrl(input.path, siteUrl) : siteUrl
  const ogImage = absoluteUrl(input.ogImagePath || seoDefaults.defaultOgImagePath, siteUrl)
  const robots = input.robots || robotsForPath(input.path)

  // SEO-critical: centralized meta composition for consistent scaling across future pages/sections.
  useSeoMeta({
    title: pageTitle(input.title),
    description: pageDescription(input.description),
    ogTitle: pageTitle(input.title),
    ogDescription: pageDescription(input.description),
    ogType: 'website',
    ogUrl: canonical,
    ogImage,
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle(input.title),
    twitterDescription: pageDescription(input.description),
    twitterImage: ogImage,
    robots,
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
  })
}
