/** 文件说明：博客文章《DeepSeek 定价史：从 V3 到 2026 年 9 月 V4 Flash 降价》路由与 SEO 元数据。 */
import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import JsonLd from "@/components/JsonLd";
import { getBlogArticleLocaleMeta } from "@/lib/blogArticles";
import { en, zh } from "@/lib/content/articlePricingHistory";
import { buildLocaleUrl } from "@/lib/localeRouting";
import { buildArticlePricingHistoryMetadata } from "@/lib/routeMetadata";
import { buildArticleJsonLd } from "@/lib/schema";
import { OG_IMAGE_URL } from "@/lib/site";

/**
 * 生成英文文章 SEO 元数据。
 */
export function generateMetadata(): Metadata {
  return buildArticlePricingHistoryMetadata("en");
}

/**
 * 渲染博客文章详情页，并注入 Article JSON-LD。
 */
export default function Page() {
  const meta = getBlogArticleLocaleMeta("deepseek-api-price-history-2025-2026", "en");
  const articleUrl = buildLocaleUrl("en", meta.pathname);
  const articleJsonLd = buildArticleJsonLd({
    locale: "en",
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
        prevPost={{ title: "GPT-5.6 Luna vs DeepSeek V4 Flash: 2026 Best-Value LLMs", slug: "gpt-5.6-luna-vs-deepseek-v4-flash-value-champions" }}
      />
    </>
  );
}
