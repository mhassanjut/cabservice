<script setup lang="ts">
import '~/assets/styles/css/blogs.css'
import { routes } from '~/constants/routes'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: 'Blog',
  description:
    'Travel notes, chauffeur insights, and destination guides from STW Movers — Barcelona airport transfers, private tours, and executive journeys across Spain.',
  path: routes.blogs,
})

const { data: posts, pending, error } = await useWpPosts({ perPage: 12 })
</script>

<template>
  <div class="home-page blogs-page">
    <BlogsHero />

    <section class="blogs-listing" aria-labelledby="blogs-listing-heading">
      <div class="blogs-container">
        <h2 id="blogs-listing-heading" class="sr-only">Latest articles</h2>

        <div v-if="pending" class="blogs-grid">
          <BlogsBlogCardSkeleton v-for="n in 6" :key="`blog-skeleton-${n}`" />
        </div>

        <div v-else-if="error" class="blogs-error" role="alert">
          <p class="blogs-error__title">Unable to load articles</p>
          <p class="blogs-error__text">Please try again in a moment.</p>
        </div>

        <div v-else-if="!posts?.length" class="blogs-empty">
          <p class="blogs-empty__title">No articles yet</p>
          <p class="blogs-empty__text">New stories from the STW Movers desk will appear here soon.</p>
        </div>

        <div v-else class="blogs-grid">
          <BlogsBlogCard v-for="post in posts" :key="post.id" :post="post" />
        </div>
      </div>
    </section>
  </div>
</template>
