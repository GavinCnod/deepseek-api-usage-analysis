/**
 * 文件说明：应用根布局公共壳。
 *
 * 为英文无前缀路由与中文 `/zh` 镜像路由复用同一套根文档结构，
 * 并允许两棵路由树在静态导出阶段直接输出各自正确的 `<html lang>`。
 */
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/translations";
import { DataProvider } from "@/lib/DataContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import { ProjectConfigProvider } from "@/lib/ProjectConfigContext";
import { AppI18nShell } from "@/app/AppI18nShell";
import { SITE_URL } from "@/lib/site";

/** Hubot Sans 为本地 WOFF2 字体，通过 globals.css 中的 @font-face 加载 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Google Analytics 测量 ID（构建时从 .env 注入） */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * 构建根布局共享 metadata。
 *
 * 根布局仅输出全站共享字段，避免将某个具体页面的语言与 SEO 信息
 * 错误继承到其他公开路由。
 */
export function buildRootLayoutMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * 生成首屏语言兼容同步脚本。
 *
 * 虽然静态 HTML 已由 root layout 直接输出正确的 `lang`，
 * 这里仍在水合前把 locale 写回 localStorage，兼容现有客户端逻辑。
 */
function buildLocaleBootstrapScript(locale: Locale): string {
  return `
    (function () {
      try {
        document.documentElement.lang = "${locale}";
        window.localStorage.setItem("ds-locale", "${locale}");
      } catch (error) {
        // ignore storage sync errors
      }
    })();
  `;
}

interface AppRootLayoutProps {
  children: ReactNode;
  locale: Locale;
}

/**
 * 渲染应用根布局文档。
 *
 * 该组件集中挂载字体、主题、i18n、数据上下文与 GA 脚本，
 * 供多套 root layout 复用，减少重复实现。
 */
export function AppRootLayout({ children, locale }: AppRootLayoutProps) {
  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: buildLocaleBootstrapScript(locale),
          }}
        />
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AppI18nShell locale={locale}>
            <DataProvider>
              <ProjectConfigProvider>{children}</ProjectConfigProvider>
            </DataProvider>
          </AppI18nShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
