/**
 * 文件说明：URL 级语言路由辅助函数。
 *
 * 这里集中处理 `/zh` 前缀与 locale 推导规则，
 * 供 i18n 初始化、首屏 `<html lang>` 同步和后续路由跳转复用。
 */
import type { Locale } from "@/i18n/translations";
import { SITE_URL } from "@/lib/site";

/** 默认英文无前缀。 */
export const DEFAULT_LOCALE: Locale = "en";

/** 默认英文无前缀，中文统一使用 `/zh` 前缀。 */
export const ZH_LOCALE_PREFIX = "/zh";

/**
 * 判断当前 pathname 是否为中文镜像路由。
 */
export function isZhPathname(pathname?: string | null): boolean {
  if (!pathname) return false;

  return pathname === ZH_LOCALE_PREFIX || pathname.startsWith(`${ZH_LOCALE_PREFIX}/`);
}

/**
 * 根据当前 pathname 推导 locale。
 */
export function getLocaleFromPathname(pathname?: string | null): Locale {
  return isZhPathname(pathname) ? "zh" : "en";
}

/**
 * 移除 pathname 上的语言前缀，返回与语言无关的标准路径。
 */
export function stripLocalePrefix(pathname?: string | null): string {
  if (!pathname || pathname === "/") {
    return "/";
  }

  if (pathname === ZH_LOCALE_PREFIX) {
    return "/";
  }

  if (pathname.startsWith(`${ZH_LOCALE_PREFIX}/`)) {
    return pathname.slice(ZH_LOCALE_PREFIX.length) || "/";
  }

  return pathname;
}

/**
 * 规范化公开路由路径，保证其始终以 `/` 开头。
 */
export function normalizePublicPath(pathname?: string | null): string {
  const normalizedPath = stripLocalePrefix(pathname)?.trim() || "/";

  if (normalizedPath === "/") {
    return "/";
  }

  return normalizedPath.startsWith("/")
    ? normalizedPath
    : `/${normalizedPath}`;
}

/**
 * 根据目标语言构建公开路由路径。
 */
export function buildLocalePathname(
  locale: Locale,
  pathname: string = "/"
): string {
  const normalizedPath = normalizePublicPath(pathname);

  if (locale === DEFAULT_LOCALE) {
    return normalizedPath;
  }

  return normalizedPath === "/"
    ? ZH_LOCALE_PREFIX
    : `${ZH_LOCALE_PREFIX}${normalizedPath}`;
}

/**
 * 根据目标语言构建公开绝对 URL。
 *
 * 首页固定为 SITE_URL（不带尾部斜杠），避免规范化 URL 不一致。
 */
export function buildLocaleUrl(locale: Locale, pathname: string = "/"): string {
  const localePath = buildLocalePathname(locale, pathname);
  return localePath === "/" ? SITE_URL : `${SITE_URL}${localePath}`;
}

/**
 * 构建 canonical / hreflang 所需的语言映射。
 *
 * 附加 `x-default` 指向英文默认版本，作为语言切换/默认落地页的兜底声明。
 */
export function buildLocaleAlternates(
  pathname: string
): Record<Locale | "x-default", string> {
  return {
    en: buildLocaleUrl("en", pathname),
    zh: buildLocaleUrl("zh", pathname),
    "x-default": buildLocaleUrl("en", pathname),
  };
}

/**
 * 返回 OpenGraph 规范使用的 locale 标识。
 */
export function getOpenGraphLocale(locale: Locale): "en_US" | "zh_CN" {
  return locale === "zh" ? "zh_CN" : "en_US";
}

/**
 * 拆分路径与其查询串 / hash 后缀。
 *
 * 例如 `/blog?a=1#top` 会被拆为：
 * - pathname: `/blog`
 * - suffix: `?a=1#top`
 */
function splitPathSuffix(path: string): { pathname: string; suffix: string } {
  const match = path.match(/^([^?#]*)(.*)$/);
  return {
    pathname: match?.[1] || "/",
    suffix: match?.[2] || "",
  };
}

/**
 * 规范化传入的站内路径。
 *
 * - 空字符串归一化为 `/`
 * - 缺少前导 `/` 时自动补齐
 * - 自动移除已有的 `/zh` 前缀，便于统一重新挂载目标语言前缀
 */
function normalizeInternalPath(pathname: string): string {
  if (!pathname) return "/";

  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (withLeadingSlash === ZH_LOCALE_PREFIX) return "/";
  if (withLeadingSlash.startsWith(`${ZH_LOCALE_PREFIX}/`)) {
    return withLeadingSlash.slice(ZH_LOCALE_PREFIX.length);
  }

  return withLeadingSlash;
}

/**
 * 根据目标语言生成站内路径。
 *
 * 规则：
 * - 英文：无前缀，如 `/blog`
 * - 中文：带 `/zh` 前缀，如 `/zh/blog`
 * - 首页：英文为 `/`，中文为 `/zh`
 *
 * 该函数会保留原始路径中的查询串与 hash。
 */
export function buildLocalePath(path: string, locale: Locale): string {
  const { pathname, suffix } = splitPathSuffix(path);
  const normalizedPath = normalizeInternalPath(pathname);

  if (locale === "zh") {
    const zhPath = normalizedPath === "/" ? ZH_LOCALE_PREFIX : `${ZH_LOCALE_PREFIX}${normalizedPath}`;
    return `${zhPath}${suffix}`;
  }

  return `${normalizedPath}${suffix}`;
}

/**
 * 根据当前路径切换到目标语言对应的镜像路径。
 */
export function switchLocalePath(path: string, targetLocale: Locale): string {
  return buildLocalePath(path, targetLocale);
}
