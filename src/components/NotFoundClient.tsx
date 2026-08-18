/**
 * 文件说明：全局 404 的客户端渲染组件。
 *
 * 在 global-not-found 的独立 I18nProvider 内运行（未锁定 locale），
 * 因此 setLocale 可在当前页面内直接切换中英文，无需跳转路由。
 */
"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { buildLocalePath } from "@/lib/localeRouting";

/** 全局 404 内容 */
export default function NotFoundClient() {
  const { locale, setLocale, t } = useTranslation();
  const isZh = locale === "zh";

  const homeHref = buildLocalePath("/", locale);
  const blogHref = buildLocalePath("/blog", locale);
  const toolLinks = [
    { href: buildLocalePath("/deepseek-api-cost-tracker", locale), label: t.costTracker.pageTitle },
    { href: buildLocalePath("/deepseek-cache-hit-rate-analyzer", locale), label: t.cacheAnalyzer.pageTitle },
    { href: buildLocalePath("/deepseek-api-pricing-calculator", locale), label: t.pricingCalculator.pageTitle },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      <p
        className="text-6xl font-bold tracking-tighter mb-4"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
      >
        404
      </p>
      <h1
        className="text-2xl font-bold tracking-tight mb-3"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
      >
        {t.notFound.title}
      </h1>
      <p
        className="text-sm leading-relaxed text-pretty mb-8 max-w-md"
        style={{ color: "var(--text-secondary)" }}
      >
        {t.notFound.desc}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <Link
          href={homeHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90"
          style={{ background: "var(--text-primary)", color: "var(--accent-inverse)" }}
        >
          {t.notFound.backHome}
        </Link>
        <Link
          href={blogHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-80"
          style={{ color: "var(--text-primary)", border: "1px solid var(--border)" }}
        >
          {t.notFound.viewBlog}
        </Link>
        <button
          type="button"
          onClick={() => setLocale(isZh ? "en" : "zh")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-80"
          style={{ color: "var(--text-primary)", border: "1px solid var(--border)" }}
        >
          {t.notFound.switchLanguage}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs">
        <span style={{ color: "var(--text-secondary)" }}>{t.notFound.tools}</span>
        <span aria-hidden="true">·</span>
        {toolLinks.map((link, i) => (
          <span key={link.href} className="inline-flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">·</span>}
            <Link
              href={link.href}
              className="transition-colors duration-200 hover:underline underline-offset-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {link.label}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}