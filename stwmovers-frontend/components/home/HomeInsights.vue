<script setup lang="ts">
import { localBlogPosts } from '~/data/localBlogArticles'
import { mergePublishedPosts } from '~/utils/blogListing'
import { wpTitle, wpExcerpt, wpFeaturedImage } from '~/utils/wordpress'

const { data: remotePosts } = useBlogPosts({ perPage: 100 })
const articles = computed(() => mergePublishedPosts(localBlogPosts, remotePosts.value ?? []).slice(0, 3).map(post => ({
  slug: post.slug,
  title: wpTitle(post),
  excerpt: wpExcerpt(post),
  image: wpFeaturedImage(post)?.src ?? '/img/services/airport.png',
  imageAlt: wpFeaturedImage(post)?.alt ?? wpTitle(post),
})))
</script>

<template>
  <section class="home-section home-insights" aria-labelledby="home-insights-title">
    <div class="container">
      <div class="home-insights__heading">
        <div>
          <p class="home-eyebrow">Insights</p>
          <h2 id="home-insights-title" class="home-display home-display--md">Plan your Barcelona journey.</h2>
        </div>
        <NuxtLink to="/blogs">All articles <i class="fa-solid fa-arrow-right" aria-hidden="true" /></NuxtLink>
      </div>
      <div class="home-insights__grid">
        <article v-for="article in articles" :key="article.slug">
          <NuxtLink :to="'/blogs/' + article.slug" class="home-insights__article">
            <NuxtImg :src="article.image" :alt="article.imageAlt" width="640" height="400" sizes="sm:100vw md:50vw lg:33vw" loading="lazy" />
            <h3>{{ article.title }}</h3>
            <p>{{ article.excerpt }}</p>
            <span>Read article <i class="fa-solid fa-arrow-right" aria-hidden="true" /></span>
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-insights { background: rgba(var(--theme-shade-rgb), 1); color: rgba(var(--theme-ink-rgb), 1); }
.home-insights .home-eyebrow { color: #d2a83d; }
.home-insights__heading { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 28px; }
.home-insights__heading h2 { margin: 0; }
.home-insights__heading > a { flex-shrink: 0; color: #e5c36c; text-decoration: none; font-size: 14px; }
.home-insights__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.home-insights__article { display: flex; height: 100%; flex-direction: column; color: inherit; text-decoration: none; }
.home-insights__article img { width: 100%; aspect-ratio: 8 / 5; height: auto; object-fit: cover; border-radius: 4px; transition: filter 0.2s ease; }
.home-insights__article h3 { margin: 18px 0 12px; font-size: 22px; line-height: 1.3; font-weight: 300; letter-spacing: 0; }
.home-insights__article p { margin: 0 0 18px; color: rgba(var(--theme-ink-rgb), 1); font-size: 14px; line-height: 1.6; }
.home-insights__article span { margin-top: auto; color: #e5c36c; font-size: 13px; }
.home-insights__article:hover img { filter: brightness(1.1); }
.home-insights a:focus-visible { outline: 2px solid #e5c36c; outline-offset: 5px; }
@media (max-width: 767px) {
  .home-insights__heading { align-items: start; flex-direction: column; gap: 12px; }
  .home-insights__grid { grid-auto-flow: column; grid-template-columns: none; grid-auto-columns: 86%; overflow-x: auto; scroll-snap-type: x mandatory; padding: 6px 2px 20px; }
  .home-insights__grid article { scroll-snap-align: start; }
}
</style>
