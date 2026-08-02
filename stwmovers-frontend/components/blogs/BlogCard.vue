<script setup lang="ts">
import type { WpPost } from '~/types/wordpress'
import { blogPath, formatWpDate, wpExcerpt, wpFeaturedImage, wpTitle } from '~/utils/wordpress'

const props = defineProps<{
  post: WpPost
}>()

const title = computed(() => wpTitle(props.post))
const excerpt = computed(() => wpExcerpt(props.post))
const image = computed(() => wpFeaturedImage(props.post))
const dateLabel = computed(() => formatWpDate(props.post.date))
const to = computed(() => blogPath(props.post.slug))
</script>

<template>
  <article class="blog-card">
    <NuxtLink :to="to" class="blog-card__media">
      <NuxtImg
        v-if="image"
        :src="image.src"
        :alt="image.alt"
        preset="card"
        width="640"
        height="400"
        sizes="xs:100vw sm:100vw md:50vw lg:33vw"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="blog-card__placeholder" aria-hidden="true" />
    </NuxtLink>
    <div class="blog-card__body">
      <p v-if="dateLabel" class="blog-card__date">{{ dateLabel }}</p>
      <h2 class="blog-card__title">
        <NuxtLink :to="to">{{ title }}</NuxtLink>
      </h2>
      <p v-if="excerpt" class="blog-card__excerpt">{{ excerpt }}</p>
      <NuxtLink :to="to" class="blog-card__link">
        Read article
        <span aria-hidden="true">→</span>
      </NuxtLink>
    </div>
  </article>
</template>
