/**
 * 文件说明：全站自定义 404 页面（多根布局场景）。
 *
 * 本仓库同时存在 `(site)` 与 `zh` 两棵根布局树，无法用单个 `app/not-found.tsx`
 * 组合全局 404。依据 Next.js 文档，启用 `experimental.globalNotFound` 后由
 * `app/global-not-found.tsx` 输出完整 HTML 文档（含 `<html>`/`<body>`）。
 * 具体内容委托给客户端组件 NotFoundClient，支持站内中英切换。
 */
import "./globals.css";
import { Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { I18nProvider } from "@/i18n";
import NotFoundClient from "@/components/NotFoundClient";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** 404 页自身 SEO 元数据（Next 会自动附加 noindex） */
export const metadata: Metadata = {
  title: "404 — DeepSeek API Usage Analytics Dashboard",
  description:
    "The page you are looking for does not exist on the DeepSeek API Usage Analytics Dashboard.",
};

/**
 * 全局 404：完整 HTML 文档，不含页面级路由布局。
 * I18nProvider 不锁定 locale，客户端可用 setLocale 在站内切换中英文。
 */
export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <NotFoundClient />
        </I18nProvider>
      </body>
    </html>
  );
}