<script setup lang="ts">
import '~/assets/styles/css/blogs.css'
import { seoDefaults } from '~/config/seo'
import { routes } from '~/constants/routes'
import { absoluteUrl, pageDescription, pageTitle } from '~/utils/seo'
import {
  blogPath,
  formatWpDate,
  wpExcerpt,
  wpFeaturedImage,
  wpTitle,
} from '~/utils/wordpress'

definePageMeta({ layout: 'home' })

const route = useRoute()
const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl || 'https://stwmovers.com').replace(/\/$/, '')

const slug = computed(() => String(route.params.slug || ''))
const { data: posts, pending, error } = await useWpPostBySlug(slug)
const post = computed(() => posts.value?.[0] ?? null)

if (!error.value && !post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const title = computed(() => (post.value ? wpTitle(post.value) : 'Article'))
const excerpt = computed(() => (post.value ? wpExcerpt(post.value) : ''))
const image = computed(() => (post.value ? wpFeaturedImage(post.value) : null))
const dateLabel = computed(() => (post.value ? formatWpDate(post.value.date) : ''))
const path = computed(() => blogPath(slug.value))
const canonical = computed(() => absoluteUrl(path.value, siteUrl))
const ogImage = computed(() =>
  absoluteUrl(image.value?.src || seoDefaults.defaultOgImagePath, siteUrl),
)

useSeoMeta({
  title: () => pageTitle(title.value),
  description: () => pageDescription(excerpt.value || undefined),
  ogTitle: () => pageTitle(title.value),
  ogDescription: () => pageDescription(excerpt.value || undefined),
  ogType: 'article',
  ogUrl: () => canonical.value,
  ogImage: () => ogImage.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => pageTitle(title.value),
  twitterDescription: () => pageDescription(excerpt.value || undefined),
  twitterImage: () => ogImage.value,
})

useHead({
  link: computed(() => [{ rel: 'canonical', href: canonical.value }]),
  script: computed(() => {
    if (!post.value) return []
    return [
      {
        key: 'ld-json-blog-post',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title.value,
          description: excerpt.value,
          datePublished: post.value.date,
          dateModified: post.value.modified || post.value.date,
          image: image.value?.src ? [image.value.src] : undefined,
          author: {
            '@type': 'Organization',
            name: seoDefaults.brandName,
          },
          publisher: {
            '@type': 'Organization',
            name: seoDefaults.brandName,
            url: siteUrl,
          },
          mainEntityOfPage: canonical.value,
          url: canonical.value,
        }),
      },
    ]
  }),
})
</script>

<template>
  <div class="home-page blogs-page">
    <article class="blog-article">
      <div class="blogs-container">
        <NuxtLink :to="routes.blogs" class="blog-article__back">
          <span aria-hidden="true">←</span>
          All articles
        </NuxtLink>

        <div v-if="error" class="blogs-error" role="alert">
          <p class="blogs-error__title">Unable to load this article</p>
          <p class="blogs-error__text">Please try again in a moment.</p>
        </div>

        <template v-else-if="pending && !post">
          <div class="blog-card__skeleton-line blog-card__skeleton-line--sm" style="margin-bottom: 1rem" />
          <div
            class="blog-card__skeleton-line blog-card__skeleton-line--title"
            style="width: 70%; height: 2rem; margin-bottom: 1.5rem"
          />
          <div class="blog-article__cover blog-card__skeleton-block" />
        </template>

        <template v-else-if="post">
          <header class="blog-article__header">
            <p v-if="dateLabel" class="blog-article__meta">{{ dateLabel }}</p>
            <h1 class="blog-article__title">{{ title }}</h1>
            <p v-if="excerpt" class="blog-article__excerpt">{{ excerpt }}</p>
          </header>

          <figure v-if="image" class="blog-article__cover">
            <NuxtImg
              :src="image.src"
              :alt="image.alt"
              preset="hero"
              width="1200"
              height="514"
              sizes="xs:100vw sm:100vw md:100vw lg:100vw"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </figure>

          <div class="blog-content" v-html="post.content.rendered" />
        </template>
      </div>
    </article>
  </div>
</template>
