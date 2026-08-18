/** 文件说明：中文博客文章《DeepSeek V4 Flash on OpenCode Go》镜像路由。 */
import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import JsonLd from "@/components/JsonLd";
import { getBlogArticleLocaleMeta } from "@/lib/blogArticles";
import { en, zh } from "@/lib/content/articleOpencodeGo";
import { buildLocaleUrl } from "@/lib/localeRouting";
import { buildArticleOpencodeGoMetadata } from "@/lib/routeMetadata";
import { buildArticleJsonLd } from "@/lib/schema";
import { OG_IMAGE_URL } from "@/lib/site";

/**
 * 生成中文博客文章 metadata。
 */
export function generateMetadata(): Metadata {
  return buildArticleOpencodeGoMetadata("zh");
}

/**
 * 渲染中文博客文章详情页，并注入中文 Article JSON-LD。
 */
export default function ZhArticleOpencodeGoPage() {
  const meta = getBlogArticleLocaleMeta("opencode-go-cheapest-deepseek-v4-flash", "zh");
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
          title: "DeepSeek vs OpenAI vs Claude: 2026 API Pricing Compared",
          slug: "openai-claude-vs-deepseek-cost-comparison",
        }}
        nextPost={{
          title: "DeepSeek Changed Its CSV Export Format (Aug 2026)",
          slug: "deepseek-csv-export-format-changed-aug-2026",
        }}
      />
    </>
  );
}
