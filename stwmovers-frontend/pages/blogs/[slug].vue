<script setup lang="ts">
import '~/assets/styles/css/blogs.css'
import { routes } from '~/constants/routes'
import {
  blogPath,
  formatWpDate,
  wpExcerpt,
  wpFeaturedImage,
  wpTitle,
} from '~/utils/wordpress'

definePageMeta({ layout: 'home' })

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const { data: detail, pending, error } = await useBlogPost(slug)
const post = computed(() => detail.value?.post ?? null)

if (!error.value && !post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const title = computed(() => (post.value ? wpTitle(post.value) : 'Article'))
const excerpt = computed(() => (post.value ? wpExcerpt(post.value) : ''))
const image = computed(() => (post.value ? wpFeaturedImage(post.value) : null))
const dateLabel = computed(() => (post.value ? formatWpDate(post.value.date) : ''))

useRankMathSeo(computed(() => detail.value?.seo))
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
