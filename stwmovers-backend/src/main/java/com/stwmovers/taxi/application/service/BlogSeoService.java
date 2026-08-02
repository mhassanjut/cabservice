package com.stwmovers.taxi.application.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.stwmovers.taxi.application.dto.response.BlogPostResponse;
import com.stwmovers.taxi.application.dto.response.ParsedSeoResponse;
import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.infrastructure.wordpress.BlogPostMapper;
import com.stwmovers.taxi.infrastructure.wordpress.RankMathClient;
import com.stwmovers.taxi.infrastructure.wordpress.RankMathHeadParser;
import com.stwmovers.taxi.infrastructure.wordpress.SeoUrlRewriter;

@Service
public class BlogSeoService {

    private static final Logger log = LoggerFactory.getLogger(BlogSeoService.class);

    private final RankMathClient rankMathClient;
    private final RankMathHeadParser headParser;
    private final SeoUrlRewriter urlRewriter;
    private final AppProperties appProperties;

    public BlogSeoService(
            RankMathClient rankMathClient,
            RankMathHeadParser headParser,
            SeoUrlRewriter urlRewriter,
            AppProperties appProperties) {
        this.rankMathClient = rankMathClient;
        this.headParser = headParser;
        this.urlRewriter = urlRewriter;
        this.appProperties = appProperties;
    }

    public ParsedSeoResponse resolveForPost(BlogPostResponse post, String slug) {
        String publicUrl = buildPublicArticleUrl(slug);
        if (post.getLink() == null || post.getLink().isBlank()) {
            return fallbackSeo(post, publicUrl);
        }
        try {
            String rawHead = rankMathClient.fetchHeadHtml(post.getLink());
            ParsedSeoResponse seo = headParser.parse(rawHead);
            urlRewriter.rewriteToPublicSite(seo, post.getLink(), publicUrl);
            if (seo.getCanonical() == null || seo.getCanonical().isBlank()) {
                seo.setCanonical(publicUrl);
            }
            return seo;
        } catch (Exception ex) {
            log.warn("Rank Math SEO unavailable for slug={}: {}", slug, ex.getMessage());
            return fallbackSeo(post, publicUrl);
        }
    }

    ParsedSeoResponse fallbackSeo(BlogPostResponse post, String publicUrl) {
        String title = post.getTitle() != null ? BlogPostMapper.plainText(post.getTitle().getRendered()) : null;
        String description = post.getExcerpt() != null ? BlogPostMapper.plainText(post.getExcerpt().getRendered()) : null;

        ParsedSeoResponse seo = ParsedSeoResponse.builder()
                .title(title)
                .canonical(publicUrl)
                .build();
        if (description != null && !description.isBlank()) {
            seo.getMeta().put("description", description);
        }
        if (title != null && !title.isBlank()) {
            seo.getOg().put("title", title);
            seo.getTwitter().put("title", title);
        }
        if (description != null && !description.isBlank()) {
            seo.getOg().put("description", description);
            seo.getTwitter().put("description", description);
        }
        seo.getOg().put("url", publicUrl);
        seo.getOg().put("type", "article");
        seo.getTwitter().put("card", "summary_large_image");
        return seo;
    }

    String buildPublicArticleUrl(String slug) {
        AppProperties.Wordpress wp = appProperties.getWordpress();
        String site = wp.getPublicSiteUrl().replaceAll("/$", "");
        String prefix = wp.getBlogPathPrefix();
        if (prefix == null || prefix.isBlank()) {
            prefix = "/blogs";
        }
        if (!prefix.startsWith("/")) {
            prefix = "/" + prefix;
        }
        prefix = prefix.replaceAll("/$", "");
        return site + prefix + "/" + slug;
    }
}
