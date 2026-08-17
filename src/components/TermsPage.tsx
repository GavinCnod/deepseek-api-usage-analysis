"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { buildLocalePath, buildLocaleUrl } from "@/lib/localeRouting";
import TitleBar from "./TitleBar";
import FooterBar from "./FooterBar";
import RecommendedToolsSection from "./RecommendedToolsSection";
import { useMemo } from "react";

/* ================================================================== */
/*  使用条款内容区块类型                                                  */
/* ================================================================== */

interface ContentBlock {
  title: string;
  content: string;
  /** 可选的补充说明（小字，用于许可证说明等） */
  note?: string;
  /** 是否显示 "审阅源码" 链接（指向 GitHub） */
  reviewLink?: boolean;
}

/* ================================================================== */
/*  TermsPage 组件                                                      */
/* ================================================================== */

/**
 * 使用条款页面
 *
 * Apple 极简风格 — 白纸黑字的法律文本页面，结构与 /privacy 一致：
 * - TitleBar + 返回首页 + 主内容区 + FooterBar
 * - 支持中英双语切换（通过 useTranslation hook）
 * - 支持浅色/深色双主题（CSS 变量驱动）
 */
export function TermsPage() {
  const { locale, t } = useTranslation();
  const homeHref = buildLocalePath("/", locale);

  /** 使用条款页 JSON-LD 结构化数据 */
  const termsJsonLd = useMemo(() => {
    const isZh = locale === "zh";
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: isZh
        ? "使用条款 — DeepSeek API 用量分析仪表盘"
        : "Terms of Use — DeepSeek API Usage Analytics Dashboard",
      description: isZh
        ? "DeepSeek API 用量分析仪表盘使用条款。按现状提供的开源软件，无担保，与 DeepSeek 无关。由 Gavin Chen 和 MindRose 团队开发维护。"
        : "Terms of Use for the DeepSeek API Usage Analytics Dashboard. As-is open source software under the MIT License, no warranty, not affiliated with DeepSeek. Built by Gavin Chen & MindRose Team.",
      url: buildLocaleUrl(locale, "/terms"),
      inLanguage: locale,
      about: {
        "@type": "Thing",
        name: isZh ? "使用条款" : "Terms of Use",
      },
      isPartOf: {
        "@type": "WebSite",
        name: "DeepSeek API Usage Analytics Dashboard",
        url: buildLocaleUrl(locale, "/"),
      },
    };
  }, [locale]);

  /** 使用条款各章节 */
  const sections: ContentBlock[] = [
    {
      title: t.terms.asIsTitle,
      content: t.terms.asIsDesc,
    },
    {
      title: t.terms.noWarrantyTitle,
      content: t.terms.noWarrantyDesc,
    },
    {
      title: t.terms.notAffiliatedTitle,
      content: t.terms.notAffiliatedDesc,
    },
    {
      title: t.terms.userDataTitle,
      content: t.terms.userDataDesc,
    },
    {
      title: t.terms.openSourceTitle,
      content: t.terms.openSourceDesc,
      note: t.terms.openSourceLicense,
      reviewLink: true,
    },
    {
      title: t.terms.limitationTitle,
      content: t.terms.limitationDesc,
    },
    {
      title: t.terms.changesTitle,
      content: t.terms.changesDesc,
    },
    {
      title: t.terms.contactTitle,
      content: t.terms.contactDesc,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(termsJsonLd),
        }}
      />
      <TitleBar />

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* 返回首页 */}
        <Link
          href={homeHref}
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
          {t.guideline.backToHome}
        </Link>

        {/* 页面标题 */}
        <h1
          className="text-2xl font-bold tracking-tight mb-2"
          style={{
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
          }}
          translate="no"
        >
          {t.terms.pageTitle}
        </h1>

        {/* 生效日期 */}
        <p
          className="text-xs mb-10"
          style={{ color: "var(--text-tertiary)" }}
        >
          {t.terms.effectiveDate}
        </p>

        {/* 引言 */}
        <p
          className="text-sm leading-relaxed mb-10 text-pretty"
          style={{ color: "var(--text-secondary)" }}
        >
          {t.terms.intro}
        </p>

        {/* 各章节 */}
        {sections.map((section, idx) => (
          <section key={idx} className="mb-10">
            <h2
              className="text-base font-semibold mb-3"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              {section.title}
            </h2>

            <p
              className="text-sm leading-relaxed text-pretty"
              style={{ color: "var(--text-secondary)" }}
            >
              {section.content}
            </p>

            {/* 补充说明（许可证信息等） */}
            {section.note && (
              <p
                className="text-xs leading-relaxed text-pretty mt-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                {section.note}
              </p>
            )}

            {/* 源码审查链接 */}
            {section.reviewLink && (
              <a
                href="https://github.com/GavinCnod/deepseek-api-usage-analysis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs mt-2 underline underline-offset-2 transition-colors duration-200"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t.terms.reviewSourceCode}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 17L17 7M17 7H7m10 0v10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </section>
        ))}

        {/* 底部细线分割 */}
        <hr
          className="my-10"
          style={{ borderColor: "var(--border)" }}
        />

        {/* GitHub 链接 */}
        <p
          className="text-xs"
          style={{ color: "var(--text-tertiary)" }}
        >
          <a
            href="https://github.com/GavinCnod/deepseek-api-usage-analysis"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors duration-200"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.terms.githubLabel}
          </a>
        </p>
      </div>

      <RecommendedToolsSection maxWidth="3xl" />
      <FooterBar />
    </div>
  );
}
