"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { buildLocalePath } from "@/lib/localeRouting";
import { getBlogArticleDefinition } from "@/lib/blogArticles";
import TitleBar from "@/components/TitleBar";
import FooterBar from "@/components/FooterBar";

export default function BlogIndex() {
  const { locale, t } = useTranslation();
  const homeHref = buildLocalePath("/", locale);

  const posts = [
    {
      title: t.blogIndex.article1Title,
      description: t.blogIndex.article1Desc,
      slug: "deepseek-context-caching-guide" as const,
      tags: t.blogIndex.article1Tags.split(", "),
    },
    {
      title: t.blogIndex.article2Title,
      description: t.blogIndex.article2Desc,
      slug: "deepseek-cost-optimization-tools" as const,
      tags: t.blogIndex.article2Tags.split(", "),
    },
    {
      title: t.blogIndex.article3Title,
      description: t.blogIndex.article3Desc,
      slug: "openai-claude-vs-deepseek-cost-comparison" as const,
      tags: t.blogIndex.article3Tags.split(", "),
    },
    {
      title: t.blogIndex.article4Title,
      description: t.blogIndex.article4Desc,
      slug: "opencode-go-cheapest-deepseek-v4-flash" as const,
      tags: t.blogIndex.article4Tags.split(", "),
    },
    {
      title: t.blogIndex.article5Title,
      description: t.blogIndex.article5Desc,
      slug: "deepseek-csv-export-format-changed-aug-2026" as const,
      tags: t.blogIndex.article5Tags.split(", "),
    },
  ].sort((a, b) =>
    getBlogArticleDefinition(b.slug).publishedTime.localeCompare(
      getBlogArticleDefinition(a.slug).publishedTime
    )
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <TitleBar />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <Link
          href={homeHref}
          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 mb-8 hover:opacity-80"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t.guideline.backToHome}
        </Link>

        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
        >
          {t.blogIndex.pageTitle}
        </h1>
        <p
          className="text-sm leading-relaxed text-pretty mb-12 max-w-3xl"
          style={{ color: "var(--text-secondary)" }}
        >
          {t.blogIndex.pageSubtitle}
        </p>

        <div className="grid grid-cols-1 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={buildLocalePath(`/blog/${post.slug}`, locale)}
              className="block p-6 rounded-subtle transition-all duration-200 hover:opacity-90 group"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ color: "var(--accent)", border: "1px solid var(--border)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2
                className="text-lg font-bold tracking-tight mb-2 group-hover:opacity-80"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
              >
                {post.title}
              </h2>
              <p
                className="text-sm leading-relaxed text-pretty"
                style={{ color: "var(--text-secondary)" }}
              >
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <FooterBar />
    </div>
  );
}
