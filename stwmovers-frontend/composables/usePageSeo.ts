import { absoluteUrl, pageDescription, pageTitle } from '~/utils/seo'
import { seoDefaults } from '~/config/seo'

type PageSeoInput = {
  title?: string
  description?: string
  path?: string
  ogImagePath?: string
}

export function usePageSeo(input: PageSeoInput) {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://stwmovers.com'
  const canonical = input.path ? absoluteUrl(input.path, siteUrl) : siteUrl
  const ogImage = absoluteUrl(input.ogImagePath || seoDefaults.defaultOgImagePath, siteUrl)

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
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
  })
}

