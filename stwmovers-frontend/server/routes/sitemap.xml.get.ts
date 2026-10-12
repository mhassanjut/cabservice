import { sitemapXml } from '../../config/sitemap'
import { siteConfig } from '../../config/site'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300')
  return sitemapXml(siteConfig.siteUrl)
})
