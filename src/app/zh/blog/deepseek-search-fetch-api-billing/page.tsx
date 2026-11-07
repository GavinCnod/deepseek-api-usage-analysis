/** 文件说明：博客文章《DeepSeek Search & Fetch API》中文镜像路由。 */
import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import JsonLd from "@/components/JsonLd";
import { getBlogArticleLocaleMeta } from "@/lib/blogArticles";
import { en, zh } from "@/lib/content/articleSearchFetchBilling";
import { buildLocaleUrl } from "@/lib/localeRouting";
import { buildArticleSearchFetchBillingMetadata } from "@/lib/routeMetadata";
import { buildArticleJsonLd } from "@/lib/schema";
import { OG_IMAGE_URL } from "@/lib/site";

/**
 * 生成中文文章 metadata。
 */
export function generateMetadata(): Metadata {
  return buildArticleSearchFetchBillingMetadata("zh");
}

/**
 * 渲染中文博客文章详情页，并注入中文 Article JSON-LD。
 */
export default function ZhArticleSearchFetchBillingPage() {
  const meta = getBlogArticleLocaleMeta("deepseek-search-fetch-api-billing", "zh");
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
          title: "DeepSeek 定价史：从 V3 到 2026 年 9 月 V4 Flash 降价",
          slug: "deepseek-api-price-history-2025-2026",
        }}
      />
    </>
  );
}
