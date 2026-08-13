/** 文件说明：博客文章统一布局组件，负责标题、作者信息、正文容器与底部交叉链接。 */
"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useTranslation } from "@/i18n";
import { buildLocalePath } from "@/lib/localeRouting";
import {
  AUTHOR_PAGE_PATH,
  TEAM_MEMBERS_SECTION_ID,
} from "@/lib/authors";
import TitleBar from "./TitleBar";
import FooterBar from "./FooterBar";
import AffiliateWall from "./AffiliateWall";

/**
 * Blog 文章统一排版模板
 *
 * Apple 极简风格 — max-w-3xl 阅读宽度、Hubot Sans 标题、署名 + 日期、CTA 横幅。
 * 所有 blog 文章页面通过此组件渲染，保持一致的视觉风格。
 *
 * Props:
 * @param meta - 文章元数据（标题、描述、日期、作者、slug）
 * @param children - 文章正文（ReactNode）
 */
interface BlogMeta {
  title: string;
  description: string;
  date: string;
  author: string;
  slug: string;
}

interface BlogPostLayoutProps {
  meta: BlogMeta;
  children: ReactNode;
  /** 下一篇博文（用于底部交叉链接，可选） */
  nextPost?: { title: string; slug: string };
  /** 上一篇博文 */
  prevPost?: { title: string; slug: string };
}

/**
 * 渲染博客文章统一布局。
 *
 * 输出统一的返回导航、标题、作者信息、正文与底部 CTA，
 * 并将作者身份链接到公开主页以增强可验证性信号。
 */
export default function BlogPostLayout({
  meta,
  children,
  nextPost,
  prevPost,
}: BlogPostLayoutProps) {
  const { locale, t } = useTranslation();
  const blogHref = buildLocalePath("/blog", locale);
  const authorHref = buildLocalePath(AUTHOR_PAGE_PATH, locale);
  const teamMembersHref = buildLocalePath(
    `${AUTHOR_PAGE_PATH}#${TEAM_MEMBERS_SECTION_ID}`,
    locale
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <TitleBar />

      <article className="max-w-3xl mx-auto px-6 py-8">
        {/* 返回 Blog 首页 */}
        <Link
          href={blogHref}
          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 mb-8 hover:opacity-80"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t.blog.pageTitle}
        </Link>

        {/* 文章标题 */}
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
          style={{
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
          }}
        >
          {meta.title}
        </h1>

        {/* 元数据行 */}
        <div
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mb-10"
          style={{ color: "var(--text-tertiary)" }}
        >
          <span>{meta.date}</span>
          <span aria-hidden="true">·</span>
          <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <Link
              href={authorHref}
              className="transition-colors duration-200 hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              {meta.author}
            </Link>
            <span aria-hidden="true">&amp;</span>
            <Link
              href={teamMembersHref}
              className="transition-colors duration-200 hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              MindRose Team
            </Link>
          </span>
        </div>

        {/* 文章正文 */}
        <div
          className="prose-custom text-sm leading-relaxed text-pretty space-y-4"
          style={{ color: "var(--text-secondary)" }}
        >
          {children}
        </div>

        {/* 底部推荐工具（商业化模块） */}
        <section className="mt-16 mb-4">
          <h2
            className="text-sm font-semibold mb-3"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            {t.costTracker.recommendedUsingTools}
          </h2>
          <p
            className="text-xs leading-relaxed text-pretty mb-4"
            style={{ color: "var(--text-tertiary)" }}
          >
            {t.costTracker.recommendedUsingDes}
          </p>
          <AffiliateWall ids={["opencode-go","vultr", "railway", "tencent-cloud", "silicon-flow", "warp"]} />
        </section>

        {/* 交叉链接 */}
        {(prevPost || nextPost) && (
          <div className="mt-10 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex flex-wrap justify-between gap-4 text-xs">
              {prevPost ? (
                <Link
                  href={buildLocalePath(`/blog/${prevPost.slug}`, locale)}
                  className="transition-colors duration-200 hover:opacity-80"
                  style={{ color: "var(--text-secondary)" }}
                >
                  ← {prevPost.title}
                </Link>
              ) : (
                <span />
              )}
              {nextPost ? (
                <Link
                  href={buildLocalePath(`/blog/${nextPost.slug}`, locale)}
                  className="transition-colors duration-200 hover:opacity-80 text-right"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {nextPost.title} →
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
        )}
      </article>

      <FooterBar />
    </div>
  );
}
