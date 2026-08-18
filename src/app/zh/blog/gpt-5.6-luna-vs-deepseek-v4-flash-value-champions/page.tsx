/** 文件说明：中文博客文章《2026 年性价比之王：GPT-5.6 Luna 与 DeepSeek V4 Flash》镜像路由。 */
import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import JsonLd from "@/components/JsonLd";
import { getBlogArticleLocaleMeta } from "@/lib/blogArticles";
import { en, zh } from "@/lib/content/articleValueChampions";
import { buildLocaleUrl } from "@/lib/localeRouting";
import { buildArticleValueChampionsMetadata } from "@/lib/routeMetadata";
import { buildArticleJsonLd } from "@/lib/schema";
import { OG_IMAGE_URL } from "@/lib/site";

/**
 * 生成中文文章 metadata。
 */
export function generateMetadata(): Metadata {
  return buildArticleValueChampionsMetadata("zh");
}

/**
 * 渲染中文博客文章详情页，并注入中文 Article JSON-LD。
 */
export default function ZhArticleValueChampionsPage() {
  const meta = getBlogArticleLocaleMeta("gpt-5.6-luna-vs-deepseek-v4-flash-value-champions", "zh");
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
          title: "DeepSeek 更改了 CSV 导出格式（2026 年 8 月）",
          slug: "deepseek-csv-export-format-changed-aug-2026",
        }}
      />
    </>
  );
}