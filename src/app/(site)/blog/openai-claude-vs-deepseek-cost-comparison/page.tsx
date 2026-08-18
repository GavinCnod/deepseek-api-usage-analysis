/** 文件说明：博客文章《OpenAI GPT & Anthropic Claude vs DeepSeek Cost Comparison》路由与 SEO 元数据。 */
import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import JsonLd from "@/components/JsonLd";
import { getBlogArticleLocaleMeta } from "@/lib/blogArticles";
import { en, zh } from "@/lib/content/articleOpenai";
import { buildLocaleUrl } from "@/lib/localeRouting";
import { buildArticleOpenAiMetadata } from "@/lib/routeMetadata";
import { buildArticleJsonLd } from "@/lib/schema";
import { OG_IMAGE_URL } from "@/lib/site";

/**
 * 生成英文文章 SEO 元数据。
 */
export function generateMetadata(): Metadata {
  return buildArticleOpenAiMetadata("en");
}

/**
 * 渲染博客文章详情页，并注入 Article JSON-LD。
 */
export default function Page() {
  const meta = getBlogArticleLocaleMeta("openai-claude-vs-deepseek-cost-comparison", "en");
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
        prevPost={{ title: "Top 5 DeepSeek API Cost Optimization & Observability Tools", slug: "deepseek-cost-optimization-tools" }}
        nextPost={{ title: "DeepSeek V4 Flash on OpenCode Go: $10/Mo Cheapest Frontier", slug: "opencode-go-cheapest-deepseek-v4-flash" }}
      />
    </>
  );
}
