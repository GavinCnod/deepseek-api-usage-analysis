/** 文件说明：中文博客文章《DeepSeek 改了用量导出 CSV 格式》镜像路由。 */
import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import JsonLd from "@/components/JsonLd";
import { getBlogArticleLocaleMeta } from "@/lib/blogArticles";
import { en, zh } from "@/lib/content/articleCsvFormatChange";
import { buildLocaleUrl } from "@/lib/localeRouting";
import { buildArticleCsvFormatMetadata } from "@/lib/routeMetadata";
import { buildArticleJsonLd } from "@/lib/schema";
import { OG_IMAGE_URL } from "@/lib/site";

/**
 * 生成中文博客文章 metadata。
 */
export function generateMetadata(): Metadata {
  return buildArticleCsvFormatMetadata("zh");
}

/**
 * 渲染中文博客文章详情页，并注入中文 Article JSON-LD。
 */
export default function ZhArticleCsvFormatPage() {
  const meta = getBlogArticleLocaleMeta("deepseek-csv-export-format-changed-aug-2026", "zh");
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
          title: "DeepSeek V4 Flash for $10/Month — the World's Cheapest Frontier Model Is on OpenCode Go",
          slug: "opencode-go-cheapest-deepseek-v4-flash",
        }}
      />
    </>
  );
}