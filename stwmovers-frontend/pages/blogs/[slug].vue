<script setup lang="ts">
import '~/assets/styles/css/blogs.css'
import { routes } from '~/constants/routes'
import { findLocalBlogArticle, localArticleToWpPost, localBlogSeo } from '~/data/localBlogArticles'
import {
  formatWpDate,
  wpExcerpt,
  wpFeaturedImage,
  wpTitle,
} from '~/utils/wordpress'

definePageMeta({ layout: 'home' })

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const { data: detail, pending, error } = await useBlogPost(slug)
const localArticle = computed(() => findLocalBlogArticle(slug.value))
const localPost = computed(() => (localArticle.value ? localArticleToWpPost(localArticle.value) : null))
const post = computed(() => detail.value?.post ?? localPost.value)
const showError = computed(() => Boolean(error.value && !localArticle.value))
const articleSeo = computed(() => detail.value?.seo ?? (localArticle.value ? localBlogSeo(localArticle.value) : null))

if (!error.value && !post.value && !localArticle.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const title = computed(() => (post.value ? wpTitle(post.value) : 'Article'))
const excerpt = computed(() => (post.value ? wpExcerpt(post.value) : ''))
const image = computed(() => (post.value ? wpFeaturedImage(post.value) : null))
const dateLabel = computed(() => (post.value ? formatWpDate(post.value.date) : ''))
const lastUpdatedLabel = computed(() => (dateLabel.value ? `Last updated ${dateLabel.value}` : 'Reviewed by STW Movers'))
const articleTopic = computed(() => {
  if (!localArticle.value) return 'STW Movers Insight'
  if (slug.value.includes('airport')) return 'Airport transfer guide'
  if (slug.value.includes('taxi') || slug.value.includes('cab')) return 'Taxi and cab comparison'
  if (slug.value.includes('driver')) return 'Private driver guide'
  return 'Chauffeur planning'
})

useRankMathSeo(articleSeo)
</script>

<template>
  <div class="home-page blogs-page">
    <article class="blog-article">
      <div class="blogs-container">
        <NuxtLink :to="routes.blogs" class="blog-article__back">
          <span aria-hidden="true">←</span>
          All articles
        </NuxtLink>

        <div v-if="showError" class="blogs-error" role="alert">
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
            <div class="blog-article__meta-row">
              <span>{{ articleTopic }}</span>
              <span>{{ lastUpdatedLabel }}</span>
              <span>Reviewed by STW Movers</span>
              <span>Quote-ready guide</span>
            </div>
            <h1 class="blog-article__title">{{ title }}</h1>
            <p v-if="excerpt" class="blog-article__excerpt">{{ excerpt }}</p>
            <div class="blog-article__authority" aria-label="Article standards">
              <span>Written for travellers comparing taxi, cab, private driver, and chauffeur options.</span>
              <span>Includes direct answers, decision logic, booking details, FAQs, and next-step service links.</span>
            </div>
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

          <section v-if="localArticle" class="blog-article__planning" aria-labelledby="blog-planning-heading">
            <div class="blog-article__toc">
              <p class="blogs-eyebrow">Inside this guide</p>
              <h2 id="blog-planning-heading">Quick route through the article</h2>
              <ol>
                <li v-for="section in localArticle.sections" :key="section.heading">
                  {{ section.heading }}
                </li>
                <li>Common questions</li>
              </ol>
            </div>
            <div class="blog-article__quote-card">
              <p class="blogs-eyebrow">Quote-ready details</p>
              <h2>Planning a real trip?</h2>
              <ul>
                <li>Pickup and destination</li>
                <li>Date, time, flight, or cruise details</li>
                <li>Passengers, luggage, and preferred vehicle</li>
              </ul>
              <NuxtLink to="/journey#book-journey">
                Request private quote
              </NuxtLink>
            </div>
          </section>

          <div class="blog-content" v-html="post.content.rendered" />

          <section class="blog-article__inline-cta" aria-labelledby="blog-inline-cta-heading">
            <div>
              <p class="blogs-eyebrow">From research to booking</p>
              <h2 id="blog-inline-cta-heading">Need a private Barcelona chauffeur quote?</h2>
              <p>
                Share the trip details and STW Movers will help match the right private transfer, taxi alternative,
                cab alternative, or chauffeur plan for your route.
              </p>
            </div>
            <NuxtLink to="/journey#book-journey">
              Send trip details
            </NuxtLink>
          </section>

          <section v-if="localArticle" class="blog-article__related" aria-labelledby="blog-related-heading">
            <div>
              <p class="blogs-eyebrow">Continue planning</p>
              <h2 id="blog-related-heading">Recommended next pages</h2>
            </div>
            <div class="blog-article__related-links">
              <NuxtLink v-for="link in localArticle.related" :key="link.href" :to="link.href">
                {{ link.label }}
              </NuxtLink>
            </div>
          </section>
        </template>
      </div>
    </article>
  </div>
</template>
