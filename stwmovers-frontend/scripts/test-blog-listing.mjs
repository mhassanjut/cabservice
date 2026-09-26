import assert from 'node:assert/strict'
import { mergePublishedPosts, readingMinutes, blogTopic } from '../utils/blogListing.ts'

const post = (slug, date, status = 'publish') => ({ slug, date, status })
const local = [post('old', '2026-01-01'), post('duplicate', '2026-02-01')]
const remote = [post('latest', '2026-09-22'), post('duplicate', '2026-03-01'), post('draft', '2026-10-01', 'draft')]
const result = mergePublishedPosts(local, remote)
assert.deepEqual(result.map(p => p.slug), ['latest', 'duplicate', 'old'])
assert.equal(result[1], remote[1])
assert.equal(local.length, 2)
assert.deepEqual(mergePublishedPosts([post('b', 'invalid'), post('a', 'invalid')], []).map(p => p.slug), ['a', 'b'])
assert.equal(readingMinutes('<p>' + 'word '.repeat(441) + '</p>'), 3)
assert.equal(readingMinutes('<script>' + 'word '.repeat(500) + '</script><p>Short article.</p>'), 1)
assert.equal(readingMinutes(''), 1)
assert.equal(blogTopic(post('family-airport-transfer')), 'Groups')
assert.equal(blogTopic(post('airport-transfer')), 'Airport')
assert.equal(blogTopic(post('hourly-chauffeur')), 'Private Driver')
console.log('Blog listing checks passed: latest-first, deduplication, drafts, reading time and topics.')
