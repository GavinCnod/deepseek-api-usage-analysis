/** 文件说明：中文博客文章《DeepSeek Cost Optimization Tools》镜像路由。 */
import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import JsonLd from "@/components/JsonLd";
import { getBlogArticleLocaleMeta } from "@/lib/blogArticles";
import { en, zh } from "@/lib/content/articleTools";
import { buildLocaleUrl } from "@/lib/localeRouting";
import { buildArticleToolsMetadata } from "@/lib/routeMetadata";
import { buildArticleJsonLd } from "@/lib/schema";
import { OG_IMAGE_URL } from "@/lib/site";

/**
 * 生成中文博客文章 metadata。
 */
export function generateMetadata(): Metadata {
  return buildArticleToolsMetadata("zh");
}

/**
 * 渲染中文博客文章详情页，并注入中文 Article JSON-LD。
 */
export default function ZhArticleToolsPage() {
  const meta = getBlogArticleLocaleMeta("deepseek-cost-optimization-tools", "zh");
  const articleUrl = buildLocaleUrl("zh", meta.pathname);
  const articleJsonLd = buildArticleJsonLd({
    locale: "zh",
    headline: meta.title,
    description: meta.description,
    url: articleUrl,
    datePublished: meta.publishedTime,
    dateModified: meta.modifiedTime,
    authorName: meta.author,
    imageUrl: OG_IMAGE_URL,
  });

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <BlogArticlePage
        meta={meta}
        content={{ en, zh }}
        prevPost={{
          title: "The Ultimate Guide to DeepSeek API Context Caching (2026)",
          slug: "deepseek-context-caching-guide",
        }}
        nextPost={{
          title: "DeepSeek vs OpenAI vs Claude: 2026 API Pricing Compared",
          slug: "openai-claude-vs-deepseek-cost-comparison",
        }}
      />
    </>
  );
}
