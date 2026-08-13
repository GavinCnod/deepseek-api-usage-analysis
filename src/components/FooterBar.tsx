"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { buildLocalePath } from "@/lib/localeRouting";
import { agnesProject, deepseekProject, TOOL_SERIES_NAME } from "@/lib/sisterProjects";

/** 应用版本号，与 package.json 保持同步 */
const APP_VERSION = "0.7.0";

/**
 * FooterBar 属性
 *
 * @param animate - 是否启用渐显动画（Landing 页使用）
 * @param sectionRef - 用于 IntersectionObserver 注册的回调 ref
 */
interface FooterBarProps {
  animate?: boolean;
  sectionRef?: (el: HTMLDivElement | null) => void;
}

/**
 * 共享页脚组件
 *
 * Apple 极简风格 — 细横线分割 + 居中文字 + GitHub 链接 + 版本号。
 * 支持移动端自动换行，通过 flex-wrap 确保小屏幕友好显示。
 * 可选 reveal-section 渐显动画，专用于 Landing 页面。
 */
export default function FooterBar({ animate = false, sectionRef }: FooterBarProps) {
  const { locale, t } = useTranslation();
  const guidelineHref = buildLocalePath("/guideline", locale);
  const privacyHref = buildLocalePath("/privacy", locale);
  const termsHref = buildLocalePath("/terms", locale);
  const blogHref = buildLocalePath("/blog", locale);
  const authorHref = buildLocalePath("/author", locale);
  const changelogHref = buildLocalePath("/changelog", locale);

  const content = (
    <footer
      className="max-w-6xl mx-auto px-6 pt-6 pb-8 text-center"
      style={{ color: "var(--text-tertiary)" }}
    >
      <hr style={{ borderColor: "var(--border)", marginBottom: "1.5rem" }} />

      <div className="mb-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs">
        <span style={{ color: "var(--text-secondary)" }}>
          {t.footer.relatedTools}
        </span>
        <span aria-hidden="true">·</span>
        <a
          href={agnesProject.trackedSiteUrls.footer}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200 hover:underline underline-offset-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {t.footer.sisterProject}
        </a>
        <span aria-hidden="true">·</span>
        <span>{TOOL_SERIES_NAME}</span>
      </div>

      {/* 使用 flex-wrap 确保移动端文字换行时保持居中 */}
      <div className="flex flex-wrap items-center justify-center gap-x-1.5 text-xs">
        <span>{t.footer.text}</span>
        <Link
          href={guidelineHref}
          className="transition-colors duration-200 hover:underline underline-offset-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {t.guideline.pageTitle}
        </Link>
        <span aria-hidden="true">·</span>
        <Link
          href={privacyHref}
          className="transition-colors duration-200 hover:underline underline-offset-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {t.privacy.pageTitle}
        </Link>
        <span aria-hidden="true">·</span>
        <Link
          href={termsHref}
          className="transition-colors duration-200 hover:underline underline-offset-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {t.terms.pageTitle}
        </Link>
        <span aria-hidden="true">·</span>
        <Link
          href={blogHref}
          className="transition-colors duration-200 hover:underline underline-offset-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {t.blog.pageTitle}
        </Link>
        <span aria-hidden="true">·</span>
        <Link
          href={authorHref}
          className="transition-colors duration-200 hover:underline underline-offset-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {t.author.pageTitle}
        </Link>
        <span aria-hidden="true">·</span>
        <Link
          href={changelogHref}
          className="transition-colors duration-200 hover:underline underline-offset-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {t.changelog.pageTitle}
        </Link>
        <span aria-hidden="true">·</span>
        <a
          href={deepseekProject.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200 hover:underline underline-offset-2"
          style={{ color: "var(--text-secondary)" }}
          aria-label="GitHub repository"
        >
          GitHub
        </a>
        <span aria-hidden="true">·</span>
        <span>
          {t.footer.version} v{APP_VERSION}
        </span>
      </div>
    </footer>
  );

  /* 当启用渐显动画时，包一层 reveal-section 容器供 IntersectionObserver 触发 */
  if (animate) {
    return (
      <div className="reveal-section" ref={sectionRef}>
        {content}
      </div>
    );
  }

  return content;
}
