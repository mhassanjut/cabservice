<script setup lang="ts">
import '~/assets/styles/css/blogs.css'
import type { WpPost } from '~/types/wordpress'
import { localBlogPosts } from '~/data/localBlogArticles'
import { mergePublishedPosts, blogTopic } from '~/utils/blogListing'
import { breadcrumbSchema, schemaGraph, siteAbsoluteUrl } from '~/utils/schema'
definePageMeta({ layout: 'home' })
usePageSeo({ title: 'Barcelona Transfer Insights', description: 'Barcelona airport transfer guides, private driver advice, group travel and local route planning from STW Movers.', path: '/blogs' })
const { data: posts, pending } = await useBlogPosts({ perPage: 100 })
const visiblePosts = computed(() => mergePublishedPosts(localBlogPosts, posts.value || []))
const featuredPost = computed(() => visiblePosts.value[0])
const selectedTopic = ref('All')
const topics = computed(() => ['All', ...['Airport', 'Private Driver', 'Groups', 'Barcelona Travel'].filter(topic => visiblePosts.value.filter((post: WpPost) => blogTopic(post) === topic).length >= 2)])
const filteredPosts = computed(() => visiblePosts.value.filter((post: WpPost) => post.slug !== featuredPost.value?.slug && (selectedTopic.value === 'All' || blogTopic(post) === selectedTopic.value)))
const shown = ref(9)
watch(selectedTopic, () => { shown.value = 9 })
const listingPosts = computed(() => filteredPosts.value.slice(0, shown.value))
useHead(() => ({ script: [{ key: 'ld-json-insights-collection', type: 'application/ld+json', innerHTML: JSON.stringify(schemaGraph([
  { '@type': 'CollectionPage', name: 'Barcelona Transfer Insights', url: siteAbsoluteUrl('/blogs') },
  { '@type': 'ItemList', itemListElement: visiblePosts.value.map((post: WpPost, index: number) => ({ '@type': 'ListItem', position: index + 1, name: post.title.rendered, url: siteAbsoluteUrl('/blogs/' + post.slug) })) },
  breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Insights', path: '/blogs' }]),
])) }] }))
</script>
<template>
  <div class="home-page blogs-page journal-page">
    <BlogsHero />
    <section v-if="featuredPost" class="blogs-featured" aria-labelledby="latest-insight">
      <div class="blogs-container">
        <div class="blogs-section-head"><p class="blogs-eyebrow">From the journal</p><h2 id="latest-insight">The latest insight</h2></div>
        <BlogsBlogCard :post="featuredPost" />
      </div>
    </section>
    <section class="blogs-listing" aria-labelledby="journal-heading" :aria-busy="pending">
      <div class="blogs-container">
        <div class="blogs-section-head"><h2 id="journal-heading">Explore the journal</h2></div>
        <div class="journal-filters" role="group" aria-label="Filter articles by topic">
          <button v-for="topic in topics" :key="topic" type="button" :aria-pressed="selectedTopic === topic" @click="selectedTopic = topic">{{ topic }}</button>
        </div>
        <p class="journal-count" aria-live="polite">{{ filteredPosts.length }} articles</p>
        <div class="blogs-grid"><BlogsBlogCard v-for="post in listingPosts" :key="post.slug" :post="post" /></div>
        <p v-if="!filteredPosts.length">More guides on this topic are coming soon.</p>
        <button v-if="shown < filteredPosts.length" class="blogs-btn journal-more" type="button" @click="shown += 9">More articles</button>
      </div>
    </section>
    <section class="blogs-quote-band">
      <div class="blogs-container blogs-quote-band__inner">
        <div><p class="blogs-eyebrow">Your next journey</p><h2>Find the right transfer for your plans.</h2><p>Explore airport pickups, private drivers and group travel, or share your route for a personal quote.</p></div>
        <NuxtLink class="blogs-btn blogs-btn--gold" to="/journey#book-journey">Get a private quote</NuxtLink>
        <NuxtLink class="blogs-btn blogs-btn--glass" to="/services">Explore services</NuxtLink>
      </div>
    </section>
  </div>
</template>
<style scoped>
.journal-page :deep(.blogs-hero) { min-height: 0; height: auto; }
.journal-page :deep(.blogs-hero__inner) { min-height: 0; padding-block: 120px 44px; }
.journal-page :deep(.blogs-hero__title) { font-size: 44px; max-width: 760px; line-height: 1.12; font-weight: 300; }
.journal-page :deep(.blogs-hero__signals), .journal-page :deep(.blogs-hero__actions) { display: none; }
.journal-page :deep(.blogs-hero__lead) { max-width: 680px; font-size: 16px; }
.journal-page :deep(.blogs-featured .blog-card) { display: grid; grid-template-columns: 1.15fr 1fr; }
.journal-page :deep(.blogs-featured .blog-card__media) { height: 100%; min-height: 280px; }
.journal-page :deep(.blog-card) { border-radius: 8px; }
.journal-page :deep(.blog-card__title) { font-size: 24px; line-height: 1.3; }
.journal-filters { display: flex; flex-wrap: wrap; gap: 8px; }
.journal-filters button { min-height: 44px; padding: 10px 18px; border: 1px solid rgba(var(--theme-ink-rgb), 0.18); border-radius: 4px; background: rgba(var(--theme-surface-rgb), 0.04); color: var(--home-text); cursor: pointer; font: inherit; font-size: 14px; }
.journal-filters button[aria-pressed="true"] { background: #e5c36c; color: rgba(var(--theme-ink-rgb), 1); }
.journal-count { color: var(--home-text-muted); font-size: 13px; margin: 20px 0; }
.journal-more { margin-top: 24px; cursor: pointer; color: rgba(var(--theme-ink-rgb), 1); background: #e5c36c; border: 1px solid #8d7946; }
@media(max-width:767px) {
 .journal-page :deep(.blogs-hero__title) { font-size: 32px; }
 .journal-page :deep(.blogs-featured .blog-card) { display: block; }
 .journal-page :deep(.blogs-featured .blog-card__media) { min-height: 0; height: auto; aspect-ratio: 8 / 5; }
 .journal-page :deep(.blogs-grid) { display: grid; grid-template-columns: 1fr; }
}
</style>
