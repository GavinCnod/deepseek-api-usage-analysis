/**
 * 文件说明：Glossary「什么是 X」页面双语内容。
 *
 * 每个术语一条完整的内容定义（标题、描述、关键词、定义正文、FAQ），
 * 由 GlossaryPage / GlossaryContent 与 routeMetadata 共同消费，
 * 保证页面可见文本、Metadata 与 JSON-LD 三处一致。
 */

/** 术语 slug。 */
export type GlossarySlug =
  | "what-is-deepseek-cache-hit-rate"
  | "what-is-deepseek-context-caching"
  | "what-is-deepseek-off-peak-pricing";

/** 单个 FAQ 条目。 */
export interface GlossaryFaqItem {
  q: string;
  a: string;
}

/** 单个正文章节。 */
export interface GlossarySection {
  heading: string;
  paragraphs: string[];
}

/** 单个 Glossary 术语的完整双语内容。 */
export interface GlossaryPageContent {
  /** SEO title。 */
  seoTitle: { en: string; zh: string };
  /** Meta description。 */
  description: { en: string; zh: string };
  /** Meta keywords。 */
  keywords: { en: string[]; zh: string[] };
  /** 页面 H1。 */
  heroTitle: { en: string; zh: string };
  /** H1 下方一句话定义。 */
  definition: { en: string; zh: string };
  /** 正文章节。 */
  sections: { en: GlossarySection[]; zh: GlossarySection[] };
  /** FAQ。 */
  faq: { en: GlossaryFaqItem[]; zh: GlossaryFaqItem[] };
}

/** 术语路径（构建相关链接与 sitemap 使用）。 */
export const GLOSSARY_PATHS: Record<GlossarySlug, string> = {
  "what-is-deepseek-cache-hit-rate": "/what-is-deepseek-cache-hit-rate",
  "what-is-deepseek-context-caching": "/what-is-deepseek-context-caching",
  "what-is-deepseek-off-peak-pricing": "/what-is-deepseek-off-peak-pricing",
};

/** 全部术语 slug 的有序列表。 */
export const GLOSSARY_SLUGS: GlossarySlug[] = [
  "what-is-deepseek-cache-hit-rate",
  "what-is-deepseek-context-caching",
  "what-is-deepseek-off-peak-pricing",
];

/** 术语在 EN/ZH 下的简短名称（用于相关页面链接）。 */
export const GLOSSARY_NAMES: Record<GlossarySlug, { en: string; zh: string }> = {
  "what-is-deepseek-cache-hit-rate": {
    en: "DeepSeek Cache Hit Rate",
    zh: "DeepSeek 缓存命中率",
  },
  "what-is-deepseek-context-caching": {
    en: "DeepSeek Context Caching",
    zh: "DeepSeek 上下文缓存",
  },
  "what-is-deepseek-off-peak-pricing": {
    en: "DeepSeek Off-Peak Pricing",
    zh: "DeepSeek 闲时定价",
  },
};

/** 各术语完整双语内容。 */
export const GLOSSARY_CONTENT: Record<GlossarySlug, GlossaryPageContent> = {
  "what-is-deepseek-cache-hit-rate": {
    seoTitle: {
      en: "What Is DeepSeek Cache Hit Rate? — 2026 Guide",
      zh: "什么是 DeepSeek 缓存命中率？— 2026 指南",
    },
    description: {
      en: "DeepSeek cache hit rate measures the share of input tokens billed at the reduced cache-hit price. Learn how it's calculated, what good looks like, and how to raise it.",
      zh: "DeepSeek 缓存命中率衡量输入 token 中以缓存命中低价计费的比例。了解它如何计算、健康值是多少，以及如何提升。",
    },
    keywords: {
      en: ["what is DeepSeek cache hit rate", "DeepSeek cache hit rate meaning", "DeepSeek cache hit rate benchmark", "how to improve DeepSeek cache hit rate", "DeepSeek caching"],
      zh: ["DeepSeek 缓存命中率是什么", "DeepSeek 缓存命中率含义", "DeepSeek 缓存命中率基准", "如何提升 DeepSeek 缓存命中率", "DeepSeek 缓存"],
    },
    heroTitle: {
      en: "What Is DeepSeek Cache Hit Rate?",
      zh: "什么是 DeepSeek 缓存命中率？",
    },
    definition: {
      en: "DeepSeek cache hit rate is the share of your input tokens that are billed at the reduced cache-hit price instead of the full input price — the higher the better, since cached input costs as little as 1/30 of the uncached rate.",
      zh: "DeepSeek 缓存命中率是输入 token 中按「缓存命中」低价而非全价计费的比例——越高越好，因为缓存命中输入最低仅需未命中单价的 1/30。",
    },
    sections: {
      en: [
        {
          heading: "How it's measured",
          paragraphs: [
            "DeepSeek's usage exports include two input-token rows per request: input_cache_hit_tokens and input_cache_miss_tokens. The cache hit rate is simply cache hits divided by total input tokens (hits + misses).",
            "A hit rate of 50% means half of your input tokens rode the cached lane. Because DeepSeek bills cache hits at roughly 1/30 of the uncached rate, that single number has an outsized effect on your bill: raising it from 20% to 60% can cut input costs by more than half.",
          ],
        },
        {
          heading: "What a good rate looks like",
          paragraphs: [
            "Real-world DeepSeek workloads routinely sit between 40% and 96%. On OpenCode Go, for example, DeepSeek V4 Flash holds a 96% real-world cache-hit rate, which is why its effective cost is far below the sticker price.",
            "As a practical band: below 20% usually means your stable prefix is too short or variable content appears too early in the prompt; 20–40% is workable but has room; 40–60% is strong; 60%+ is excellent for repetitive workflows like customer support and templated extraction.",
          ],
        },
        {
          heading: "How to raise it",
          paragraphs: [
            "DeepSeek uses prefix matching: it caches computation starting from the first token, so anything that changes at the front of your prompt invalidates the cache. Keep system prompts fixed, place dynamic content last, and version prompt changes deliberately.",
            "The easiest way to see your real rate is to upload your billing CSVs to a usage dashboard — the charts will show your daily cache hit rate and per-key hits vs misses at a glance.",
          ],
        },
      ],
      zh: [
        {
          heading: "如何计算",
          paragraphs: [
            "DeepSeek 的用量导出会为每个请求包含两行输入 token 数据：input_cache_hit_tokens（缓存命中）与 input_cache_miss_tokens（缓存未命中）。缓存命中率就是缓存命中量除以总输入 token（命中 + 未命中）。",
            "命中率 50% 意味着一半输入 token 走了缓存通道。由于 DeepSeek 对缓存命中按未命中价的约 1/30 计费，这一个数字对账单的影响极其显著：从 20% 提升到 60%，输入成本可降低一半以上。",
          ],
        },
        {
          heading: "健康的命中率是多少",
          paragraphs: [
            "真实 DeepSeek 负载的命中率通常在 40% 到 96% 之间。例如在 OpenCode Go 上，DeepSeek V4 Flash 的真实缓存命中率达 96%，这就是它实际成本远低于标价的原因。",
            "实用区间：低于 20% 通常意味着稳定前缀太短，或可变内容在 prompt 中太靠前；20–40% 可用但仍有空间；40–60% 很强；60%+ 对客服、模板化抽取等重复工作流非常优秀。",
          ],
        },
        {
          heading: "如何提升",
          paragraphs: [
            "DeepSeek 采用前缀匹配：从第一个 token 开始缓存计算结果，因此 prompt 开头的任何变动都会使缓存失效。保持 system prompt 固定、把动态内容放在最后、把 prompt 改动当发布版本一样管理。",
            "查看真实命中率最直接的方式：把账单 CSV 上传到用量分析仪表盘，图表会一目了然地展示每日缓存命中率和各 Key 的命中/未命中对比。",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          q: "Is a higher DeepSeek cache hit rate always better?",
          a: "Yes — cached input tokens are billed at about 1/30 of the uncached rate, so every percentage point of hit rate reduces your input cost. There's no downside to a higher rate; the only question is how to structure prompts to reach it.",
        },
        {
          q: "What is a good DeepSeek cache hit rate?",
          a: "Real workloads range from 40% to 96%. On OpenCode Go, DeepSeek V4 Flash sustains 96%. Below 20% is a red flag that your prompt prefix isn't stable; 40%+ is healthy for most production teams.",
        },
        {
          q: "Where can I see my actual cache hit rate?",
          a: "Upload your DeepSeek billing CSVs to a usage dashboard. It computes hit rate from the input_cache_hit_tokens and input_cache_miss_tokens columns and charts the daily trend plus per-key breakdown.",
        },
      ],
      zh: [
        {
          q: "DeepSeek 缓存命中率越高越好吗？",
          a: "是——缓存命中输入按未命中价的约 1/30 计费，命中率每提高一个百分点都在降低输入成本。更高的命中率没有坏处，唯一的问题是能否通过 prompt 结构达成。",
        },
        {
          q: "多少算健康的 DeepSeek 缓存命中率？",
          a: "真实负载通常在 40% 到 96% 之间。OpenCode Go 上的 DeepSeek V4 Flash 维持在 96%。低于 20% 说明 prompt 前缀不稳定；对多数生产团队 40% 以上即健康。",
        },
        {
          q: "在哪里能查看我的真实缓存命中率？",
          a: "把 DeepSeek 账单 CSV 上传到用量分析仪表盘即可。它从 input_cache_hit_tokens 与 input_cache_miss_tokens 两列计算命中率，并展示每日趋势和各 Key 明细。",
        },
      ],
    },
  },
  "what-is-deepseek-context-caching": {
    seoTitle: {
      en: "What Is DeepSeek Context Caching? — How It Cuts API Costs",
      zh: "什么是 DeepSeek 上下文缓存？— 如何降低 API 成本",
    },
    description: {
      en: "DeepSeek context caching reuses computation for repeated prompt prefixes, billing cached input at 1/30 of the normal rate. Learn how prefix matching works and how to exploit it.",
      zh: "DeepSeek 上下文缓存复用重复 prompt 前缀的计算结果，缓存命中输入按普通价的 1/30 计费。了解前缀匹配机制与利用方法。",
    },
    keywords: {
      en: ["what is DeepSeek context caching", "DeepSeek context caching", "DeepSeek disk caching", "DeepSeek prompt caching", "how DeepSeek caching works", "DeepSeek cache hit price"],
      zh: ["什么是 DeepSeek 上下文缓存", "DeepSeek 上下文缓存", "DeepSeek 磁盘缓存", "DeepSeek prompt 缓存", "DeepSeek 缓存机制", "DeepSeek 缓存命中价格"],
    },
    heroTitle: {
      en: "What Is DeepSeek Context Caching?",
      zh: "什么是 DeepSeek 上下文缓存？",
    },
    definition: {
      en: "DeepSeek context caching (also called disk caching) stores the computation for prompt prefixes and reuses it on matching requests, billing cached input at about 1/30 of the normal input price.",
      zh: "DeepSeek 上下文缓存（也称磁盘缓存）会存储 prompt 前缀的计算结果并在匹配请求时复用，缓存命中输入按普通输入价的约 1/30 计费。",
    },
    sections: {
      en: [
        {
          heading: "How prefix matching works",
          paragraphs: [
            "DeepSeek caches the computation results for prompts starting from the first token. When you send a new request, the system checks whether the beginning of your prompt matches a previously cached prefix. If it does, the cached computation is reused — and you're charged the cache-hit price instead of the full input price.",
            "The critical detail: matching is prefix-based and starts from token 1. Change anything at the beginning of your prompt — even a single character — and the entire cache is invalidated.",
          ],
        },
        {
          heading: "The pricing difference",
          paragraphs: [
            "As of August 2026, DeepSeek V4 Flash charges ¥3.00 per million input tokens for cache misses at peak, but only ¥0.10 per million for cache hits — a 96.7% discount. For V4 Pro the ratio is identical: ¥9.00 miss vs ¥0.30 hit at peak. Off-peak, both are halved again.",
            "This makes caching the single biggest cost lever in DeepSeek's billing model. A stable system prompt plus reusable context is effectively free to send, while unique one-off prompts pay full input price.",
          ],
        },
        {
          heading: "How to exploit it",
          paragraphs: [
            "Keep system prompts absolutely fixed and placed at the front of every request. Put dynamic content — user queries, timestamps, results — after the reusable prefix. Version prompt changes deliberately and watch the hit-rate trend after each change.",
            "The four usage CSV types make caching visible: input_cache_hit_tokens and input_cache_miss_tokens are exported per request, so you can measure your real hit rate and per-key cache economics from billing data alone.",
          ],
        },
      ],
      zh: [
        {
          heading: "前缀匹配机制",
          paragraphs: [
            "DeepSeek 会从第一个 token 开始缓存 prompt 的计算结果。当你发送新请求时，系统会检查 prompt 开头是否与已缓存的前缀匹配。如果匹配，就复用缓存结果——并只收取缓存命中价格，而非完整输入价。",
            "关键细节：匹配是前缀式的且从第 1 个 token 开始。只要改动 prompt 开头的任何内容——哪怕一个字符——整个缓存都会失效。",
          ],
        },
        {
          heading: "价格差异有多大",
          paragraphs: [
            "截至 2026 年 8 月，DeepSeek V4 Flash 缓存未命中输入高峰价 ¥3.00/百万，而缓存命中仅 ¥0.10/百万——折扣高达 96.7%。V4 Pro 比例相同：高峰 ¥9.00 未命中 vs ¥0.30 命中。闲时两者再减半。",
            "这让缓存成为 DeepSeek 计费模型中最大的成本杠杆。稳定的 system prompt 加上可复用上下文几乎等于免费发送，而一次性独有 prompt 则按全价计费。",
          ],
        },
        {
          heading: "如何利用缓存",
          paragraphs: [
            "保持 system prompt 绝对固定并置于每次请求开头。把动态内容——用户查询、时间戳、结果——放在可复用前缀之后。像发布版本一样管理 prompt 改动，并在每次变更后观察命中率趋势。",
            "四种用量 CSV 类型让缓存变得可见：每个请求都会导出 input_cache_hit_tokens 与 input_cache_miss_tokens，因此仅凭账单数据就能测出真实命中率与各 Key 的缓存经济。",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          q: "What is the difference between context caching and cache hit rate?",
          a: "Context caching is the mechanism (storing and reusing prefix computation); cache hit rate is the metric (the share of input tokens billed at the reduced rate). Good prompt structure raises the hit rate, which is how you capture caching's savings.",
        },
        {
          q: "How much does DeepSeek context caching save?",
          a: "Cached input is billed at about 1/30 of the uncached input rate — a ~96.7% discount. On a high-hit-rate workload this can cut total input cost by more than half.",
        },
        {
          q: "Does changing my system prompt break the cache?",
          a: "Yes. DeepSeek caching is prefix-based from token 1, so any change at the start of the prompt invalidates the whole cache. Treat prompt changes like code releases and monitor the hit-rate trend afterward.",
        },
      ],
      zh: [
        {
          q: "上下文缓存和缓存命中率有什么区别？",
          a: "上下文缓存是机制（存储并复用前缀计算），缓存命中率是指标（以低价计费的输入 token 占比）。良好的 prompt 结构能提升命中率，这正是获取缓存收益的方式。",
        },
        {
          q: "DeepSeek 上下文缓存能省多少钱？",
          a: "缓存命中输入按未命中输入的约 1/30 计费——约 96.7% 的折扣。在高命中率负载下，可令总输入成本降低一半以上。",
        },
        {
          q: "修改 system prompt 会破坏缓存吗？",
          a: "会。DeepSeek 缓存从第 1 个 token 起前缀匹配，prompt 开头的任何改动都会使整个缓存失效。请把 prompt 改动当作代码发布，并在之后监控命中率趋势。",
        },
      ],
    },
  },
  "what-is-deepseek-off-peak-pricing": {
    seoTitle: {
      en: "What Is DeepSeek Off-Peak Pricing? — Peak Hours Explained",
      zh: "什么是 DeepSeek 闲时定价？— 高峰时段详解",
    },
    description: {
      en: "DeepSeek bills off-peak hours at 50% off. Learn the exact Beijing peak windows (09:00–12:00, 14:00–18:00), which models it applies to, and how to schedule work around it.",
      zh: "DeepSeek 对闲时时段按 5 折计费。了解精确的北京高峰窗口（09:00–12:00、14:00–18:00）、适用的模型，以及如何据此调度任务。",
    },
    keywords: {
      en: ["what is DeepSeek off-peak pricing", "DeepSeek off-peak hours", "DeepSeek peak hours", "DeepSeek peak off-peak pricing", "DeepSeek time-of-day pricing", "DeepSeek 50% off"],
      zh: ["什么是 DeepSeek 闲时定价", "DeepSeek 闲时时段", "DeepSeek 高峰时段", "DeepSeek 高峰闲时定价", "DeepSeek 分时定价", "DeepSeek 5 折"],
    },
    heroTitle: {
      en: "What Is DeepSeek Off-Peak Pricing?",
      zh: "什么是 DeepSeek 闲时定价？",
    },
    definition: {
      en: "DeepSeek off-peak pricing bills API usage at 50% of the peak rate during every hour outside two Beijing-time windows: 09:00–12:00 and 14:00–18:00.",
      zh: "DeepSeek 闲时定价对两个北京时间窗口（09:00–12:00、14:00–18:00）之外的每一小时按高峰价 5 折计费。",
    },
    sections: {
      en: [
        {
          heading: "The exact hours",
          paragraphs: [
            "DeepSeek splits the day in half. Peak hours are Beijing time 09:00–12:00 and 14:00–18:00 and bill at full price; everything else is billed at 50% off. Note the windows are Beijing time — if your servers run in UTC, the discount hours land at 01:00–04:00 UTC and 06:00–10:00 UTC.",
            "There are no weekend or holiday exceptions in the published model — the same two windows apply every day.",
          ],
        },
        {
          heading: "Which models and prices it applies to",
          paragraphs: [
            "Off-peak pricing applies to DeepSeek's own models, which carry a peak/off-peak price pair: V4 Flash (¥3.00 → ¥1.50 input, ¥9.00 → ¥4.50 output at peak/off-peak) and V4 Pro (¥9.00 → ¥4.50 input, ¥27.00 → ¥13.50 output). Cache-hit input is likewise halved (¥0.10 → ¥0.05 for Flash).",
            "Competitor models billed through other providers follow their own pricing; DeepSeek's off-peak discount is specific to DeepSeek-owned models.",
          ],
        },
        {
          heading: "How to use it",
          paragraphs: [
            "Move batch jobs, cron workloads, and nightly summarization pipelines to off-peak hours. A nightly pipeline generating 100M output tokens on V4 Flash costs ¥900 at peak — or ¥450 after 8 PM. Same tokens, same model, zero code changes, one scheduling tweak.",
            "Interactive traffic naturally lands in peak windows; if you can't shift the traffic itself, consider caching to offset the input-side peak cost. Off-peak scheduling and a high cache hit rate are the two biggest levers on a DeepSeek bill.",
          ],
        },
      ],
      zh: [
        {
          heading: "精确时段",
          paragraphs: [
            "DeepSeek 把一天分成两半。高峰时段为北京时间 09:00–12:00 和 14:00–18:00，按全价计费；其余时间一律 5 折。注意窗口以北京时间为准——如果你的服务器跑在 UTC，折扣时段落在 01:00–04:00 UTC 和 06:00–10:00 UTC。",
            "已公布的计费模型中不存在周末或节假日例外——每天都是同样的两个窗口。",
          ],
        },
        {
          heading: "适用哪些模型和价格",
          paragraphs: [
            "闲时定价适用于 DeepSeek 自有模型，它们带有高峰/闲时价格对：V4 Flash（高峰 ¥3.00 → 闲时 ¥1.50 输入，¥9.00 → ¥4.50 输出）与 V4 Pro（¥9.00 → ¥4.50 输入，¥27.00 → ¥13.50 输出）。缓存命中输入同样减半（Flash ¥0.10 → ¥0.05）。",
            "通过其他服务商计费的竞品模型按各自的定价执行；DeepSeek 的闲时折扣仅适用于 DeepSeek 自有模型。",
          ],
        },
        {
          heading: "如何利用",
          paragraphs: [
            "把批量任务、cron 工作负载和夜间摘要流水线移到闲时。一个每晚在 V4 Flash 上生成 1 亿输出 token 的流水线，高峰需 ¥900——晚 8 点后只要 ¥450。同样的 token、同样的模型、零代码改动，只需一次调度调整。",
            "交互式流量天然集中在高峰窗口；如果流量本身无法挪动，可以考虑用缓存来对冲输入侧的峰值成本。闲时调度与高缓存命中率是 DeepSeek 账单上最大的两个杠杆。",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          q: "What are DeepSeek's exact peak hours?",
          a: "Beijing time 09:00–12:00 and 14:00–18:00 every day. All other hours are billed at 50% off the peak price.",
        },
        {
          q: "Does off-peak pricing apply to all DeepSeek models?",
          a: "Yes — DeepSeek's own models (V4 Flash, V4 Pro) carry peak/off-peak price pairs on input, output, and cache-hit input alike. Competitor models billed through other providers follow their own pricing.",
        },
        {
          q: "How much can I save by running at off-peak?",
          a: "50% off every billable rate. A nightly 100M-output-token V4 Flash job costs ¥900 at peak but ¥450 off-peak — the same tokens at half the price.",
        },
      ],
      zh: [
        {
          q: "DeepSeek 的精确高峰时段是什么？",
          a: "每天北京时间 09:00–12:00 与 14:00–18:00。其余所有时段按高峰价 5 折计费。",
        },
        {
          q: "闲时定价适用于所有 DeepSeek 模型吗？",
          a: "适用——DeepSeek 自有模型（V4 Flash、V4 Pro）在输入、输出与缓存命中输入上都带高峰/闲时价格对。通过其他服务商计费的竞品模型按各自定价执行。",
        },
        {
          q: "闲时运行能省多少？",
          a: "所有可计费费率一律 5 折。一个每晚生成 1 亿输出 token 的 V4 Flash 任务，高峰 ¥900，闲时只要 ¥450——同样的 token，一半的价格。",
        },
      ],
    },
  },
};

/** 按术语 slug 读取双语内容。 */
export function getGlossaryContent(slug: GlossarySlug) {
  return GLOSSARY_CONTENT[slug];
}
