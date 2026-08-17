"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { buildLocalePath, buildLocaleUrl } from "@/lib/localeRouting";
import TitleBar from "./TitleBar";
import FooterBar from "./FooterBar";
import RecommendedToolsSection from "./RecommendedToolsSection";

import { useMemo } from "react";

/* ================================================================== */
/*  隐私政策内容区块类型                                                  */
/* ================================================================== */

interface ContentBlock {
  title: string;
  content: string;
  /** 可选的补充说明（小字，用于 GA 退出说明等） */
  note?: string;
  /** 是否显示 "审阅源码" 链接（指向 GitHub） */
  reviewLink?: boolean;
}

/* ================================================================== */
/*  PrivacyPage 组件                                                    */
/* ================================================================== */

/**
 * 隐私政策页面
 *
 * Apple 极简风格 — 白纸黑字的法律文本页面，结构与 /guideline 一致：
 * - TitleBar + 返回首页 + 主内容区 + FooterBar
 * - 支持中英双语切换（通过 useTranslation hook）
 * - 支持浅色/深色双主题（CSS 变量驱动）
 */
export function PrivacyPage() {
  const { locale, t } = useTranslation();
  const homeHref = buildLocalePath("/", locale);

  /** 隐私政策页 JSON-LD 结构化数据 */
  const privacyJsonLd = useMemo(() => {
    const isZh = locale === "zh";
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: isZh
        ? "隐私政策 — DeepSeek API 用量分析仪表盘"
        : "Privacy Policy — DeepSeek API Usage Analytics Dashboard",
      description: isZh
        ? "DeepSeek API 用量分析仪表盘隐私政策。了解我们如何处理您的数据：所有 CSV 解析均在本地浏览器完成，不上传任何数据，Google Analytics 可选启用。"
        : "Privacy Policy for the DeepSeek API Usage Analytics Dashboard. Learn how we handle your data: all CSV parsing runs locally in your browser, no data is uploaded, and Google Analytics is opt-in only.",
      url: buildLocaleUrl(locale, "/privacy"),
      inLanguage: locale,
      about: {
        "@type": "Thing",
        name: isZh ? "隐私政策" : "Privacy Policy",
      },
      isPartOf: {
        "@type": "WebSite",
        name: "DeepSeek API Usage Analytics Dashboard",
        url: buildLocaleUrl(locale, "/"),
      },
    };
  }, [locale]);

  /** 隐私政策各章节 */
  const sections: ContentBlock[] = [
    {
      title: t.privacy.noCollectionTitle,
      content: t.privacy.noCollectionDesc,
      reviewLink: true,
    },
    {
      title: t.privacy.localProcessingTitle,
      content: t.privacy.localProcessingDesc,
      reviewLink: true,
    },
    {
      title: t.privacy.analyticsTitle,
      content: t.privacy.analyticsDesc,
      note: t.privacy.analyticsOptOut + " " + t.privacy.gaIdNote,
    },
    {
      title: t.privacy.thirdPartyTitle,
      content: t.privacy.thirdPartyDesc,
    },
    {
      title: t.privacy.securityTitle,
      content: t.privacy.securityDesc,
    },
    {
      title: t.privacy.changesTitle,
      content: t.privacy.changesDesc,
    },
    {
      title: t.privacy.contactTitle,
      content: t.privacy.contactDesc,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(privacyJsonLd),
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
          {t.privacy.pageTitle}
        </h1>

        {/* 生效日期 */}
        <p
          className="text-xs mb-10"
          style={{ color: "var(--text-tertiary)" }}
        >
          {t.privacy.effectiveDate}
        </p>

        {/* 引言 */}
        <p
          className="text-sm leading-relaxed mb-10 text-pretty"
          style={{ color: "var(--text-secondary)" }}
        >
          {t.privacy.intro}
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

            {/* 补充说明（如 GA 退出方式） */}
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
                {t.privacy.reviewSourceCode}
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
            {t.privacy.githubLabel}
          </a>
        </p>
      </div>

      <RecommendedToolsSection maxWidth="3xl" />
      <FooterBar />
    </div>
  );
}
