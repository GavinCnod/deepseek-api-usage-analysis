"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { buildLocalePath } from "@/lib/localeRouting";
import LanguageSwitcher from "./LanguageSwitcher";
import { deepseekProject } from "@/lib/sisterProjects";

/* ===== SVG 图标组件 ===== */

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10Z" fill="currentColor"/>
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <polygon points="12,4 16,16 12,13 8,16" fill="currentColor"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L9 19l-5 1 1-5L17 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 3h7l4 4v14H7V3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M9 13h6M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 1.5V2.5M8 13.5V14.5M2.757 3.757L3.464 4.464M12.536 11.536L13.243 12.243M1.5 8H2.5M13.5 8H14.5M2.757 12.243L3.464 11.536M12.536 4.464L13.243 3.757" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 10.5a6 6 0 0 1-7-7 6 6 0 1 0 7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
    </svg>
  );
}

/**
 * 语言切换器的静态回退占位。
 *
 * 在静态预渲染阶段为 `useSearchParams()` 提供 Suspense 包裹，
 * 同时保持标题栏左右布局稳定，避免按钮位置跳动。
 */
function LanguageSwitcherFallback() {
  return <div className="h-8 w-[76px] rounded-full" aria-hidden="true" />;
}

/* ===== 主组件 ===== */

/**
 * 共享顶部导航栏
 *
 * Apple 极简风格：左侧 Logo + 标题，右侧语言切换 + 主题切换 + ⋯ 菜单。
 * 全部导航入口（操作手册 / 隐私 / 条款 / 博客 / 作者 / 更新日志 / GitHub）
 * 统一收纳在 ⋯ 弹出的 popover 菜单中，点击外部自动关闭。
 */
export default function TitleBar() {
  const { locale, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const homeHref = buildLocalePath("/", locale);
  const guidelineHref = buildLocalePath("/guideline", locale);
  const privacyHref = buildLocalePath("/privacy", locale);
  const termsHref = buildLocalePath("/terms", locale);
  const blogHref = buildLocalePath("/blog", locale);
  const authorHref = buildLocalePath("/author", locale);
  const changelogHref = buildLocalePath("/changelog", locale);

  /** 点击菜单外部时关闭 */
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  /** 菜单项点击后关闭菜单 */
  function closeMenu() {
    setMenuOpen(false);
  }

  const navItems = [
    { href: guidelineHref, label: t.guideline.pageTitle, Icon: CompassIcon },
    { href: privacyHref, label: t.privacy.pageTitle, Icon: ShieldIcon },
    { href: termsHref, label: t.terms.pageTitle, Icon: DocumentIcon },
    { href: blogHref, label: t.blog.pageTitle, Icon: PenIcon },
    { href: authorHref, label: t.author.pageTitle, Icon: UserIcon },
    { href: changelogHref, label: t.changelog.pageTitle, Icon: ClockIcon },
  ];

  return (
    <header className="sticky top-0 z-50" style={{ background: "var(--bg)" }}>
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {/* ====== 左侧：Logo + 标题（点击回首页）====== */}
        <Link href={homeHref} className="flex items-center gap-2.5 sm:gap-3" aria-label="Home">
          <Image
            src="/ds-usage-logo.png"
            alt="DeepSeek Usage Logo"
            width={32}
            height={32}
            className="rounded-sm w-7 h-7 sm:w-8 sm:h-8"
            unoptimized
            priority
          />
          <span
            className="text-sm sm:text-base font-bold tracking-tight truncate max-w-[180px] sm:max-w-none"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
          >
            {t.app.title}
          </span>
        </Link>

        {/* ====== 右侧：语言切换 + 主题切换 + ⋯ 菜单 ====== */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Suspense fallback={<LanguageSwitcherFallback />}>
            <LanguageSwitcher />
          </Suspense>

          {/* 主题切换 */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 hover:bg-[var(--border)]"
            style={{ color: "var(--text-secondary)" }}
            title={theme === "light" ? t.theme.switchToDark : t.theme.switchToLight}
            aria-label={theme === "light" ? t.theme.switchToDark : t.theme.switchToLight}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* ⋯ 导航菜单 */}
          <div className="relative">
            <button
              ref={btnRef}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 hover:bg-[var(--border)]"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <MoreIcon />
            </button>

            {/* Apple 风格 popover 菜单 */}
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute top-full right-0 mt-2 w-60 rounded-xl py-2 shadow-diffuse-md z-50 max-h-[calc(100vh-5rem)] overflow-y-auto"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                }}
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-[var(--border)]"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <span className="flex items-center justify-center w-5 h-5">
                      <item.Icon />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}

                <div className="my-1 mx-3" style={{ borderTop: "1px solid var(--border)" }} />

                {/* GitHub（站外链接） */}
                <a
                  href={deepseekProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-[var(--border)]"
                  style={{ color: "var(--text-primary)" }}
                >
                  <span className="flex items-center justify-center w-5 h-5">
                    <GitHubIcon />
                  </span>
                  <span>GitHub</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}