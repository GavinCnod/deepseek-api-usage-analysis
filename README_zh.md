# DeepSeek API 用量分析仪表盘 & 费用追踪器

<p align="center">
  <img src="public/ds-usage-logo.png" alt="Logo" width="128" />
</p>

一款纯浏览器端的 DeepSeek API 用量分析仪表盘。将月度 CSV 导出文件拖拽到页面，即刻获取费用图表、各 Key 用量明细、缓存分析和用量趋势 — 所有数据均在浏览器本地处理。无需服务器、无需上传、无需注册。

> [English version](README.md)

## 姊妹项目

如果你也在分析 Agnes AI 的调用与成本，可以继续查看同一产品矩阵下的配套开源项目：

- GitHub：[Agnes AI Usage Analytics Repo](https://github.com/GavinCnod/agnes-api-usage-analysis)
- 网站：[Agnes AI Usage Analytics](https://agnes-usage.xyz)

## 使用方式

1. 前往 [DeepSeek 平台](https://platform.deepseek.com) → 用量 → 导出月度数据
2. 每月下载一个 ZIP 压缩包，内含 `amount-{年份}-{月份}.csv` 和 `cost-{年份}-{月份}.csv`（新导出为日期区间式命名，如 `amount-2026-08-01_2026-08-17.csv`，两种命名均支持）
3. 将 ZIP 文件（或解压后的 CSV）拖拽到仪表盘 — 多个月份自动配对
4. 图表即刻渲染 — 数据不会离开你的浏览器

![仪表盘总览](public/guideline/01-Ds-Api-Usage-Dashboard-Overview-cn.png)

## 功能特性

- **总览** — KPI 大数字展示（费用、Token 数、缓存命中率、活跃 Key）+ 每日费用柱状图 + 各 Key 费用环形图
- **按 Key** — 详细表格，展示每个 Key 的 Token 数、费用、颜色标记的缓存命中率（绿色 > 40% / 琥珀色 20–40% / 红色 < 20%）、请求次数及内嵌用量条
- **缓存** — 大字号命中率展示、每日缓存命中率趋势折线图、各 Key 缓存命中/未命中堆叠柱状图（含命中率标签和 tooltip）
- **趋势** — 可切换多指标折线图（费用 / Token / 缓存命中率 / 请求次数），顶部大数字动态跟随指标切换
- **深色模式** — 完整的浅色/深色双主题，基于 CSS 自定义属性；自动检测系统偏好，手动切换持久化至 localStorage
- **多语言** — 英文和中文，根据浏览器语言自动检测；手动切换持久化至 localStorage
- **按项目** — 自定义项目分组标签页：拖拽 API Key 到用户自定义项目中，按项目汇总费用/Token/缓存数据，配置持久化至 localStorage；齿轮图标打开拖拽式配置弹窗，支持键盘操作下拉菜单
- **模型筛选** — 分段控件胶囊按钮，按模型过滤所有视图；仅在检测到 ≥2 个模型时显示
- **一键复制** — 可复用的 CopyButton 组件，在 KeyView、ProjectView 和 OverviewView 中一键复制费用数值；悬浮提示含国际化成功消息
- **社交媒体分享卡片** — 为每个仪表盘标签页（总览 / 项目 / Key / 缓存 / 趋势）生成 1200×630 信息图分享图片。支持自定义「From XXX」署名、可选引用文案、各标签页专属 ECharts 迷你图表、deepseek-usage.xyz 二维码、应用 Logo 水印、一键复制到剪贴板（直接粘贴至微信 / 飞书 / 钉钉）以及 PNG 下载。
- **上传安全** — 单文件 50MB 大小限制，防止 ZIP 炸弹攻击；用户可见的错误提示及专属 FAQ 条目
- **多月支持** — 一次拖入多个月份文件；根据文件名模式自动配对并拼接（兼容 `amount-{年份}-{月份}.csv` 与日期区间式 `amount-2026-08-01_2026-08-17.csv` 两种命名）。同时支持 ZIP 压缩包直接上传 — 无需解压，直接将 DeepSeek 平台导出的 ZIP 文件拖入页面即可。
- **Apple 极简设计** — 冷灰纸质感底、大量留白、「无卡片」通栏模块布局、细横线分割、5rem Hero 大数字、弥散阴影
- **100% 隐私** — 所有 CSV 解析（Papa Parse）、ZIP 解压（JSZip）和费用计算均在浏览器客户端完成；项目配置仅存储于浏览器的 localStorage 中
- **SEO 优化** — 服务端渲染元数据（规范 URL、OpenGraph 含 `alternateLocale` en/zh、Twitter 卡片）、JSON-LD 结构化数据（`SoftwareApplication` + `FAQPage` + `BreadcrumbList` + `Organization`，双语，通过可复用 `<JsonLd />` 组件渲染）、robots.txt + sitemap.xml（每路由 en + zh 双语条目）、`<noscript>` 爬虫回退内容、支持锚点链接的落地页板块、`llms.txt` 面向 LLM 的站点描述
- **姊妹项目交叉链接** — 集中化的 `sisterProjects.ts` 模块管理「API Usage Analyzer Series」产品矩阵中两个姐妹工具（DeepSeek + Agnes）之间的交叉链接。所有跨站 URL 均通过统一配置来源流转，并附带 UTM 追踪（`utm_source=agnes_site`、`utm_medium=referral`、按位置区分的 `utm_campaign`）。姊妹项目链接出现在 TitleBar（胶囊按钮）、LandingPage（专属区段）、FooterBar（「姊妹工具」行）以及 Organization JSON-LD Schema 中。
- **落地页** — 完整的上传前落地页，包含主题感知背景图片、「我们正在使用的好工具」AffiliateWall 商业化模块（位于常见问题之前）、使用说明步骤、手风琴常见问题（9 项，含文件大小限制和项目分组）、多板块关于页面（项目起源、隐私与技术、团队介绍、商业合作含邮箱复制与社交链接 +「查看更新日志 →」链接）、滚动渐显动画、支持锚点链接的板块与延迟渲染性能优化
- **用户操作手册** — 位于 `/guideline` 的完整双语使用指南，包含标注截图、交互式目录导航、分步仪表盘操作说明、CSV 导出指引、图表解读和故障排查章节
- **更新日志** — 位于 `/changelog` 的专属页面，展示 v0.1.0 至 v0.8.0 的完整版本历史，按类别（新增/改进/修复/依赖变更）以彩色圆点分组；Apple 极简双语设计，与隐私政策/使用条款风格一致，含 JSON-LD WebPage 结构化数据、独立 SEO 元数据，可从 TitleBar、FooterBar 和落地页访问
- **隐私政策与使用条款** — `/privacy` 和 `/terms` 页面，包含双语法务内容、独立 SEO 元数据（规范 URL、OpenGraph、Twitter 卡片）、JSON-LD WebPage Schema 以及 Apple 极简风格的法律文本布局；每页页脚均有导航链接
- **数据分析** — 可选的 Google Analytics 4 集成，通过 `NEXT_PUBLIC_GA_ID` 环境变量控制；未设置时零开销。追踪页面浏览、文件上传、分享卡片生成、标签页切换和语言切换 — 绝不追踪任何 CSV 数据。
- **增强 SEO** — Twitter `summary_large_image` 卡片含 1200×630 OG 图片、用于 Google 知识面板的 `Organization` JSON-LD Schema、包含所有子页面的扩展 `BreadcrumbList`、差异化的站点地图 `lastModified` 日期、所有页面的 `keywords` + `author` + `twitter:site`/`creator` 元标签
- **社区友好** — `CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、Issue 模板（Bug 报告 + 功能请求）和 Pull Request 模板，欢迎贡献者
- **错误韧性** — 优雅处理 ZIP/CSV 处理失败，显示用户可见的错误信息并支持重试；DataContext 解析器崩溃保护
- **无障碍** — 所有图表具有描述性 `aria-label` 属性；响应式 Hero 文字从移动端的 `text-5xl` 缩放至桌面的 `text-[5rem]`；数据为空时显示空状态提示

## CSV 格式

DeepSeek 平台标准导出格式。新导出使用 `start_time_iso` / `end_time_iso` ISO 时间戳与日期区间文件名（如 `amount-2026-08-01_2026-08-17.csv`）；旧式导出（`utc_date` 列 + `amount-{年份}-{月份}.csv` 命名）同样支持。

### `amount-{年份}-{月份}.csv`（或日期区间命名）

| 列名             | 说明                                                                                 |
| -------------- | ---------------------------------------------------------------------------------- |
| `start_time_iso` | 统计周期开始（ISO 8601）；账单日取其日期部分（北京时间当天）                                        |
| `end_time_iso`   | 统计周期结束（ISO 8601）                                                               |
| `model`        | 模型名称，如 `deepseek-v4-pro`、`deepseek-v4-flash`                                        |
| `api_key_name` | API Key 标签                                                                         |
| `api_key`      | Key（脱敏）                                                                            |
| `type`         | `request_count`、`output_tokens`、`input_cache_hit_tokens`、`input_cache_miss_tokens` |
| `price`        | 单价（人民币，`request_count` 类型为空）                                                        |
| `amount`       | Token 或请求数量                                                                        |

### `cost-{年份}-{月份}.csv`（或日期区间命名）

| 列名           | 说明           |
| ------------ | ------------ |
| `start_time_iso` | 统计周期开始（ISO 8601） |
| `end_time_iso`   | 统计周期结束（ISO 8601） |
| `model`      | 模型名称         |
| `wallet_type` | 钱包类型（如 `Paid`） |
| `cost`       | 金额（负数为扣费）    |
| `currency`   | 币种（CNY）      |

## 本地开发

```bash
npm install
npm run dev        # 开发服务器 → localhost:3000
npm run build      # 静态导出 → out/
npm run lint       # ESLint
npm test           # Vitest（47 个测试用例）
```

### 技术栈

| 层级     | 技术                                 |
| ------ | ---------------------------------- |
| 框架     | Next.js 16（App Router，静态导出）        |
| UI     | React 19                           |
| 图表     | ECharts 6 + echarts-for-react      |
| CSV 解析 | Papa Parse 5                       |
| ZIP 处理 | JSZip                                    |
| 截图     | html2canvas                             |
| QR 码    | qrcode                                   |
| 样式     | Tailwind CSS v4 + CSS 自定义属性        |
| 字体     | Hubot Sans（本地 WOFF2）+ Geist Mono（next/font/google） |
| 语言     | TypeScript 5（strict 严格模式）          |

### 项目结构

```
src/
├── app/                    # Next.js App Router（路由组 + 双语镜像）
│   ├── (site)/             # 英文根布局路由组（不可见路由组）
│   │   ├── layout.tsx          # 英文根布局 → AppRootLayout(locale="en")
│   │   ├── page.tsx            # 入口 → <Dashboard />
│   │   ├── guideline/
│   │   │   └── page.tsx        # /guideline 路由，包含独立 SEO 元数据
│   │   ├── privacy/
│   │   │   └── page.tsx        # /privacy 路由，包含独立 SEO 元数据
│   │   ├── terms/
│   │   │   └── page.tsx        # /terms 路由，包含独立 SEO 元数据
│   │   ├── changelog/
│   │   │   └── page.tsx        # /changelog 路由，包含独立 SEO 元数据
│   │   ├── deepseek-api-cost-tracker/
│   │   │   └── page.tsx        # SEO 落地页：DeepSeek API 费用追踪器
│   │   ├── deepseek-cache-hit-rate-analyzer/
│   │   │   └── page.tsx        # SEO 落地页：DeepSeek 缓存命中率分析器
│   │   ├── deepseek-api-pricing-calculator/
│   │   │   └── page.tsx        # SEO 落地页：DeepSeek API 价格计算器
│   │   ├── blog/
│   │   │   ├── page.tsx                    # /blog 文章索引：最新优先的文章列表
│   │   │   ├── deepseek-context-caching-guide/page.tsx    # 博客文章 1
│   │   │   ├── deepseek-cost-optimization-tools/page.tsx  # 博客文章 2
│   │   │   ├── openai-claude-vs-deepseek-cost-comparison/page.tsx # 博客文章 3
│   │   │   ├── opencode-go-cheapest-deepseek-v4-flash/page.tsx # 博客文章 4
│   │   │   └── deepseek-csv-export-format-changed-aug-2026/page.tsx # 博客文章 5
│   │   └── author/
│   │       └── page.tsx          # /author 路由，包含独立 SEO 元数据
│   ├── zh/               # 中文根布局路由组（镜像所有 (site)/ 路由）
│   │   ├── layout.tsx          # 中文根布局 → AppRootLayout(locale="zh")
│   │   ├── page.tsx            # /zh 首页 → <Dashboard />
│   │   └── ...                 # 所有 (site)/ 页面的中文镜像
│   ├── globals.css         # Tailwind v4 + Hubot Sans @font-face + CSS 变量
│   ├── AppI18nShell.tsx    # i18n 外壳 + <html lang> 同步
│   ├── AppRootLayout.tsx   # 共享根布局渲染器（字体、GA、Provider）
│   ├── robots.ts           # 构建时 robots.txt 生成
│   └── sitemap.ts          # 构建时 sitemap.xml（每路由 en + zh 双语条目）
├── components/
│   ├── TitleBar.tsx         # 共享顶部导航栏（Logo + 应用名 + Agnes 胶囊按钮 + GitHub + 博客笔图标 + 指南针图标 + 更新日志时钟 + 语言 + 主题；移动端响应式弹出菜单）
│   ├── FooterBar.tsx        # 共享页脚（「姊妹工具」行 + 版权 + 导航链接 + 版本号，可选渐显动画）
│   ├── LandingPage.tsx      # 落地页（Hero + 推荐工具模块 + 上传 + 使用说明 + FAQ 手风琴 + 关于，滚动渐显）
│   ├── LandingContent.tsx   # 服务端渲染 <noscript> 回退内容，供搜索引擎爬虫抓取
│   ├── GuidelinePage.tsx    # 完整交互式用户操作手册（双语、标注截图、目录导航、滚动渐显）
│   ├── PrivacyPage.tsx      # 隐私政策页（双语 7 章节法律文本，JSON-LD WebPage Schema，GitHub 源码链接）
│   ├── TermsPage.tsx        # 使用条款页（双语 8 章节法律文本，JSON-LD WebPage Schema，MIT 许可证引用）
│   ├── ChangelogPage.tsx     # 更新日志页（v0.1.0–v0.8.0 完整版本历史，按类别以彩色圆点分组，JSON-LD WebPage Schema）
│   ├── CostTrackerPage.tsx    # SEO 落地页：DeepSeek API 费用追踪器（功能 + 联盟推荐）
│   ├── CostTrackerContent.tsx # <noscript> SEO 回退：双语费用追踪器内容供爬虫抓取
│   ├── CacheAnalyzerPage.tsx  # SEO 落地页：DeepSeek 缓存命中率分析器（缓存教育 + MindRose CTA）
│   ├── CacheAnalyzerContent.tsx # <noscript> SEO 回退：双语缓存分析器内容供爬虫抓取
│   ├── PricingCalculatorPage.tsx # SEO 落地页：DeepSeek API 价格计算器（交互式滑块 + 竞品对比表 + Vultr CTA）
│   ├── PricingCalculatorContent.tsx # <noscript> SEO 回退：双语价格计算器内容供爬虫抓取
│   ├── AuthorPage.tsx         # 作者个人资料页（双语简介、技能、社交链接、JSON-LD Person Schema）
│   ├── AuthorContent.tsx      # <noscript> SEO 回退：双语作者简介供爬虫抓取
│   ├── BlogPostLayout.tsx     # 可复用博客文章模板（Apple 极简风格，元数据行，交叉链接，CTA）
│   ├── BlogArticlePage.tsx    # 通用博客文章包装器（根据语言加载内容）
│   ├── ArticleRenderer.tsx    # 结构化内容渲染器（从 ArticleSection[] 渲染 h2/h3/p/ul/ol/code/table）
│   ├── BlogIndex.tsx          # 博客首页（最新优先文章列表，双语标题/描述/标签）
│   ├── PrivacyContent.tsx     # <noscript> SEO 回退：双语隐私政策内容供爬虫抓取
│   ├── TermsContent.tsx       # <noscript> SEO 回退：双语使用条款内容供爬虫抓取
│   ├── ChangelogContent.tsx   # <noscript> SEO 回退：双语更新日志版本摘要供爬虫抓取
│   ├── CopyButton.tsx         # 可复用剪贴板复制按钮（悬浮提示、国际化 Toast、定时器清理）
│   ├── ShareButton.tsx        # 标签导航栏分享图标按钮 → 打开 ShareModal
│   ├── ShareCard.tsx          # 1200×630 社交媒体信息图卡片（各标签页 KPI + 迷你图表 + QR 码 + 水印）
│   ├── ShareModal.tsx         # 分享弹窗（实时预览、输入表单、复制到剪贴板、PNG 下载）
│   ├── AffiliateWall.tsx      # 商业化推荐模块：卡片式布局展示联盟工具，含双语描述和佣金信息
│   ├── Dashboard.tsx          # 路由：落地页 / 5 标签页仪表盘视图切换（语义化隐藏 H1）
│   ├── DropZone.tsx           # 拖拽或点击上传 CSV/ZIP（多文件，50MB 限制）
│   ├── ProjectView.tsx        # 按项目标签页：拖拽自定义项目分组，按项目汇总费用/Token/缓存表格
│   ├── KPICards.tsx           # 摘要指标卡片
│   ├── OverviewView.tsx       # Hero 费用 + 日柱状图 + 环形图
│   ├── KeyView.tsx            # Hero Key 数量 + 详细表格
│   ├── CacheView.tsx          # Hero 命中率 + 趋势 + 堆叠图
│   ├── TrendsView.tsx         # Hero 动态指标 + 折线图
│   ├── ErrorDisplay.tsx       # 解析错误 & 警告横幅
│   ├── LanguageSwitcher.tsx   # EN / 中文 切换（胶囊分段控件）
│   └── ThemeSwitcher.tsx      # 浅色 / 深色 切换（SVG 图标按钮）
├── i18n/
│   ├── index.ts            # 统一导出
│   ├── I18nProvider.tsx    # React 上下文 + useTranslation Hook
│   └── translations.ts     # 全部 UI 文案（en + zh，35+ 分组）
└── lib/
    ├── types.ts              # TypeScript 接口与类型定义
    ├── parser.ts             # CSV 解析管线
    ├── concatFiles.ts        # 多月 CSV/ZIP 配对、解压与拼接 + 50MB 大小限制
    ├── format.ts             # 本地化格式函数
    ├── schema.ts             # JSON-LD 结构化数据（SoftwareApplication + FAQPage + BreadcrumbList + Organization，双语）
    ├── DataContext.tsx       # 数据状态 + 模型筛选
    ├── ProjectConfigContext.tsx # 自定义项目分组配置（拖拽分配，localStorage 持久化）
    ├── ThemeContext.tsx      # 主题状态 + useTheme Hook
    ├── shareCardData.ts      # 分享卡片数据提取（从 ParseResult 提取各标签页汇总数据）
    ├── analytics.ts          # GA4 事件追踪辅助函数（页面浏览、上传、分享、标签页切换、语言切换、联盟点击、落地页 CTA）
    ├── sisterProjects.ts     # 姊妹项目交叉链接配置（Agnes/DeepSeek 品牌信息，含 UTM 参数的追踪链接）
    ├── affiliates.ts         # 联盟营销链接配置（Vultr/DO/Namecheap/OpenRouter/腾讯云 推荐链接）
    ├── authors.ts            # 作者个人资料配置（社交/联系链接、团队成员页面链接、buildAuthorMetadata）
    ├── blogArticles.ts       # 博客文章定义：slug、路径、标题键、描述键、关键词、发布时间
    ├── content.ts            # 文章内容类型定义（ArticleSection[]、ContentBlock、RichParagraph、PricingRow）
    ├── content/articleCaching.ts   # 文章 1 内容：DeepSeek 上下文缓存指南（双语）
    ├── content/articleTools.ts     # 文章 2 内容：Top 5 成本优化工具对比（双语）
    ├── content/articleOpenai.ts    # 文章 3 内容：OpenAI GPT vs Claude vs DeepSeek V4 Pro 成本对比（双语 + 定价表）
    ├── content/articleOpencodeGo.ts # 文章 4 内容：OpenCode Go 上的 DeepSeek V4 Flash（双语 + 定价表）
    ├── content/articleCsvFormatChange.ts # 文章 5 内容：DeepSeek 用量导出 CSV 格式变更（双语）
    ├── localeRouting.ts      # URL 级语言路由：DEFAULT_LOCALE、ZH_LOCALE_PREFIX、isZhPathname()、buildLocalePath()、switchLocalePath()
    ├── site.ts               # 站点级公开常量：SITE_URL、SITE_NAME、OG_IMAGE_URL、LOGO_IMAGE_URL
    ├── pageMetadata.ts       # 页面级 SEO 元数据构建器：buildLocalizedPageMetadata()（规范 URL、alternates、OG、Twitter、关键词、作者）
    └── routeMetadata.ts      # 路由级元数据构建器：buildHomeMetadata()、buildGuidelineMetadata() 等（共 13 个构建器）
├── __tests__/
│   ├── analytics.test.ts       # trackEvent 单元测试
│   ├── schema.test.ts          # Organization + BreadcrumbList Schema 测试
│   ├── sitemap.test.ts         # Sitemap lastModified 差异化测试
│   ├── localeRouting.test.ts   # URL 路由辅助函数（13 个测试用例）
│   ├── DataContext.test.tsx    # loadFiles 错误处理测试
│   └── DropZone.test.tsx       # 上传错误展示测试
```

## 设计系统

仪表盘遵循 **Apple 极简主义** 设计语言，完全由 CSS 自定义属性驱动：

- **30+ 主题色值** — 背景、文字（3 级）、边框、强调色、语义色（正向/危险/警告）、错误/警告横幅、图表色、拖拽区状态色
- **浅色主题**：`#F5F5F7` 冷灰纸质感底，`#1D1D1F` 哑光黑文字
- **深色主题**：`#000000` 纯黑底，`#F5F5F7` 白色文字
- **字体**：Hubot Sans，正文 400 字重 / 标题 500–700 字重，紧凑字间距
- **Hero 模式**：总览/Key/缓存/趋势视图中 `5rem` 粗体大数字 — 数据优先的视觉呈现；响应式缩放（`text-5xl sm:text-6xl md:text-[5rem]`）防止移动端溢出
- **无卡片布局**：通栏模块，以 `1px solid var(--border)` 细线分割
- **微交互**：细腻的 hover 过渡（200ms）、淡入/上滑动画、Intersection Observer 滚动渐显、手风琴折叠面板
- **自定义滚动条**：6px 细条，透明轨道，主题色滑块
- **无障碍**：遵循 `prefers-reduced-motion`、`color-scheme` 原生 UI、`focus-visible` 轮廓、`aria-expanded`/`aria-controls` 交互属性

## SEO 架构

本应用为客户端渲染的静态 SPA 实现了多层 SEO 策略：

- **generateMetadata()** — 动态服务端渲染元数据：规范 URL、OpenGraph（标题、描述、图片）、Twitter 卡片、hreflang 语言标注（en/zh）、robots 指令
- **JSON-LD 结构化数据** — `SoftwareApplication` + `FAQPage` + `BreadcrumbList` + `Organization` 双语 Schema（英文和中文，共 8 个 script 标签），构建时通过 `layout.tsx` 中的 `<script type="application/ld+json">` 注入；`Organization` Schema 帮助 Google 建立品牌知识面板
- **robots.txt + sitemap.xml** — 构建时通过 Next.js 16 `MetadataRoute` 约定生成；sitemap 包含 `/`、`/guideline`、`/privacy`、`/terms` 和 `/changelog` 五个条目；站点域名从 `NEXT_PUBLIC_SITE_URL` 环境变量读取
- **`<noscript>` 回退** — `LandingContent.tsx` 输出关键落地页内容（使用说明、常见问题、关于），供不执行 JavaScript 的爬虫抓取；`PrivacyContent.tsx`、`TermsContent.tsx` 和 `ChangelogContent.tsx` 为隐私政策、使用条款和更新日志页面提供双语 `<noscript>` 回退内容（EEAT 信任信号）
- **`llms.txt`** — 面向 LLM 的站点描述，位于 `/llms.txt`，总结应用功能、特性与结构，供 AI 工具使用
- **语义化 HTML** — 落地页和操作手册页包含可见的 `<h1>`，仪表盘视图包含 `<h1 className="sr-only">`，配合正确的 section 结构

## 部署

静态输出，可部署到任何静态托管服务：

```bash
npm run build
# out/ → Vercel, Netlify, GitHub Pages, Cloudflare Pages 等
```

设置 `NEXT_PUBLIC_SITE_URL` 环境变量为你的生产环境域名，以确保正确的规范 URL、站点地图和 OpenGraph 元数据。可选择性设置 `NEXT_PUBLIC_GA_ID` 为 Google Analytics 4 测量 ID 以启用页面浏览追踪。如需姊妹项目交叉链接，可设置 `NEXT_PUBLIC_AGNES_SITE_URL`（Agnes 站点地址）和 `NEXT_PUBLIC_AGNES_GITHUB_URL`（Agnes GitHub 仓库地址）。

### Vercel 部署

仓库包含 `vercel.json`，预配置安全头与缓存规则：

- **安全**：`X-Content-Type-Options`、`X-Frame-Options`、`Strict-Transport-Security`、`Content-Security-Policy`、`Referrer-Policy`、`Permissions-Policy` — 均设为生产环境安全值
- **缓存**：`/_next/static` 和 `/fonts` 永久缓存（1 年），`/landing` 和 `/guideline` 图片 stale-while-revalidate 缓存（1 周）

## 更新日志

### v0.8.0

**新增：**

- 支持 DeepSeek 新导出 CSV 格式 — 导出字段由 `utc_date` 日期列改为 `start_time_iso` / `end_time_iso` ISO 时间戳（`user_id`、`wallet_type` 变为必带列）。解析器从 `start_time_iso` 的日期部分派生账单日（北京时间当天），并支持按新的日期区间文件名（如 `amount-2026-08-01_2026-08-17.csv`）配对月份。旧式导出（`utc_date` 列 + `amount-{年份}-{月份}.csv` 命名）保持完整向后兼容。
- 新增 `parser.test.ts` — 单元测试覆盖新格式解析、旧格式兼容、缺少列报错以及日期区间文件名配对逻辑。

**修复：**

- 修复 DeepSeek 导出格式变更导致的解析失败 — 新版本平台导出不再包含 `utc_date` 列，此前会导致仪表盘以「缺少列」错误拒绝文件。现解析逻辑已支持新字段结构（同时兼容旧文件）。

### v0.7.0

**新增：**

- 发布第 4 篇博客文章 —《全球最便宜的 DeepSeek V4 Flash，就在 OpenCode Go（每月 $10）》（`/zh/blog/opencode-go-cheapest-deepseek-v4-flash`），含中英双语内容、定价对比表（V4 Flash vs V4 Pro vs GPT-5.6 Luna）、完整 SEO 元数据、sitemap 条目，并已接入博客链路的上一篇/下一篇交叉链接。
- 在 `affiliates.ts` 注册表中新增 Opencode Go 联盟推广 — 推荐链接（`opencode.ai/go?ref=NS60V8HH6Q`）通过 AffiliateWall「我们正在使用的好工具」模块展示在首页、每篇博客文章、AuthorPage 与 CostTrackerPage。

**改进：**

- 博客首页改为按最新优先排序 — 文章列表依据 `blogArticles.ts` 中各文章的 `publishedTime` 排序，取代原先的硬编码顺序，新文章会自动置顶。
- 首页姊妹项目区段替换为 AffiliateWall「我们正在使用的好工具」商业化模块 — 该模块现位于常见问题区段之前，标题与副标题居中展示。
- 博客文章底部 CTA 横幅（「试试我们的免费仪表盘」）替换为相同的 AffiliateWall 推荐工具模块，让每篇文章的底部都成为可承载商业变现的区段。

### v0.6.6

**改进：**

- 首页 SEO 元数据优化 — title 改为 "DeepSeek API Cost Tracker & Usage Analytics — Free CSV Dashboard"，采用关键词前置策略；description 重写，首句包含核心关键词。
- 落地页 Hero 区域增强 — 在首页和三个 SEO 落地页（Cost Tracker、Cache Analyzer、Pricing Calculator）的 H1 下方新增显式关键词副标题，提升搜索引擎可见性。
- 工具落地页 metadata 精细化 — Cost Tracker 标题强调「无需注册」；Cache Analyzer 标题精简；Pricing Calculator description 从模型列表描述转向动作导向文案。

### v0.6.5

**新增：**

- 新增 Schema 单元测试 — 新增 `schema.test.ts` 测试文件，覆盖 JSON-LD Schema 生成函数的验证，确保跨版本结构化数据的正确性。

**改进：**

- 博客元数据集中管理 — 将 3 篇博客文章的元数据（标题、描述、标签、发布日期、SEO 字段）提取到共享的 `blogArticles.ts` 模块中，替换各文章页面文件中的内联元数据，实现一致的单源管理。
- 抽取可复用 JsonLd 组件 — 将 JSON-LD 结构化数据生成封装为通用的 `<JsonLd />` 组件，简化了原先在 5 个博客文章页面文件和 `layout.tsx` 中重复的 Schema 生成逻辑。
- AuthorContent 团队成员展示重构 — 使用数组映射模式（`TEAM_MEMBERS` 配置数组 + `.map()`）重建团队成员渲染逻辑，替换原有的逐个硬编码成员区块，减少代码重复并提升可维护性。
- Schema 模块精简 — 将可复用的 JSON-LD 渲染逻辑提取到 `JsonLd.tsx` 组件中，大幅精简模块复杂度。

### v0.6.4

**新增：**

- 作者团队页面全面重构 — 用 4 位真实成员简介（Gavin Chen、Lindsay Lin、Angela Lee、Simon L.）替换原有的占位内容，采用响应式 CSS Grid 布局展示每位成员的角色、描述和首字母头像；页面标题更新为「作者团队」，个人资料、简介、身份验证和团队成员区域的双语内容全面优化以反映扩展的团队范围。
- 腾讯云联盟推广新增至 `affiliates.ts` 注册表 — 新推荐链接集成到 AuthorPage 和 CostTrackerPage 的 `AffiliateWall` 组件，同步扩展开发者基础设施服务商覆盖（Vultr、Railway、硅基流动、Warp），新增双语标签（"Recommended Tools We ARE USING" / "我们正在使用的好工具"）。
- `og-image.png` 静态资源添加至 `/public` — 1200×630 社交媒体预览图片，用于 OpenGraph/Twitter 卡片，增强网站在社交平台分享时的链接预览效果。

**改进：**

- 博客文章成本对比数据更新 — 更新 OpenAI vs DeepSeek 博客文章中所有对比表格的 GPT-5.5、GPT-5.4、GPT-5.4 mini、Claude Fable 5、Opus 4.8、Sonnet 5 和 Haiku 4.5 定价数据。文章迁移指南和成本收益分析章节的叙事已更新为涵盖 Anthropic Claude、OpenAI GPT 和 DeepSeek 三家供应商。
- 联盟链接系统精简 — `affiliates.ts` 注册表重新整理，更新服务商分类；CostTrackerPage 推荐工具区从 Portkey/Helicone 切换为开发者基础设施工具（Vultr、Railway、腾讯云、硅基流动、Warp），新增描述性标签以反映实际使用场景。
- 博客文章标签元数据增强 — 为博客首页文章卡片添加「Token成本」「Claude」「GPT」「Anthropic」等标签（中英双语），提升 SEO 关键词覆盖和搜索相关性。

**修复：**

- 博客对比文章 URL 规范化 — sitemap、路由元数据（`routeMetadata.ts`）和博客文章页面路径从 `/blog/openai-vs-deepseek-cost-comparison` 修正为 `/blog/openai-claude-vs-deepseek-cost-comparison`，以准确反映三家供应商对比的文章内容范围（OpenAI GPT + Anthropic Claude + DeepSeek）。

### v0.6.3

**新增：**

- 定价计算器人民币/美元货币切换 — 用户可以在人民币（¥）和美元（$）之间切换所有价格显示，按近似汇率实时转换
- AffiliateWall 组件 — SEO 落地页集中化的联盟链接展示区段，提供结构化的服务商推荐（Vultr、DigitalOcean、Namecheap、OpenRouter），含推荐链接和 `rel=sponsored nofollow` 合规标注
- 3 个工具落地页的 `<noscript>` SEO 回退内容（CacheAnalyzerContent、CostTrackerContent、PricingCalculatorContent）— 双语爬虫可读内容，提升搜索引擎索引效果，与 PrivacyContent、TermsContent 保持一致的模式
- 扩展 OpenAI vs DeepSeek 博客文章中的大模型成本对比 — 新增最新 GPT 模型（GPT-4.1、GPT-4.5 Preview、GPT-5）和 Claude 模型（Opus 4.5、Sonnet 4.5、Haiku 4.5），同步更新所有模型族的最新定价数据

**改进：**

- 联盟链接系统重构 — 集中化 `affiliates.ts` 配置扩展了更多服务商项目，通过分类链接组改进类型安全，优化落地页和博客 CTA 区域的 UTM 追踪集成
- 落地页 SEO 增强 — 工具落地页现包含增强的 JSON-LD 结构化数据和双语 `<noscript>` 爬虫回退内容，提升搜索引擎可见性和 EEAT 信任信号
- 博客文章成本对比准确性 — 同步更新 GPT、Claude 和 DeepSeek 全系模型的最新定价，提供更精准的成本收益分析

**修复：**

- 首页 URL 规范化 — 修复根 URL 可能产生不一致规范路径的问题，简化站点地图生成逻辑，输出更清晰

### v0.6.2

**新增：**

- URL 级国际化路由 — 为中文语言引入 `/zh` 路径前缀（如 `/zh/guideline`、`/zh/blog`）。英文路由保持无前缀。所有页面、SEO 落地页和博客文章实现完整的双语 URL 镜像。新增集中化模块：`localeRouting.ts`（语言检测、路径构建、重定向）、`site.ts`（SITE_URL、SITE_NAME、OG/Logo 图片 URL）、`pageMetadata.ts` 和 `routeMetadata.ts`（共享 `generateMetadata()` 辅助函数）。从旧 `layout.tsx` 中提取 `AppRootLayout.tsx` 以支持语言感知的根布局。每个路由现在通过 `(site)/` 和 `zh/` 路由组拥有独立的 SEO 元数据生成。
- 语言感知导航 — 所有内部链接（TitleBar、FooterBar、LandingPage、GuidelinePage、博客组件、子页面）已更新为使用 `buildLocalePath()` 正确处理语言前缀。LanguageSwitcher 现在使用语言感知的路径构建，切换语言时不会丢失当前页面上下文。

**改进：**

- 博客文章多语言支持 — 将 BlogArticlePage 和 BlogPostLayout 中的硬编码英文文本替换为 i18n 翻译键。博客元数据获取现在使用语言感知逻辑，复用已有的博客翻译字符串以保持双语内容的一致性。
- 落地页外链按钮样式统一 — 统一了落地页外链按钮的视觉风格，修复了不同区块之间按钮外观不一致的问题。
- 博客首页布局优化 — 将博客列表段落最大宽度调整为 `max-w-3xl`，提升宽屏下的阅读体验。
- 测试覆盖 — 新增 `localeRouting.test.ts`（69 个测试用例）覆盖语言路由模块。更新 `analytics.test.ts` 和 `sitemap.test.ts` 以覆盖新的路由结构。

### v0.6.1

**新增：**

- 作者页面（`/author`）— Gavin Chen 的专属双语个人资料页，包含个人简介、技能标签、社交链接（GitHub、LinkedIn、Email、MindRose、微信）、JSON-LD Person Schema、独立 SEO 元数据（canonical、OG、Twitter）、Apple 极简风格布局和 `<noscript>` 爬虫回退。FooterBar 新增导航链接。
- 集中化作者配置模块（`src/lib/authors.ts`）— 社交/联系链接和团队成员页面 URL 的统一数据源。博客文章页面在 JSON-LD 中包含完整的作者 Person 元数据（`sameAs` 链接、`worksFor` MindRose 组织信息）。

**改进：**

- 全站 SEO 元数据优化 — 为所有页面级 `generateMetadata()` 调用（博客文章、工具落地页、操作手册、隐私政策、使用条款、更新日志）添加 `author`、`keywords` 和 `twitter:site`/`twitter:creator` 元标签。通过 `authors.ts` 统一全站作者引用。
- 代码清理 — 移除已废弃的旧落地页图片资源和未使用的模块级导入。

### v0.6.0

**新增：**

- 3 个 SEO 落地页 — `CostTrackerPage`（费用追踪器）、`CacheAnalyzerPage`（缓存分析器）和 `PricingCalculatorPage`（交互式滑块计算器 + 竞品定价对比表）。每个页面拥有独立的 canonical URL、OpenGraph `summary_large_image`、Twitter 卡片、hreflang、关键词和双语内容。商业化模块包括联盟工具推荐（Portkey、Helicone）和 Vultr 推荐 CTA。
- 博客基础设施 — 博客首页 3 卡片标签/描述网格 + 3 篇双语文章：《DeepSeek API 上下文缓存终极指南》、《Top 5 DeepSeek API 成本优化与可观测性工具》、《OpenAI GPT vs Claude vs DeepSeek V4 Pro：成本收益分析》。所有文章通过 `BlogArticlePage` → `ArticleRenderer` 结构化内容系统（`src/lib/content/articleCaching|articleTools|articleOpenai.ts`）支持中英文切换。
- 联盟营销集成 — 集中化 `src/lib/affiliates.ts` 配置模块，含 Vultr、DigitalOcean、Namecheap 和 OpenRouter 推荐链接。联盟链接已加入落地页和博客 CTA 区域，使用 `rel=sponsored nofollow` 合规标注。
- 基于 UTM 的转化追踪漏斗 — `src/lib/analytics.ts` 新增 `trackLandingCTA()`、`trackOutboundClick()`、`trackPageView()` 辅助函数。完整的 GA4 配置指南位于 `docs/promotion/GA4_Tracking_Guide.md`。
- 博客导航 — TitleBar 笔形图标按钮，FooterBar 中 Changelog 和 GitHub 之间新增文字链接。TitleBar 中的 Logo 现可点击回到首页。
- 双语博客首页 — 文章卡片标题、描述和标签来自 `blogIndex.*` 翻译键（中英双语）。

**改进：**

- 响应式 TitleBar — 移动端采用 `...` 弹出菜单（Agnes、GitHub、操作手册、博客、更新日志、主题切换）。桌面端保留完整图标行。清晰分离避免 375px 宽屏幕溢出。
- TitleBar 图标增强 — 操作手册改为指南针图标（导航隐喻），博客改为笔形图标（写作隐喻）。16×16px 尺寸下语义区分更明确。
- SEO 覆盖 — sitemap 从 5 条扩展至 12 条，覆盖所有新工具页、博客首页和 3 篇文章。`llms.txt` 和 `llms-full.txt` 已更新覆盖所有新页面。
- SEO 元数据 — 页面标题优化为 `DeepSeek API Usage Dashboard & Cost Tracker | Free & Secure`，关键词前置策略。所有博客页面现具备独立的 `generateMetadata()`（canonical、OG、Twitter、keywords、robots）。

### v0.5.4

**新增：**

- 姊妹项目交叉链接 — 集中化的 `src/lib/sisterProjects.ts` 模块，管理「API Usage Analyzer Series」产品矩阵（DeepSeek + Agnes）的交叉链接。TitleBar 新增 Agnes AI 胶囊按钮、LandingPage 新增专属姊妹项目区段、FooterBar 新增「姊妹工具」行、扩展 Organization JSON-LD Schema（`sameAs` + `brand`）。所有跨站链接均附带 UTM 追踪（`utm_source=agnes_site`、`utm_medium=referral`、按位置区分的 `utm_campaign`）。

**改进：**

- 优化了中文语言下的 token 数字显示格式，更符合中文习惯。

### v0.5.3

**新增：**

- 增强 SEO — Twitter 卡片升级为 `summary_large_image`，含 1200×630 OG 社交预览图片；为所有页面添加 `keywords`、`twitter:site`/`creator` 和 `author` 元标签。
- Organization JSON-LD 结构化数据，用于 Google 知识面板品牌识别；扩展 BreadcrumbList，包含所有子页面条目。
- GA4 转化事件 — 通过共享的 `trackEvent()` 分析辅助函数新增 `upload_csv`、`share_card`、`tab_switch` 和 `language_switch` 事件追踪。
- 社区基础设施 — `CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、GitHub Issue 模板（Bug 报告 + 功能请求）和 Pull Request 模板。

**改进：**

- 响应式 Hero 数字 — Hero 文本现可在移动端屏幕上自适应缩小（`text-5xl → sm:text-6xl → md:text-[5rem]`），避免水平溢出。
- 图表无障碍 — 所有 ECharts 实例现具有供屏幕阅读器使用的描述性 `aria-label` 属性。
- 站点地图 lastModified 日期 — 现按路由差异化设置；隐私政策/使用条款使用 `yearly` 更新频率和历史日期。

**修复：**

- 关键修复：DropZone 错误处理 — 为 ZIP/CSV 处理错误添加缺失的 `catch` 子句。此前损坏的文件或解压失败会导致 UI 卡在无限「处理中」旋转状态。现在显示用户可见的错误信息并支持重试。
- DataContext 解析器崩溃保护 — 在 `setTimeout` 回调中将 `parseDeepSeekData()` 包裹在 `try/catch` 中。此前解析器同步崩溃会静默失败，无用户反馈。
- 空状态 — OverviewView、KeyView、TrendsView 和 ProjectView 现已在模型筛选后数据为空时显示描述性空状态提示信息。

**依赖变更：**

- 新增 `vitest`、`@testing-library/react`、`@testing-library/jest-dom`、`jsdom` 和 `@vitejs/plugin-react` 测试基础设施依赖。5 个测试文件共 21 个测试用例。

### v0.5.2

**新增：**

- 社交媒体分享卡片 — 每个仪表盘标签页（总览 / 项目 / Key / 缓存 / 趋势）现可生成 1200×630 信息图分享图片。支持自定义「From XXX」署名、可选引用文案、各标签页专属 ECharts 迷你图表、deepseek-usage.xyz 二维码、应用 Logo 水印、一键复制到剪贴板（直接粘贴至微信/飞书/钉钉）以及 PNG 下载。

**依赖变更：**

- 新增 `html2canvas`（DOM 转 Canvas 截图）和 `qrcode`（客户端二维码生成）依赖包。

### v0.5.1

**新增：**

- 更新日志页面（`/changelog`）— 专属页面展示完整版本历史，采用与隐私政策/使用条款一致的 Apple 极简双语设计。包含 JSON-LD WebPage 结构化数据、独立 SEO 元数据（canonical、OpenGraph、Twitter），版本条目按类别（新增/改进/修复/依赖）以彩色圆点分组展示。
- TitleBar 时钟图标链接至更新日志页面，与现有操作手册书籍图标并列。
- 落地页关于区域社交链接胶囊下方新增「查看更新日志 →」链接。

**改进：**

- TitleBar 悬浮提示（操作手册、更新日志）现正确支持多语言，中英文环境下显示对应本地化文本。
- sitemap.xml 扩展，新增 `/changelog` 条目（优先级 0.5，月度更新频率）。
- 翻译系统扩展，新增 `changelog.*` 分组（中英双语）。

### v0.5.0

**新增：**

- ZIP 文件上传支持 — 用户现可直接将 DeepSeek 平台导出的 ZIP 压缩包拖入仪表盘，内含的 CSV 文件将在浏览器端自动解压处理。感谢 [@taylord0ng](https://github.com/taylord0ng) 贡献此功能。
- 自定义项目分组管理 API 密钥 — 新增「按项目」标签页，支持通过拖拽将 API 密钥归入用户自定义的项目分组，提供按项目汇总的费用、Token 用量追踪及缓存命中率分析。灵感来自 [@taylord0ng](https://github.com/taylord0ng)。
- 项目配置弹窗 — 拖拽式界面，可将密钥分配至自定义项目，支持 localStorage 本地持久化、一键重置、空状态提示、键盘友好操作以及未分配密钥的下拉菜单。
- 通用 CopyButton 组件 — 封装剪贴板复制逻辑，含悬浮提示和国际化成功消息。KeyView 和 ProjectView 中的所有复制功能现已统一使用此共享组件。
- 费用一键复制 — 点击总览 Hero 区域的总费用大数字即可一键复制。
- 单文件 50MB 上传大小限制 — 防止意外或恶意超大文件（如 ZIP 炸弹）导致浏览器卡死，包含用户可见的警告提示和专属 FAQ 条目。

**改进：**

- 上传校验增强 — 文件大小检查并给出明确错误提示、项目名称重复校验及内联提示、关闭项目配置弹窗时的未保存修改确认对话框。
- 键盘无障碍 — 项目配置弹窗支持完整键盘导航：Enter 确认、Escape 关闭、方向键浏览，同时提供界面上可见的快捷键提示。
- UI 细节优化 — 修复项目密钥列表中拖拽高亮状态异常、解决配置列表 React key 警告、调整弹窗布局以获得更好的视觉平衡。
- 国际化覆盖 — 所有新增 UI 元素（项目视图、复制按钮、上传限制、配置弹窗）均已完善中英双语文案。
- 修复 CopyButton 定时器内存泄漏 — 组件卸载时正确清理定时器，避免过期状态更新。
- 用户操作手册与落地页 — 更新 FAQ（新增文件大小限制与项目分组相关条目）、使用指南截图与文档、落地页文案以反映新增功能。

**依赖变更：**

- 新增 `jszip` 依赖，用于浏览器端 ZIP 解压。

### v0.4.0

**新增：**

- 隐私政策页面（`/privacy`）— 双语（中/英）法律内容，涵盖 7 个章节：不收集数据、本地处理、Google Analytics（可选启用）、第三方服务、安全性、政策变更、联系我们。独立 SEO 元数据（规范 URL、OpenGraph、Twitter 卡片），JSON-LD WebPage Schema，Apple 极简风格法律文本布局，附 GitHub 源码链接以供透明验证。
- 使用条款页面（`/terms`）— 双语（中/英）法律内容，涵盖 8 个章节：按现状提供、免责声明、与 DeepSeek 无关、用户数据与责任、开源许可（MIT License）、责任限制、条款变更、联系我们。独立 SEO 元数据和 JSON-LD WebPage Schema。
- MIT LICENSE 文件 — 添加至项目根目录，明确开源许可协议。
- FooterBar 现同时链接至隐私政策和使用条款页面，与操作手册、GitHub、版本号并列。

**改进：**

- sitemap.xml 扩展，新增 `/privacy` 和 `/terms` 条目（优先级 0.5，月度更新频率）。
- 翻译系统扩展，新增 `privacy.*`（21 个键）和 `terms.*`（22 个键）分组，涵盖英文和中文。
- SEO 元数据：`NEXT_PUBLIC_SITE_URL` 现注入至隐私政策和使用条款页面的元数据生成中。

### v0.3.3

**修复：**

- 修复 TrendsView 中缓存命中率图表数据累加错误：每日比例值被错误累加，现已改为按原始 token 数量先累加再计算 hit/(hit+miss)，避免数值超过 100%。

**新增：**

- CacheView 的 hitsVsMisses 堆叠柱状图新增缓存命中率显示：tooltip 中展示百分比，柱状图顶部显示各 Key 的命中率标签。
- 新增 `vercel.json`，配置生产环境安全头（CSP、HSTS、X-Frame-Options 等）和静态资源缓存优化规则。

### v0.3.2

**新增：**

- 用户操作手册页面（`/guideline`）— 涵盖仪表盘总览、CSV 导出、数据上传、图表解读、故障排查的全面使用文档，双语（中/英）配标注截图。
- 操作手册导航入口：TitleBar（书籍图标）、FooterBar（文字链接）、LandingPage（使用说明区域下方）。
- 3 个新增常见问题（Q5–Q7）：「为什么费用显示为 0？」「显示"上传不完整"是什么意思？」「哪里可以找到更多故障排查帮助？」
- README 文件中添加仪表盘总览截图和 Logo（中英文版）。

**改进：**

- SEO：在 sitemap.xml 中新增 `/guideline` 条目。
- JSON-LD FAQPage Schema 扩充 Q5–Q7 条目（双语）。
- 在 `.gitignore` 中新增 `/docs/`。

### v0.3.1

**新增：**

- JSON-LD BreadcrumbList 面包屑 Schema（中英文双语），帮助搜索引擎理解页面在站点中的位置。

**改进：**

- SEO：扩展中文 `meta.description`，融入隐私说明和团队信息（约 100 字符，原 37 字符）。
- SEO：OpenGraph 元数据新增 `alternateLocale: ["zh_CN"]`，与 hreflang 语言标注相呼应。
- SEO：为落地页板块添加 `id` 属性（`#how-it-works`、`#faq`、`#about`），支持页面内锚点链接。
- JSON-LD：`SoftwareApplication` Schema 新增 `version` 字段（`0.3.1`）。
- 性能：为折叠区域下方的落地页板块（使用说明、常见问题、关于）添加 `content-visibility: auto`，减少初始渲染开销。

### v0.3.0

**新增：**

- 重构关于板块：从单一简介扩展为 4 个主题子板块 — 为什么开发这个工具、极致的隐私与技术架构、关于 MindRose、商业合作 — 各板块以虚线 `<hr>` 分割。
- 联系方式区域新增邮箱复制按钮：一键复制到剪贴板（`navigator.clipboard.writeText` 配合 textarea 降级方案），反爬虫动态拼接邮箱地址，SVG 对勾复制反馈 + 2 秒提示。
- 社交链接胶囊：GitHub 仓库、Gavin 的 LinkedIn、MindRose 官网 — 各含主题 SVG 图标、`rounded-subtle` 圆角边框和 hover 背景。

**改进：**

- 落地页各板块之间新增水平 `<hr>` 分割线，视觉层次更清晰。
- 常见问题手风琴区域使用 `max-w-2xl` 居中，宽屏下阅读体验更佳。
- TitleBar `z-index` 提升至 `z-50`，确保始终位于所有内容之上。
- 落地页板块统一使用 `pt-10` 顶部间距（原 `pt-0`），使分割线周围间距更一致。
- 为所有关于子板块新增 14 个 `landing.*` 翻译键（中英文）。
- 站点标题更新为 "DeepSeek API Usage Analytics Dashboard by Gavin & Mindrose Team"，同步更新元数据、JSON-LD Schema、页脚和翻译文案。
- 修复落地页标题层级：板块标题从 `<h3>` 升级为 `<h2>`，子板块标题从 `<h4>` 升级为 `<h3>`。

### v0.2.3

**新增：**

- 全站 SEO 优化：`generateMetadata()` 动态元数据（规范 URL、OpenGraph、Twitter 卡片、hreflang 语言标注）。
- JSON-LD 结构化数据：双语 `SoftwareApplication` + `FAQPage` Schema（通过 `src/lib/schema.ts` 生成）。
- 构建时 `robots.txt` 和 `sitemap.xml` 生成（通过 `src/app/robots.ts` 和 `src/app/sitemap.ts`）。
- `<noscript>` 爬虫回退内容（`LandingContent.tsx`），确保不执行 JavaScript 的搜索引擎也能抓取落地页文字。
- 落地页主题感知背景图片 — CSV 和图表主题素描图，随浅色/深色模式切换。
- 仪表盘视图新增语义化隐藏 H1，便于屏幕阅读器和搜索引擎读取。

**改进：**

- `layout.tsx` 升级为 `generateMetadata()`，实现构建时动态 SEO 注入。
- `LandingPage.tsx` 新增 `LandingContent` SEO 回退渲染和主题感知背景装饰。
- `FooterBar.tsx` 提取为独立组件，支持 `animate` 和 `sectionRef` 属性。
- `TitleBar.tsx` 提取为独立组件，包含 Logo、GitHub 图标和统一布局。
- 新增 `warning` 翻译分组（日期不匹配、缺少费用数据、缓存数据不完整、数据结构不一致）。
- 更新 DropZone 组件背景样式，优化拖拽交互效果。

### v0.2.2

**新增：**

- 新增 Logo 图标和 favicon.ico 文件 — 在 TitleBar 和浏览器标签页中展示品牌标识。
- 替换项目英文默认字体为本地 Hubot Sans WOFF2 文件（3 个字重：400/500/700）。

**改进：**

- 重新设计语言切换器为 Apple 风格胶囊分段控件，支持 `role="radio"` 无障碍属性。
- 重新设计主题切换器为 SVG 太阳/月亮图标按钮，hover 时显示圆形背景。
- TitleBar 新增 GitHub 图标链接，方便快速访问代码仓库。
- FooterBar 新增版本号显示，与版权信息和 GitHub 链接并列。
- DropZone 拖拽区新增主题化背景色（`--dropzone-bg`），替换原先的透明背景。
- Landing 页面内容容器从 `max-w-3xl` 扩宽至 `max-w-6xl`，视觉更平衡。
- Landing 页面新增滚动渐显动画（Intersection Observer 驱动的淡入 + 上滑效果）。
- 常见问题区域新增手风琴展开/折叠动画。
- FooterBar 新增移动端友好的 flex-wrap 布局，小屏幕下文字自动换行。
- 更新中英双语文案，完善上传区域的提示文本，修正省略号格式。
- 添加全局无障碍样式：平滑滚动、`prefers-reduced-motion` 适配、`color-scheme` 原生 UI、`focus-visible` 焦点轮廓。

### v0.2.1

**新增：**

- 构建完整的上传前落地页，包含 Hero 区、上传区、使用说明、常见问题和关于等模块。

### v0.2.0

**新增：**

- 实现完整的明暗主题切换功能，重构全局 CSS 样式，使用 CSS 变量统一管理双主题配色。
- 新增模型筛选功能，在 Dashboard 添加 Apple 风格分段胶囊过滤器，优化 UI 与数据展示。

**改进：**

- 优化整体 UI 交互与视觉样式。
- 重构所有视图组件，改用过滤后的数据渲染，新增顶部 Hero 大数字汇总模块。

### v0.1.0

**新增：**

- 搭建 DeepSeek API 使用分析仪表盘，实现 CSV 解析、多月份文件合并与错误校验逻辑，所有数据处理均在浏览器端完成。
- 开发拖拽上传组件、数据上下文与多维度可视化仪表盘页面。
- 新增完整多语言支持与语言切换功能，并重构数值格式化工具函数，适配不同语言的单位展示规则。

## 开源协议

MIT
