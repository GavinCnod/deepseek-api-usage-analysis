/**
 * sitemap.xml — 静态站点地图
 *
 * 遵循 Next.js 16 App Router 约定：导出默认函数返回 MetadataRoute.Sitemap。
 * 构建时自动生成 /sitemap.xml，与 static export (output: "export") 兼容。
 * 当前实现为每个公开页面同时输出：
 * - 英文无前缀 URL
 * - 中文 `/zh` 镜像 URL
 *
 * 并为两种语言条目都补齐 `alternates.languages`，以便搜索引擎识别双语镜像关系。
 */
import type { MetadataRoute } from "next";
import { buildLocaleAlternates, buildLocaleUrl } from "@/lib/localeRouting";

/** 静态导出兼容：标记此路由在构建时静态生成 */
export const dynamic = "force-static";

/** sitemap 路由配置项。 */
interface SitemapRouteConfig {
  pathname: string;
  lastModified: Date;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}

/** 构建时统一的当前构建日期。 */
const buildDate = new Date();

/** 公开页面路由清单。 */
const ROUTES: SitemapRouteConfig[] = [
  {
    pathname: "/",
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    pathname: "/guideline",
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    pathname: "/privacy",
    lastModified: new Date("2026-06-08"),
    changeFrequency: "yearly",
    priority: 0.5,
  },
  {
    pathname: "/terms",
    lastModified: new Date("2026-06-08"),
    changeFrequency: "yearly",
    priority: 0.5,
  },
  {
    pathname: "/changelog",
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    pathname: "/deepseek-api-cost-tracker",
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    pathname: "/deepseek-cache-hit-rate-analyzer",
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    pathname: "/deepseek-api-pricing-calculator",
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    pathname: "/blog",
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    pathname: "/author",
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    pathname: "/blog/deepseek-context-caching-guide",
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    pathname: "/blog/deepseek-cost-optimization-tools",
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    pathname: "/blog/openai-claude-vs-deepseek-cost-comparison",
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    pathname: "/blog/opencode-go-cheapest-deepseek-v4-flash",
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    pathname: "/blog/deepseek-csv-export-format-changed-aug-2026",
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.6,
  },
];

/**
 * 为单个公开路径生成英文与中文的双语 sitemap 条目。
 */
function buildLocalizedEntries(
  route: SitemapRouteConfig
): MetadataRoute.Sitemap {
  const alternates = {
    languages: buildLocaleAlternates(route.pathname),
  };

  return [
    {
      url: buildLocaleUrl("en", route.pathname),
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates,
    },
    {
      url: buildLocaleUrl("zh", route.pathname),
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates,
    },
  ];
}

/** 构建时生成 sitemap.xml 条目，lastModified 按实际更新频率差异化设置 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap(buildLocalizedEntries);
}
