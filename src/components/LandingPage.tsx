"use client";

import { useTranslation } from "@/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import TitleBar from "./TitleBar";
import FooterBar from "./FooterBar";
import DropZone from "./DropZone";
import ErrorDisplay from "./ErrorDisplay";
import LandingContent from "./LandingContent";
import AffiliateWall from "./AffiliateWall";
import { buildLocalePath } from "@/lib/localeRouting";

/**
 * Landing 页面 - 上传前的完整落地页
 *
 * Apple 极简风格，包含以下区域：
 * - Hero（短版标题 + 副标题）
 * - 上传区（DropZone + ErrorDisplay）
 * - 使用说明（3 步骤，编号圆圈 + 悬停微交互）
 * - 常见问题（手风琴折叠，支持无障碍键盘操作）
 * - 关于我们
 *
 * 滚动渐显动画：每个 section 进入视口时通过 Intersection Observer 触发淡入效果。
 * 尊重 prefers-reduced-motion 偏好（CSS 层面全局处理）。
 */
export default function LandingPage() {
  const { locale, t } = useTranslation();
  const { theme } = useTheme();
  const guidelineHref = buildLocalePath("/guideline", locale);
  const authorHref = buildLocalePath("/author", locale);
  const changelogHref = buildLocalePath("/changelog", locale);

  // 主题感知的背景装饰图
  const isDark = theme === "dark";
  const csvBg = isDark
    ? "/landing/notion_sketch_csv_dark.png"
    : "/landing/notion_sketch_csv_light.png";
  const chartBg = isDark
    ? "/landing/notion_sketch_chart_dark.png"
    : "/landing/notion_sketch_chart_light.png";

  // Hero + 上传区整体容器的背景装饰样式
  // 左侧 CSV 主题图 + 右侧图表主题图，透明 PNG，不覆盖原背景色
  const bgDecorationStyle: React.CSSProperties = {
    backgroundImage: `url(${csvBg}), url(${chartBg})`,
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundPosition: "left 50px top 70px, right 50px top 70px",
    backgroundSize: "auto 60%, auto 60%",
  };

  // QA 手风琴状态
  const [openQa, setOpenQa] = useState<number | null>(null);

  /** 切换 QA 项的展开/折叠 */
  function toggleQa(index: number) {
    setOpenQa((prev) => (prev === index ? null : index));
  }

  // 邮箱复制状态
  const [emailCopied, setEmailCopied] = useState(false);
  // 反爬虫：运行时动态拼接邮箱
  const emailAddress = "hello" + "@" + "mindrose.xyz";

  /** 将邮箱复制到剪贴板 */
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      // 降级：用传统的 textarea 兜底
      const textarea = document.createElement("textarea");
      textarea.value = emailAddress;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  }

  // 滚动渐显动画（Intersection Observer）
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -48px 0px" }
    );

    const currentRefs = sectionRefs.current.filter(Boolean) as HTMLElement[];
    currentRefs.forEach((el) => observer.observe(el));

    return () => {
      currentRefs.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // 步骤数据
  const steps = [
    {
      num: "1",
      title: t.landing.howItWorksStep1Title,
      desc: t.landing.howItWorksStep1Desc,
    },
    {
      num: "2",
      title: t.landing.howItWorksStep2Title,
      desc: t.landing.howItWorksStep2Desc,
    },
    {
      num: "3",
      title: t.landing.howItWorksStep3Title,
      desc: t.landing.howItWorksStep3Desc,
    },
  ];

  // QA 数据
  const qaItems = [
    { q: t.landing.qaQ1, a: t.landing.qaA1 },
    { q: t.landing.qaQ2, a: t.landing.qaA2 },
    { q: t.landing.qaQ3, a: t.landing.qaA3 },
    { q: t.landing.qaQ4, a: t.landing.qaA4 },
    { q: t.landing.qaQ5, a: t.landing.qaA5 },
    { q: t.landing.qaQ6, a: t.landing.qaA6 },
    { q: t.landing.qaQ7, a: t.landing.qaA7 },
    { q: t.landing.qaQ8, a: t.landing.qaA8 },
    { q: t.landing.qaQ9, a: t.landing.qaA9 },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <TitleBar />

      {/* 服务端渲染的 <noscript> 内容：确保爬虫在不执行 JS 时也能抓取文字 */}
      <LandingContent />

      <main className="max-w-6xl mx-auto px-6">
        {/* Hero + 上传区整体容器（装饰图作为背景层） */}
        <div className="relative overflow-hidden">
          {/* 装饰背景层：CSV 主题图（左）+ 图表主题图（右），移动端隐藏 */}
          <div
            className="absolute inset-0 pointer-events-none select-none reveal-section hidden md:block"
            style={bgDecorationStyle}
            ref={(el) => {
              sectionRefs.current[8] = el;
            }}
            aria-hidden="true"
          />

          {/* Hero - 短版，非全屏居中 */}
          <section
            className="relative z-10 pt-16 pb-10 text-center reveal-section"
            ref={(el) => {
              sectionRefs.current[0] = el;
            }}
          >
            <h1
              className="text-3xl font-bold tracking-tight mb-4 text-pretty"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
              }}
              translate="no"
            >
              {t.app.title}
            </h1>
            <p
              className="text-lg leading-relaxed max-w-xl mx-auto text-pretty mb-2"
              style={{ color: "var(--text-primary)", fontWeight: 500 }}
            >
              {locale === "zh" ? "免费 DeepSeek API 费用追踪器" : "Free DeepSeek API Cost Tracker"}
            </p>
            <p
              className="text-base leading-relaxed max-w-xl mx-auto text-pretty"
              style={{ color: "var(--text-secondary)" }}
            >
              {t.app.subtitle}
            </p>
          </section>

          {/* 上传区 */}
          <section
            className="relative z-10 pb-12 reveal-section"
            ref={(el) => {
              sectionRefs.current[1] = el;
            }}
          >
            <DropZone />
            <ErrorDisplay />
          </section>
        </div>

        {/* ============================================================ */}
        {/* 使用说明                                                       */}
        {/* ============================================================ */}
        <hr className="reveal-section" style={{ borderColor: "var(--border)" }} />
        <section
          id="how-it-works"
          className="pt-10 pb-12 reveal-section"
          style={{ contentVisibility: "auto" }}
          ref={(el) => {
            sectionRefs.current[2] = el;
          }}
        >
          <h2
            className="text-[11px] font-semibold uppercase tracking-widest mb-8 text-center text-pretty"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.landing.howItWorksTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.num}
                className="text-center group cursor-default"
              >
                {/* 编号圆圈 */}
                <div
                  className="mx-auto mb-4 w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200"
                  style={{
                    background: "var(--bg-surface-hover)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-sm font-semibold mb-2 transition-colors duration-200"
                  style={{ color: "var(--text-primary)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-xs leading-relaxed transition-colors duration-200 text-pretty"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 操作指南入口 — 步骤下方居中链接 */}
          <div className="mt-8 text-center">
            <Link
              href={guidelineHref}
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              {t.guideline.viewGuide}
            </Link>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 工具系列入口                                                 */}
        {/* ============================================================ */}
        <hr className="reveal-section" style={{ borderColor: "var(--border)" }} />
        <section
          id="tools"
          className="pt-10 pb-12 reveal-section"
          style={{ contentVisibility: "auto" }}
          ref={(el) => {
            sectionRefs.current[3] = el;
          }}
        >
          <h2
            className="text-[11px] font-semibold uppercase tracking-widest mb-8 text-center text-pretty"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.landing.toolsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                href: buildLocalePath("/deepseek-api-cost-tracker", locale),
                title: t.costTracker.pageTitle,
                desc: t.landing.toolsCostTrackerDesc,
              },
              {
                href: buildLocalePath("/deepseek-cache-hit-rate-analyzer", locale),
                title: t.cacheAnalyzer.pageTitle,
                desc: t.landing.toolsCacheDesc,
              },
              {
                href: buildLocalePath("/deepseek-api-pricing-calculator", locale),
                title: t.pricingCalculator.pageTitle,
                desc: t.landing.toolsCalculatorDesc,
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="block p-5 rounded-subtle transition-all duration-200 hover:opacity-90"
                style={{ border: "1px solid var(--border)" }}
              >
                <h3
                  className="text-sm font-semibold mb-1 transition-colors duration-200"
                  style={{ color: "var(--text-primary)" }}
                >
                  {tool.title}
                </h3>
                <p
                  className="text-xs leading-relaxed text-pretty"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {tool.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 推荐工具（商业化模块）                                          */}
        {/* ============================================================ */}
        <hr className="reveal-section" style={{ borderColor: "var(--border)" }} />
        <section
          className="pt-10 pb-16 reveal-section"
          style={{ contentVisibility: "auto" }}
          ref={(el) => {
            sectionRefs.current[4] = el;
          }}
        >
          <h2
            className="text-sm font-semibold mb-3 text-center"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            {t.costTracker.recommendedUsingTools}
          </h2>
          <p
            className="text-xs leading-relaxed text-pretty mb-4 text-center"
            style={{ color: "var(--text-tertiary)" }}
          >
            {t.costTracker.recommendedUsingDes}
          </p>
          <AffiliateWall ids={["opencode-go","vultr", "railway", "tencent-cloud", "silicon-flow", "warp"]} />
        </section>

        {/* ============================================================ */}
        {/* 常见问题（手风琴）                                                */}
        {/* ============================================================ */}
        <hr className="reveal-section" style={{ borderColor: "var(--border)" }} />
        <section
          id="faq"
          className="pt-10 pb-12 reveal-section"
          style={{ contentVisibility: "auto" }}
          ref={(el) => {
            sectionRefs.current[5] = el;
          }}
        >
          <h2
            className="text-[11px] font-semibold uppercase tracking-widest mb-8 text-center text-pretty"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.landing.qaTitle}
          </h2>
          <div className="space-y-1 max-w-2xl mx-auto">
            {qaItems.map((item, i) => {
              const isOpen = openQa === i;
              return (
                <div
                  key={i}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  {/* 问题行：点击展开/折叠 */}
                  <button
                    type="button"
                    onClick={() => toggleQa(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleQa(i);
                      }
                    }}
                    aria-expanded={isOpen}
                    aria-controls={`qa-answer-${i}`}
                    className="w-full text-left py-4 flex items-center justify-between gap-3
                               transition-colors duration-200
                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                               rounded-subtle focus-visible:outline-[var(--accent)]"
                  >
                    <h3
                      className="text-sm font-semibold text-pretty"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.q}
                    </h3>
                    {/* 折叠箭头 */}
                    <span
                      className="shrink-0 text-base transition-transform duration-300 ease-out"
                      style={{
                        color: "var(--text-tertiary)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                      aria-hidden="true"
                    >
                      &#9662;
                    </span>
                  </button>

                  {/* 答案面板（inline style 驱动折叠过渡） */}
                  <div
                    id={`qa-answer-${i}`}
                    role="region"
                    aria-labelledby={`qa-question-${i}`}
                    style={{
                      overflow: "hidden",
                      maxHeight: isOpen ? "20rem" : "0",
                      opacity: isOpen ? 1 : 0,
                      marginTop: isOpen ? "0.5rem" : "0",
                      transition:
                        "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out, margin-top 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <p
                      className="text-sm leading-relaxed pb-4 text-pretty"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 关于我们                                                       */}
        {/* ============================================================ */}
        <hr className="reveal-section" style={{ borderColor: "var(--border)" }} />
        <section
          id="about"
          className="pt-10 pb-16 reveal-section"
          style={{ contentVisibility: "auto" }}
          ref={(el) => {
            sectionRefs.current[6] = el;
          }}
        >
          <h2
            className="text-[11px] font-semibold uppercase tracking-widest mb-12 text-center text-pretty"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.landing.aboutSectionTitle}
          </h2>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* 1. 为什么开发这个工具 */}
            <div>
              <h3
                className="text-sm font-semibold mb-3 text-pretty"
                style={{ color: "var(--text-primary)" }}
              >
                {t.landing.aboutWhyTitle}
              </h3>
              <p
                className="text-sm leading-relaxed text-pretty"
                style={{ color: "var(--text-secondary)", whiteSpace: "pre-line" }}
              >
                {t.landing.aboutWhyDesc}
              </p>
            </div>

            {/* 分割线 */}
            <hr style={{ borderColor: "var(--border)", borderStyle: "dashed" }} />

            {/* 2. 极致的隐私与技术架构 */}
            <div>
              <h3
                className="text-sm font-semibold mb-3 text-pretty"
                style={{ color: "var(--text-primary)" }}
              >
                {t.landing.aboutPrivacyTitle}
              </h3>
              <p
                className="text-sm leading-relaxed text-pretty"
                style={{ color: "var(--text-secondary)", whiteSpace: "pre-line" }}
              >
                {t.landing.aboutPrivacyDesc}
              </p>
            </div>

            {/* 分割线 */}
            <hr style={{ borderColor: "var(--border)", borderStyle: "dashed" }} />

            {/* 3. 关于 MindRose */}
            <div>
              <h3
                className="text-sm font-semibold mb-3 text-pretty"
                style={{ color: "var(--text-primary)" }}
              >
                {t.landing.aboutMindRoseTitle}
              </h3>
              <p
                className="text-sm leading-relaxed text-pretty"
                style={{ color: "var(--text-secondary)", whiteSpace: "pre-line" }}
              >
                {t.landing.aboutMindRoseDesc}
              </p>
            </div>

            {/* 分割线 */}
            <hr style={{ borderColor: "var(--border)", borderStyle: "dashed" }} />

            {/* 4. 商业合作 */}
            <div>
              <h3
                className="text-sm font-semibold mb-3 text-pretty"
                style={{ color: "var(--text-primary)"}}
              >
                {t.landing.aboutContactTitle}
              </h3>
              <p
                className="text-sm leading-relaxed mb-3 text-pretty"
                style={{ color: "var(--text-secondary)", whiteSpace: "pre-line" }}
              >
                {t.landing.aboutContactDesc}
              </p>
              <p
                className="text-sm leading-relaxed mb-5 text-pretty"
                style={{ color: "var(--text-secondary)", whiteSpace: "pre-line" }}
              >
                {t.landing.aboutContactService}
              </p>

              {/* 联系方式 CTA */}
              <div className="inline-flex items-center gap-3">
                <a
                  href={"mailto:" + emailAddress}
                  className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
                  style={{ color: "var(--text-primary)" }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    {t.landing.aboutContactCTA}
                  </span>{" "}
                  {emailAddress}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="relative shrink-0 flex items-center justify-center w-7 h-7 rounded-subtle
                             transition-all duration-200 hover:bg-[var(--bg-surface-hover)]"
                  style={{ color: "var(--text-tertiary)" }}
                  aria-label={emailCopied ? "Copied" : "Copy email"}
                >
                  {emailCopied ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 分割线 */}
            <hr style={{ borderColor: "var(--border)", borderStyle: "dashed" }} />

            {/* 社交链接 */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* 作者页 */}
              <Link
                href={authorHref}
                className="inline-flex items-center gap-2 text-sm transition-colors duration-200
                           rounded-subtle px-3 py-1.5 hover:bg-[var(--bg-surface-hover)]"
                style={{
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4Z"
                    fill="currentColor"
                  />
                </svg>
                {t.author.pageTitle}
              </Link>

              {/* GitHub */}
              <a
                href="https://github.com/GavinCnod/deepseek-api-usage-analysis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm transition-colors duration-200
                           rounded-subtle px-3 py-1.5 hover:bg-[var(--bg-surface-hover)]"
                style={{
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10Z"
                    fill="currentColor"
                  />
                </svg>
                {t.landing.aboutGitHubLabel}
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/gavinchensongwen3188536a/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm transition-colors duration-200
                           rounded-subtle px-3 py-1.5 hover:bg-[var(--bg-surface-hover)]"
                style={{
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    fill="currentColor"
                  />
                </svg>
                {t.landing.aboutLinkedInLabel}
              </a>

              {/* MindRose 官网 */}
              <a
                href="https://www.mindrose.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm transition-colors duration-200
                           rounded-subtle px-3 py-1.5 hover:bg-[var(--bg-surface-hover)]"
                style={{
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                    fill="currentColor"
                  />
                </svg>
                {t.landing.aboutMindRoseLabel}
              </a>
            </div>

            {/* 更新日志入口 */}
            <div className="text-center mt-8">
              <Link
                href={changelogHref}
                className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <polyline
                    points="12,6 12,12 16,14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t.changelog.viewChangelog}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterBar
        animate
        sectionRef={(el) => {
          sectionRefs.current[7] = el;
        }}
      />
    </div>
  );
}
