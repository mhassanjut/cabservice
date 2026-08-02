package com.stwmovers.taxi.infrastructure.wordpress;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.stwmovers.taxi.application.dto.response.ParsedSeoResponse;

/** Rewrites CMS permalinks to public Nuxt blog URLs in parsed SEO payloads. */
@Component
public class SeoUrlRewriter {

    public void rewriteToPublicSite(ParsedSeoResponse seo, String wordpressPermalink, String publicArticleUrl) {
        if (seo == null || wordpressPermalink == null || publicArticleUrl == null) {
            return;
        }
        String wp = normalizeUrl(wordpressPermalink);
        String pub = normalizeUrl(publicArticleUrl);
        if (wp.equals(pub)) {
            return;
        }

        seo.setCanonical(replaceUrl(seo.getCanonical(), wp, pub));
        rewriteMap(seo.getMeta(), wp, pub);
        rewriteMap(seo.getOg(), wp, pub);
        rewriteMap(seo.getTwitter(), wp, pub);
        rewriteMap(seo.getArticle(), wp, pub);
        rewriteMap(seo.getProperties(), wp, pub);
        rewriteMap(seo.getLinks(), wp, pub);
        if (seo.getSchema() != null) {
            List<JsonNode> rewritten = new ArrayList<>();
            for (JsonNode node : seo.getSchema()) {
                rewritten.add(rewriteJsonNode(node, wp, pub));
            }
            seo.setSchema(rewritten);
        }
    }

    private static void rewriteMap(Map<String, Object> map, String wp, String pub) {
        if (map == null || map.isEmpty()) {
            return;
        }
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            entry.setValue(rewriteValue(entry.getValue(), wp, pub));
        }
    }

    private static Object rewriteValue(Object value, String wp, String pub) {
        if (value instanceof String s) {
            return replaceUrl(s, wp, pub);
        }
        if (value instanceof List<?> list) {
            List<Object> out = new ArrayList<>();
            for (Object item : list) {
                out.add(item instanceof String str ? replaceUrl(str, wp, pub) : item);
            }
            return out;
        }
        return value;
    }

    private static JsonNode rewriteJsonNode(JsonNode node, String wp, String pub) {
        if (node == null) {
            return null;
        }
        if (node.isTextual()) {
            return TextNode.valueOf(replaceUrl(node.asText(), wp, pub));
        }
        if (node.isArray()) {
            ArrayNode array = node.deepCopy();
            for (int i = 0; i < array.size(); i++) {
                array.set(i, rewriteJsonNode(array.get(i), wp, pub));
            }
            return array;
        }
        if (node.isObject()) {
            ObjectNode object = (ObjectNode) node.deepCopy();
            var fields = object.fields();
            while (fields.hasNext()) {
                var field = fields.next();
                object.set(field.getKey(), rewriteJsonNode(field.getValue(), wp, pub));
            }
            return object;
        }
        return node.deepCopy();
    }

    static String replaceUrl(String value, String wp, String pub) {
        if (value == null || value.isBlank()) {
            return value;
        }
        if (value.equals(wp) || value.equals(stripTrailingSlash(wp))) {
            return pub;
        }
        return value.replace(wp, pub).replace(stripTrailingSlash(wp), pub);
    }

    static String normalizeUrl(String url) {
        if (url == null) {
            return "";
        }
        return stripTrailingSlash(url.trim());
    }

    private static String stripTrailingSlash(String url) {
        if (url.endsWith("/") && url.length() > 1) {
            return url.substring(0, url.length() - 1);
        }
        return url;
    }
}
