/**
 * 文件说明：各模型独立定价落地页的双语 SEO 内容。
 *
 * 每个模型一条完整的内容定义（标题、描述、关键词、正文要点、FAQ），
 * 由 ModelPricingPage / ModelPricingContent 与 routeMetadata 共同消费，
 * 保证页面可见文本、Metadata 与 JSON-LD 三处一致。
 *
 * 定价数字不在此处维护，统一来自 @/lib/modelPricing 的 MODEL_PRICING。
 */
import type { Locale } from "@/i18n/translations";
import type { ModelKey } from "@/lib/modelPricing";

/** 单个 FAQ 条目。 */
export interface ModelFaqItem {
  q: string;
  a: string;
}

/** 单模型定价落地页的完整双语内容。 */
export interface ModelPricingPageContent {
  /** SEO title（避免与 H1 完全重复，可在尾部附加站点品牌）。 */
  seoTitle: Record<Locale, string>;
  /** Meta description。 */
  description: Record<Locale, string>;
  /** Meta keywords。 */
  keywords: Record<Locale, string[]>;
  /** 页面 H1。 */
  heroTitle: Record<Locale, string>;
  /** H1 下方简短说明。 */
  heroSubtitle: Record<Locale, string>;
  /** 简介段落（唯一文案）。 */
  intro: Record<Locale, string>;
  /** 3 个关键事实卡片（唯一文案）。 */
  facts: Record<
    Locale,
    { title: string; desc: string }[]
  >;
  /** “该模型适合谁” 段落。 */
  bestForTitle: Record<Locale, string>;
  bestFor: Record<Locale, string>;
  /** 定价备注（高峰/闲时、货币换算等）。 */
  pricingNoteTitle: Record<Locale, string>;
  pricingNote: Record<Locale, string>;
  /** 与直接竞品的一句话对比。 */
  vsTitle: Record<Locale, string>;
  vs: Record<Locale, string>;
  /** FAQ（每模型唯一）。 */
  faq: { en: ModelFaqItem[]; zh: ModelFaqItem[] };
}

/** 每个模型独立的 FAQ 数据，按模型 key 归组。 */
const FAQ: Record<ModelKey, { en: ModelFaqItem[]; zh: ModelFaqItem[] }> = {
  v4Flash: {
    en: [
      {
        q: "What is the price of DeepSeek V4 Flash per million tokens?",
        a: "DeepSeek V4 Flash bills ¥3.00 per million input tokens and ¥9.00 per million output tokens at peak hours (Beijing 09:00–12:00 and 14:00–18:00). Off-peak hours are 50% off: ¥1.50 input / ¥4.50 output. Cached input is charged at ¥0.10 peak / ¥0.05 off-peak — about 1/30 of the uncached rate.",
      },
      {
        q: "Is DeepSeek V4 Flash actually cheap enough for production workloads?",
        a: "Yes. With a 1M-token context window, a 96% real-world cache-hit rate, and reasoning scores that rival flagship models, V4 Flash has become the most-used coding model on Earth (69% of OpenCode Go's token share). For high-volume routine work it sets the floor for cost planning.",
      },
      {
        q: "How do DeepSeek peak and off-peak prices work for V4 Flash?",
        a: "DeepSeek splits the day in half: peak hours are Beijing time 09:00–12:00 and 14:00–18:00 and bill at full price; everything else is billed at 50% off. A nightly batch job generating 100M output tokens costs ¥900 at peak but only ¥450 after 8 PM — same tokens, zero code changes.",
      },
    ],
    zh: [
      {
        q: "DeepSeek V4 Flash 每百万 token 多少钱？",
        a: "DeepSeek V4 Flash 高峰时段（北京时间 09:00–12:00 与 14:00–18:00）输入 ¥3.00/百万、输出 ¥9.00/百万；闲时减半，输入 ¥1.50、输出 ¥4.50。缓存命中输入仅 ¥0.10/百万（闲时 ¥0.05），约为未命中单价的 1/30。",
      },
      {
        q: "DeepSeek V4 Flash 真的便宜到能支撑生产环境吗？",
        a: "能。V4 Flash 拥有 100 万 token 上下文窗口、96% 的真实缓存命中率和接近旗舰模型的推理分数，已成为全球使用率最高的编程模型（占 OpenCode Go 69% 的 token 用量）。对高并发常规任务，它就是成本规划的下限。",
      },
      {
        q: "V4 Flash 的高峰/闲时定价如何影响成本？",
        a: "DeepSeek 把一天分成两半：高峰时段为北京时间 09:00–12:00 和 14:00–18:00，按全价计费；其余时间一律 5 折。每晚批量任务生成 1 亿输出 token，高峰需 ¥900，晚 8 点后只要 ¥450——同样的 token，零代码改动。",
      },
    ],
  },
  v4Pro: {
    en: [
      {
        q: "What is the price of DeepSeek V4 Pro per million tokens?",
        a: "DeepSeek V4 Pro bills ¥9.00 per million input tokens and ¥27.00 per million output tokens at peak (Beijing 09:00–12:00, 14:00–18:00); off-peak is 50% off at ¥4.50 / ¥13.50. Cache-hit input is ¥0.30 peak / ¥0.15 off-peak, again about 1/30 of the uncached rate.",
      },
      {
        q: "When should I use V4 Pro instead of V4 Flash?",
        a: "V4 Pro targets structured reasoning, complex code generation, and long-context tasks where output quality offsets the 3× price delta. The real question is whether Pro cuts retries, human review, or downstream errors enough to justify the gap for your workload.",
      },
      {
        q: "Does V4 Pro support thinking mode and does it cost extra?",
        a: "V4 Pro's Thinking Mode produces chain-of-thought reasoning comparable to o1-level models. Reasoning tokens are billed at the output rate, so factor them into your estimates. Routing batch jobs and cron workloads to Beijing evening/night windows cuts the bill further thanks to off-peak pricing.",
      },
    ],
    zh: [
      {
        q: "DeepSeek V4 Pro 每百万 token 多少钱？",
        a: "DeepSeek V4 Pro 高峰时段（北京时间 09:00–12:00、14:00–18:00）输入 ¥9.00/百万、输出 ¥27.00/百万；闲时 5 折为 ¥4.50 / ¥13.50。缓存命中输入 ¥0.30/百万（闲时 ¥0.15），同样约为未命中单价的 1/30。",
      },
      {
        q: "什么场景应该用 V4 Pro 而不是 V4 Flash？",
        a: "V4 Pro 面向结构化推理、复杂代码生成和长上下文任务，其输出质量能抵消 3 倍的价格差距。真正的问题不是 Pro 是否更贵，而是它能否为你减少重试、人工复核或下游错误来补足差价。",
      },
      {
        q: "V4 Pro 支持思考模式吗？会额外收费吗？",
        a: "V4 Pro 的思考模式（Thinking Mode）能产生媲美 o1 级模型的链式推理。思考 token 按输出价计费，估算时要计入。把批量任务和 cron 任务调度到北京晚间/深夜窗口，还能借助闲时定价进一步降低成本。",
      },
    ],
  },
  gpt56Sol: {
    en: [
      {
        q: "How much does GPT-5.6 Sol cost per million tokens?",
        a: "GPT-5.6 Sol bills $5.00 per million input tokens and $30.00 per million output tokens on the standard tier. Cached input is $0.50 per million. OpenAI also offers a 50% Batch API discount for offline workloads, bringing output to $15.00.",
      },
      {
        q: "When does it make sense to pay flagship GPT-5.6 Sol prices?",
        a: "Only for the hard 10% of requests: rare, complex reasoning where a mid-tier or budget model demonstrably fails. In 2026 the value winners in nearly every price band are mid-tier or budget models — Sol exists for the rare request that justifies it.",
      },
      {
        q: "Does GPT-5.6 Sol have cache pricing?",
        a: "Yes. GPT-5.6 Sol charges $0.50 per million tokens for cached input (10× cheaper than the $5.00 uncached input rate), so keeping a stable prompt prefix materially lowers effective input cost.",
      },
    ],
    zh: [
      {
        q: "GPT-5.6 Sol 每百万 token 多少钱？",
        a: "GPT-5.6 Sol 标准档输入 $5.00/百万、输出 $30.00/百万，缓存命中输入 $0.50/百万。OpenAI 对离线任务提供 50% 的 Batch API 折扣，输出可降至 $15.00。",
      },
      {
        q: "什么情况下值得为旗舰 GPT-5.6 Sol 付费？",
        a: "只为那最难的 10% 请求：罕见、复杂的推理任务，且中档或廉价模型确实无法胜任。2026 年几乎每个价格带的价值冠军都是中档或廉价模型——Sol 的存在是为了那少数值得一掷千金的请求。",
      },
      {
        q: "GPT-5.6 Sol 有缓存定价吗？",
        a: "有。GPT-5.6 Sol 缓存命中输入为 $0.50/百万，是 $5.00 未命中价的十分之一。保持稳定的 prompt 前缀能显著降低实际输入成本。",
      },
    ],
  },
  gpt56Terra: {
    en: [
      {
        q: "What is the price of GPT-5.6 Terra per million tokens?",
        a: "GPT-5.6 Terra bills $2.00 per million input tokens and $12.00 per million output tokens, with cached input at $0.20 per million. It was cut 20% on July 30, 2026, and qualifies for OpenAI's 50% Batch API discount.",
      },
      {
        q: "How does Terra compare to Luna and Sol?",
        a: "Terra sits squarely between the flagship Sol ($5/$30) and the ultra-cheap Luna ($0.20/$1.20). It is the mid-tier choice for workloads that need more headroom than Luna but don't justify Sol's flagship price.",
      },
      {
        q: "Is Terra good for agentic coding workloads?",
        a: "For typical agent loops Terra is a balanced default — far cheaper than Sol on output-heavy work, with more reliability headroom than budget models. Model your exact token mix before committing, since output-heavy agent loops can flip the ranking.",
      },
    ],
    zh: [
      {
        q: "GPT-5.6 Terra 每百万 token 多少钱？",
        a: "GPT-5.6 Terra 输入 $2.00/百万、输出 $12.00/百万，缓存命中输入 $0.20/百万。2026 年 7 月 30 日降价 20%，并适用 OpenAI 50% 的 Batch API 折扣。",
      },
      {
        q: "Terra 相比 Luna 和 Sol 如何定位？",
        a: "Terra 正好位于旗舰 Sol（$5/$30）与极致低价 Luna（$0.20/$1.20）之间。它是中间档选择，适合需要比 Luna 更强余量、又不需要旗舰价格的负载。",
      },
      {
        q: "Terra 适合 agentic 编程负载吗？",
        a: "对典型 agent 循环，Terra 是均衡的默认选择——在输出密集型任务上远便宜于 Sol，又比廉价模型有更多可靠性余量。下单前务必用真实 token 组合建模，因为输出密集的 agent 循环可能改变排名。",
      },
    ],
  },
  gpt56Luna: {
    en: [
      {
        q: "What is the price of GPT-5.6 Luna per million tokens?",
        a: "GPT-5.6 Luna bills $0.20 per million input tokens and $1.20 per million output tokens, with cached input at just $0.02 per million. The July 30, 2026 price cut (80% off) turned it from 'cheap' into 'almost free'.",
      },
      {
        q: "How good is Luna despite the low price?",
        a: "OpenAI's own benchmarks show Luna nearly matching GPT-5.5's peak performance at less than half the cost, and outperforming Claude Opus 4.8 on coding. It's the definition of 'good enough, at a fraction of the price'.",
      },
      {
        q: "When should I avoid Luna?",
        a: "Luna's edge assumes mostly uncached input — its $0.20 input rate already counts as cheap. If your workload is output-heavy agent loops, a model with cheaper effective output per token may win; measure your real mix before locking anything in.",
      },
    ],
    zh: [
      {
        q: "GPT-5.6 Luna 每百万 token 多少钱？",
        a: "GPT-5.6 Luna 输入 $0.20/百万、输出 $1.20/百万，缓存命中输入仅 $0.02/百万。2026 年 7 月 30 日降价 80%，从「便宜」变成了「近乎免费」。",
      },
      {
        q: "Luna 价格这么低，性能靠谱吗？",
        a: "OpenAI 自己的基准显示，Luna 以不到一半的成本几乎追平 GPT-5.5 的峰值表现，在编程任务上还胜过 Claude Opus 4.8。这正是「够用就好、价格零头」的典范。",
      },
      {
        q: "什么时候不应该用 Luna？",
        a: "Luna 的优势前提是大部分输入未缓存——它 $0.20 的输入价本身已经够便宜。如果你的负载是输出密集的 agent 循环，每 token 有效输出价更低的模型可能更划算；锁定方案前务必先测你的真实组合。",
      },
    ],
  },
  claudeOpus5: {
    en: [
      {
        q: "What is the price of Claude Opus 5 per million tokens?",
        a: "Claude Opus 5 bills $5.00 per million input tokens and $25.00 per million output tokens, with cached input at $0.50 per million. Anthropic offers a 50% Batch API discount for offline workloads.",
      },
      {
        q: "When is Opus 5 worth the flagship price?",
        a: "Opus 5 is the top-tier choice for the hard 10% of requests where mid-tier or budget models fall short. For the other 90% of traffic, a mid-tier or budget model is typically the better value.",
      },
      {
        q: "Does Opus 5 have prompt caching?",
        a: "Yes. Claude Opus 5 charges $0.50 per million tokens for cached input — one-tenth of the uncached rate. Keeping a stable system prompt and reusable context prefix meaningfully reduces input cost.",
      },
    ],
    zh: [
      {
        q: "Claude Opus 5 每百万 token 多少钱？",
        a: "Claude Opus 5 输入 $5.00/百万、输出 $25.00/百万，缓存命中输入 $0.50/百万。Anthropic 对离线任务提供 50% 的 Batch API 折扣。",
      },
      {
        q: "什么时候值得为旗舰 Opus 5 付费？",
        a: "Opus 5 是那些中档或廉价模型无法胜任的「最难 10% 请求」的顶级选择。其余 90% 的流量，中档或廉价模型通常是更具性价比的选择。",
      },
      {
        q: "Opus 5 有 prompt 缓存吗？",
        a: "有。Claude Opus 5 缓存命中输入为 $0.50/百万，是未命中价的十分之一。保持稳定的 system prompt 和可复用的上下文前缀能显著降低输入成本。",
      },
    ],
  },
  claudeSonnet5: {
    en: [
      {
        q: "What is the price of Claude Sonnet 5 per million tokens?",
        a: "Claude Sonnet 5 bills $2.00 per million input tokens and $10.00 per million output tokens, with cached input at $0.20 per million. It qualifies for Anthropic's 50% Batch API discount.",
      },
      {
        q: "How does Sonnet 5 compare to Opus 5?",
        a: "Sonnet 5 costs 60% less than Opus 5 on output ($10 vs $25) while covering the majority of production coding and agent workloads. It's the mid-tier workhorse between Haiku 4.5 and Opus 5.",
      },
      {
        q: "Is Sonnet 5 good for agentic workflows?",
        a: "Yes — it's the default mid-tier choice for agent loops that need more reasoning headroom than Haiku 4.5 but don't require Opus 5's ceiling. Model your token mix to confirm the trade-off.",
      },
    ],
    zh: [
      {
        q: "Claude Sonnet 5 每百万 token 多少钱？",
        a: "Claude Sonnet 5 输入 $2.00/百万、输出 $10.00/百万，缓存命中输入 $0.20/百万，并适用 Anthropic 50% 的 Batch API 折扣。",
      },
      {
        q: "Sonnet 5 相比 Opus 5 如何？",
        a: "Sonnet 5 的输出价比 Opus 5 便宜 60%（$10 vs $25），却能覆盖绝大多数生产级编程和 agent 负载。它是介于 Haiku 4.5 与 Opus 5 之间的中档主力。",
      },
      {
        q: "Sonnet 5 适合 agentic 工作流吗？",
        a: "适合——它是 agent 循环的中档默认选择，推理余量比 Haiku 4.5 更足，又不需要 Opus 5 的天花板。用你的 token 组合建模确认权衡即可。",
      },
    ],
  },
  claudeHaiku45: {
    en: [
      {
        q: "What is the price of Claude Haiku 4.5 per million tokens?",
        a: "Claude Haiku 4.5 bills $1.00 per million input tokens and $5.00 per million output tokens, with cached input at $0.10 per million — Anthropic's budget tier for high-volume, latency-sensitive work.",
      },
      {
        q: "When should I use Haiku 4.5 instead of Sonnet 5?",
        a: "Haiku 4.5 is the right call for high-volume, simpler tasks — classification, extraction, summarization, and straightforward tool calls — where the extra reasoning headroom of Sonnet 5 isn't needed. It also benefits from Anthropic's 50% Batch discount.",
      },
      {
        q: "Does Haiku 4.5 support caching?",
        a: "Yes. Cached input is $0.10 per million tokens, one-tenth of the uncached input rate, making stable-prefix workloads especially cheap at this tier.",
      },
    ],
    zh: [
      {
        q: "Claude Haiku 4.5 每百万 token 多少钱？",
        a: "Claude Haiku 4.5 输入 $1.00/百万、输出 $5.00/百万，缓存命中输入 $0.10/百万——Anthropic 面向高并发、低延迟任务的廉价档。",
      },
      {
        q: "什么时候用 Haiku 4.5 而不是 Sonnet 5？",
        a: "Haiku 4.5 适合高并发、更简单的任务——分类、抽取、摘要和直接的工具调用——这类场景不需要 Sonnet 5 的推理余量。它同样享受 Anthropic 50% 的 Batch 折扣。",
      },
      {
        q: "Haiku 4.5 支持缓存吗？",
        a: "支持。缓存命中输入为 $0.10/百万，是未命中价的十分之一，稳定的前缀负载在此档尤其便宜。",
      },
    ],
  },
};

/** 各模型完整双语 SEO 内容定义。 */
export const MODEL_PRICING_CONTENT: Record<ModelKey, ModelPricingPageContent> = {
  v4Flash: {
    seoTitle: {
      en: "DeepSeek V4 Flash API Pricing (2026) — Per Million Tokens",
      zh: "DeepSeek V4 Flash API 价格 (2026) — 每百万 Token 单价",
    },
    description: {
      en: "DeepSeek V4 Flash API pricing as of 2026: ¥3.00 input / ¥9.00 output per million tokens at peak, 50% off off-peak, ¥0.10 cached input. 1M context, 96% cache hit rate.",
      zh: "DeepSeek V4 Flash API 价格（2026 最新）：高峰输入 ¥3.00/百万、输出 ¥9.00/百万，闲时 5 折，缓存命中输入 ¥0.10/百万。100 万上下文，96% 缓存命中率。",
    },
    keywords: {
      en: ["DeepSeek V4 Flash price", "DeepSeek V4 Flash pricing", "DeepSeek V4 Flash cost", "DeepSeek V4 Flash per million tokens", "DeepSeek V4 Flash API price 2026"],
      zh: ["DeepSeek V4 Flash 价格", "DeepSeek V4 Flash 定价", "DeepSeek V4 Flash 费用", "DeepSeek V4 Flash 每百万 token 价格", "DeepSeek V4 Flash API 价格"],
    },
    heroTitle: { en: "DeepSeek V4 Flash API Pricing", zh: "DeepSeek V4 Flash API 定价" },
    heroSubtitle: {
      en: "¥3.00 input · ¥9.00 output per 1M tokens at peak — 50% off off-peak. The most-used coding model on Earth.",
      zh: "高峰 ¥3.00 输入 · ¥9.00 输出/百万 token — 闲时 5 折。全球使用率最高的编程模型。",
    },
    intro: {
      en: "DeepSeek V4 Flash has quietly become the most-used coding model on Earth — on OpenCode Go it holds a 69% token share. It combines a 1M-token context window, a 96% real-world cache-hit rate, and a reasoning score that rivals flagship models, at prices that make it the default workhorse for high-volume AI workloads.",
      zh: "DeepSeek V4 Flash 已悄然成为全球使用率最高的编程模型——在 OpenCode Go 上占据 69% 的 token 份额。它拥有 100 万 token 上下文窗口、96% 的真实缓存命中率，以及媲美旗舰模型的推理分数，价格却让它成为高并发 AI 负载的默认主力。",
    },
    facts: {
      en: [
        { title: "96% cache hit rate", desc: "Real-world cache-hit rates on OpenCode Go sit at 96%, so most input rides the cached lane at ¥0.10/1M peak." },
        { title: "1M token context", desc: "A 1M-token context window lets whole codebases and long conversations fit in a single request." },
        { title: "100/100 reasoning", desc: "Normalized reasoning score of 100/100 — it reasons like a flagship model at a fraction of the price." },
      ],
      zh: [
        { title: "96% 缓存命中率", desc: "OpenCode Go 上的真实缓存命中率达 96%，大部分输入走缓存通道，高峰仅 ¥0.10/百万。" },
        { title: "100 万上下文", desc: "100 万 token 上下文窗口，整个代码库和长对话都能放进一次请求。" },
        { title: "100/100 推理", desc: "标准化推理分数 100/100——以零头的价格给出旗舰级的推理能力。" },
      ],
    },
    bestForTitle: { en: "Best for", zh: "适合场景" },
    bestFor: {
      en: "High-volume coding agents, batch summarization, RAG pipelines, and any repetitive workflow where cost per token matters more than absolute ceiling. Still ~3× cheaper than V4 Pro at every hour, it's the best everyday agent model on the market.",
      zh: "高并发编程 agent、批量摘要、RAG 流水线，以及任何「每 token 成本比绝对上限更重要」的重复工作流。每小时的单价仍比 V4 Pro 便宜约 3 倍，是当前市场上最好的日常 agent 模型。",
    },
    pricingNoteTitle: { en: "Peak / off-peak billing", zh: "高峰 / 闲时计费" },
    pricingNote: {
      en: "Peak hours are Beijing time 09:00–12:00 and 14:00–18:00 and bill at full price; everything else is 50% off. Cached input is billed at 1/30 of the uncached rate (¥0.10 vs ¥3.00 at peak).",
      zh: "高峰时段为北京时间 09:00–12:00 和 14:00–18:00，按全价计费；其余时间一律 5 折。缓存命中输入按未命中价的 1/30 计费（高峰 ¥0.10 vs ¥3.00）。",
    },
    vsTitle: { en: "V4 Flash vs the competition", zh: "V4 Flash 与竞品对比" },
    vs: {
      en: "At off-peak rates, V4 Flash output costs ¥4.50 ($0.65) per million tokens — lower than GPT-5.6 Luna's $1.20 and a fraction of V4 Pro's ¥27.00 peak. It wins on cached input economics and context length against both OpenAI and Anthropic.",
      zh: "闲时价下，V4 Flash 输出 ¥4.50（约 $0.65）/百万——低于 GPT-5.6 Luna 的 $1.20，更远低于 V4 Pro 高峰的 ¥27.00。在缓存输入经济和上下文长度上均优于 OpenAI 与 Anthropic 的同类模型。",
    },
    faq: FAQ.v4Flash,
  },
  v4Pro: {
    seoTitle: {
      en: "DeepSeek V4 Pro API Pricing (2026) — Per Million Tokens",
      zh: "DeepSeek V4 Pro API 价格 (2026) — 每百万 Token 单价",
    },
    description: {
      en: "DeepSeek V4 Pro API pricing as of 2026: ¥9.00 input / ¥27.00 output per million tokens at peak, 50% off off-peak, ¥0.30 cached input. Thinking mode, 1M context.",
      zh: "DeepSeek V4 Pro API 价格（2026 最新）：高峰输入 ¥9.00/百万、输出 ¥27.00/百万，闲时 5 折，缓存命中输入 ¥0.30/百万。支持思考模式，100 万上下文。",
    },
    keywords: {
      en: ["DeepSeek V4 Pro price", "DeepSeek V4 Pro pricing", "DeepSeek V4 Pro cost", "DeepSeek V4 Pro per million tokens", "DeepSeek V4 Pro thinking mode price"],
      zh: ["DeepSeek V4 Pro 价格", "DeepSeek V4 Pro 定价", "DeepSeek V4 Pro 费用", "DeepSeek V4 Pro 每百万 token 价格", "DeepSeek V4 Pro 思考模式价格"],
    },
    heroTitle: { en: "DeepSeek V4 Pro API Pricing", zh: "DeepSeek V4 Pro API 定价" },
    heroSubtitle: {
      en: "¥9.00 input · ¥27.00 output per 1M tokens at peak — 50% off off-peak. Structured reasoning with o1-level thinking.",
      zh: "高峰 ¥9.00 输入 · ¥27.00 输出/百万 token — 闲时 5 折。o1 级思考能力的结构化推理。",
    },
    intro: {
      en: "DeepSeek V4 Pro is the flagship of the DeepSeek line: structured reasoning, complex code generation, and long-context mastery (1M tokens) with a Thinking Mode that produces chain-of-thought reasoning comparable to o1-level models — at a price point that makes it viable for high-volume production workloads.",
      zh: "DeepSeek V4 Pro 是 DeepSeek 系列的旗舰：结构化推理、复杂代码生成与长上下文掌控（100 万 token），其思考模式（Thinking Mode）能产生媲美 o1 级模型的链式推理——而价格让它同样适合大规模生产负载。",
    },
    facts: {
      en: [
        { title: "o1-level thinking", desc: "Thinking Mode produces chain-of-thought reasoning comparable to OpenAI o1-class models." },
        { title: "1M token context", desc: "Long-context tasks, whole-repo coding, and deep agent workflows fit comfortably." },
        { title: "3× Flash ceiling", desc: "About 3× V4 Flash at every hour — the extra quality is for the hard 10% of requests." },
      ],
      zh: [
        { title: "o1 级思考", desc: "思考模式能产生媲美 OpenAI o1 级模型的链式推理。" },
        { title: "100 万上下文", desc: "长上下文任务、整仓编程和深度 agent 工作流都能从容应对。" },
        { title: "Flash 的 3 倍上限", desc: "每小时约是 V4 Flash 的 3 倍——多花的钱用于最难的那 10% 请求。" },
      ],
    },
    bestForTitle: { en: "Best for", zh: "适合场景" },
    bestFor: {
      en: "Complex reasoning pipelines, whole-repo code generation, and production workloads where structured, verifiable output offsets the 3× price delta over V4 Flash.",
      zh: "复杂推理流水线、整仓代码生成，以及「结构化、可验证输出能抵消相对 V4 Flash 3 倍差价」的生产负载。",
    },
    pricingNoteTitle: { en: "Peak / off-peak billing", zh: "高峰 / 闲时计费" },
    pricingNote: {
      en: "Peak (Beijing 09:00–12:00, 14:00–18:00) bills at full price; all other hours are 50% off. Cached input is ¥0.30 peak / ¥0.15 off-peak — 1/30 of the uncached rate.",
      zh: "高峰（北京时间 09:00–12:00、14:00–18:00）按全价计费；其余时间一律 5 折。缓存命中输入 ¥0.30/百万（闲时 ¥0.15）——未命中价的 1/30。",
    },
    vsTitle: { en: "V4 Pro vs the competition", zh: "V4 Pro 与竞品对比" },
    vs: {
      en: "Against GPT-5.6 Sol ($5/$30) and Claude Opus 5 ($5/$25), V4 Pro at ¥9.00/$27.00 peak competes on output quality for a fraction of the cost — and its ¥4.50 off-peak output undercuts every flagship on the market.",
      zh: "对比 GPT-5.6 Sol（$5/$30）与 Claude Opus 5（$5/$25），V4 Pro 高峰 ¥9.00/$27.00 以零头价格提供同等输出质量——闲时输出 ¥4.50 更是低于市场上所有旗舰。",
    },
    faq: FAQ.v4Pro,
  },
  gpt56Sol: {
    seoTitle: {
      en: "GPT-5.6 Sol API Pricing (2026) — Per Million Tokens",
      zh: "GPT-5.6 Sol API 价格 (2026) — 每百万 Token 单价",
    },
    description: {
      en: "GPT-5.6 Sol API pricing as of 2026: $5.00 input / $30.00 output per million tokens, $0.50 cached input, 50% Batch discount. OpenAI's flagship.",
      zh: "GPT-5.6 Sol API 价格（2026 最新）：输入 $5.00/百万、输出 $30.00/百万，缓存命中输入 $0.50/百万，支持 50% Batch 折扣。OpenAI 旗舰模型。",
    },
    keywords: {
      en: ["GPT-5.6 Sol price", "GPT-5.6 Sol pricing", "GPT-5.6 Sol cost", "GPT-5.6 Sol per million tokens", "OpenAI GPT-5.6 pricing"],
      zh: ["GPT-5.6 Sol 价格", "GPT-5.6 Sol 定价", "GPT-5.6 Sol 费用", "GPT-5.6 Sol 每百万 token 价格", "OpenAI GPT-5.6 定价"],
    },
    heroTitle: { en: "GPT-5.6 Sol API Pricing", zh: "GPT-5.6 Sol API 定价" },
    heroSubtitle: {
      en: "$5.00 input · $30.00 output per 1M tokens — OpenAI's flagship ceiling for the hardest requests.",
      zh: "$5.00 输入 · $30.00 输出/百万 token — OpenAI 旗舰，为最难请求准备的天花板。",
    },
    intro: {
      en: "GPT-5.6 Sol is OpenAI's flagship: $5.00 input and $30.00 output per million tokens, with cached input at $0.50. In 2026 the value winners in nearly every price band are mid-tier or budget models — Sol exists for the rare request that justifies paying for the ceiling.",
      zh: "GPT-5.6 Sol 是 OpenAI 的旗舰：输入 $5.00、输出 $30.00/百万 token，缓存命中输入 $0.50。2026 年几乎每个价格带的价值冠军都是中档或廉价模型——Sol 的存在是为了那些值得付出天花板价格的罕见请求。",
    },
    facts: {
      en: [
        { title: "$5.00 / $30.00", desc: "Standard-tier list price for input and output per million tokens." },
        { title: "$0.50 cached input", desc: "Cached input is 10× cheaper than uncached, rewarding stable prompt prefixes." },
        { title: "50% Batch discount", desc: "Offline workloads qualify for OpenAI's Batch API discount, halving output cost." },
      ],
      zh: [
        { title: "$5.00 / $30.00", desc: "输入与输出的标准档百万 token 列表价。" },
        { title: "$0.50 缓存输入", desc: "缓存命中输入比未命中便宜 10 倍，稳定的 prompt 前缀更划算。" },
        { title: "50% Batch 折扣", desc: "离线任务适用 OpenAI 的 Batch API 折扣，输出价减半。" },
      ],
    },
    bestForTitle: { en: "Best for", zh: "适合场景" },
    bestFor: {
      en: "The hard 10% of requests: rare, complex reasoning and high-stakes generation where a mid-tier or budget model demonstrably fails. The other 90% should never pay flagship prices.",
      zh: "最难的那 10% 请求：罕见、复杂的推理和高风险生成，且中档或廉价模型确实无法胜任。其余 90% 不应为旗舰价格买单。",
    },
    pricingNoteTitle: { en: "Billing notes", zh: "计费说明" },
    pricingNote: {
      en: "Published API pricing as of August 2026, standard tier, USD per million tokens. GPT-5.6 models all qualify for the 50% Batch API discount for offline workloads.",
      zh: "2026 年 8 月发布的标准档 API 价格，USD/百万 token。GPT-5.6 全系适用离线负载的 50% Batch API 折扣。",
    },
    vsTitle: { en: "Sol vs the competition", zh: "Sol 与竞品对比" },
    vs: {
      en: "Against DeepSeek V4 Pro (¥9.00/$27.00 peak), Sol's $30.00 output is roughly 10% pricier than V4 Pro's peak output in USD terms yet represents the same flagship tier — with V4 Pro winning on off-peak economics and 1M context.",
      zh: "对比 DeepSeek V4 Pro（高峰 ¥9.00/$27.00），Sol 的 $30.00 输出价比 V4 Pro 高峰输出（美元计）贵约一成，同属旗舰档——但 V4 Pro 在闲时经济和 100 万上下文上更胜一筹。",
    },
    faq: FAQ.gpt56Sol,
  },
  gpt56Terra: {
    seoTitle: {
      en: "GPT-5.6 Terra API Pricing (2026) — Per Million Tokens",
      zh: "GPT-5.6 Terra API 价格 (2026) — 每百万 Token 单价",
    },
    description: {
      en: "GPT-5.6 Terra API pricing as of 2026: $2.00 input / $12.00 output per million tokens, $0.20 cached input, 50% Batch discount. The balanced mid-tier.",
      zh: "GPT-5.6 Terra API 价格（2026 最新）：输入 $2.00/百万、输出 $12.00/百万，缓存命中输入 $0.20/百万，支持 50% Batch 折扣。均衡的中档选择。",
    },
    keywords: {
      en: ["GPT-5.6 Terra price", "GPT-5.6 Terra pricing", "GPT-5.6 Terra cost", "GPT-5.6 Terra per million tokens", "OpenAI mid-tier model pricing"],
      zh: ["GPT-5.6 Terra 价格", "GPT-5.6 Terra 定价", "GPT-5.6 Terra 费用", "GPT-5.6 Terra 每百万 token 价格", "OpenAI 中档模型定价"],
    },
    heroTitle: { en: "GPT-5.6 Terra API Pricing", zh: "GPT-5.6 Terra API 定价" },
    heroSubtitle: {
      en: "$2.00 input · $12.00 output per 1M tokens — the balanced middle of the GPT-5.6 lineup.",
      zh: "$2.00 输入 · $12.00 输出/百万 token — GPT-5.6 家族中最均衡的中坚。",
    },
    intro: {
      en: "GPT-5.6 Terra sits between the flagship Sol and the ultra-cheap Luna: $2.00 input and $12.00 output per million tokens, with cached input at $0.20. Cut 20% on July 30, 2026, it's the default for workloads that need more headroom than Luna without paying for Sol's ceiling.",
      zh: "GPT-5.6 Terra 位于旗舰 Sol 与极致低价 Luna 之间：输入 $2.00、输出 $12.00/百万 token，缓存命中输入 $0.20。2026 年 7 月 30 日降价 20%，是需要比 Luna 更强余量、又不需要 Sol 天花板价格的负载的默认选择。",
    },
    facts: {
      en: [
        { title: "$2.00 / $12.00", desc: "Mid-tier list price for input and output per million tokens." },
        { title: "$0.20 cached input", desc: "Cached input at one-tenth of the uncached rate." },
        { title: "20% cut in July 2026", desc: "Terra was reduced 20% on July 30, 2026, improving its value positioning." },
      ],
      zh: [
        { title: "$2.00 / $12.00", desc: "中档输入与输出的百万 token 列表价。" },
        { title: "$0.20 缓存输入", desc: "缓存命中输入为未命中价的十分之一。" },
        { title: "2026 年 7 月降价 20%", desc: "Terra 于 2026 年 7 月 30 日降价 20%，性价比进一步提升。" },
      ],
    },
    bestForTitle: { en: "Best for", zh: "适合场景" },
    bestFor: {
      en: "Typical agent loops and production coding where you want more reliability headroom than budget models, but output-heavy work makes Sol's flagship price hard to justify.",
      zh: "典型 agent 循环和生产级编程，需要比廉价模型更强的可靠性余量，而输出密集的工作又让 Sol 的旗舰价格难以接受。",
    },
    pricingNoteTitle: { en: "Billing notes", zh: "计费说明" },
    pricingNote: {
      en: "Published API pricing as of August 2026, standard tier, USD per million tokens. Qualifies for OpenAI's 50% Batch API discount on offline workloads.",
      zh: "2026 年 8 月发布的标准档 API 价格，USD/百万 token。适用 OpenAI 离线负载的 50% Batch API 折扣。",
    },
    vsTitle: { en: "Terra vs the competition", zh: "Terra 与竞品对比" },
    vs: {
      en: "Against Claude Sonnet 5 ($2/$10) Terra is priced head-to-head with slightly richer output per dollar on agent-heavy mixes; against DeepSeek V4 Pro, Terra's $12.00 output is cheaper than V4 Pro's ¥27.00 peak but V4 Pro wins decisively at off-peak.",
      zh: "对比 Claude Sonnet 5（$2/$10），Terra 在 agent 密集负载下价格旗鼓相当、输出略富余；对比 DeepSeek V4 Pro，Terra 的 $12.00 输出价低于 V4 Pro 高峰 ¥27.00，但 V4 Pro 在闲时极具优势。",
    },
    faq: FAQ.gpt56Terra,
  },
  gpt56Luna: {
    seoTitle: {
      en: "GPT-5.6 Luna API Pricing (2026) — Per Million Tokens",
      zh: "GPT-5.6 Luna API 价格 (2026) — 每百万 Token 单价",
    },
    description: {
      en: "GPT-5.6 Luna API pricing as of 2026: $0.20 input / $1.20 output per million tokens, $0.02 cached input. Cut 80% on July 30 — the ultra-cheap champion.",
      zh: "GPT-5.6 Luna API 价格（2026 最新）：输入 $0.20/百万、输出 $1.20/百万，缓存命中输入 $0.02/百万。7 月 30 日降价 80%——极致性价比冠军。",
    },
    keywords: {
      en: ["GPT-5.6 Luna price", "GPT-5.6 Luna pricing", "GPT-5.6 Luna cost", "cheap GPT model", "GPT-5.6 Luna per million tokens", "OpenAI cheap pricing"],
      zh: ["GPT-5.6 Luna 价格", "GPT-5.6 Luna 定价", "GPT-5.6 Luna 费用", "便宜的 GPT 模型", "GPT-5.6 Luna 每百万 token 价格", "OpenAI 低价定价"],
    },
    heroTitle: { en: "GPT-5.6 Luna API Pricing", zh: "GPT-5.6 Luna API 定价" },
    heroSubtitle: {
      en: "$0.20 input · $1.20 output per 1M tokens — 'good enough' at a fraction of the price.",
      zh: "$0.20 输入 · $1.20 输出/百万 token — 以零头价格达到「够用」。",
    },
    intro: {
      en: "GPT-5.6 Luna charges $0.20 input and $1.20 output per million tokens — one-eleventh of Sol's output price — yet OpenAI's own benchmarks show it nearly matching GPT-5.5's peak performance at less than half the cost, and outperforming Claude Opus 4.8 on coding. The July 30 price cut (80% off) turned it from 'cheap' into 'almost free'.",
      zh: "GPT-5.6 Luna 输入 $0.20、输出 $1.20/百万 token——仅为 Sol 输出价的十一分之一——而 OpenAI 自己的基准显示它以不到一半的成本几乎追平 GPT-5.5 的峰值表现，并在编程上胜过 Claude Opus 4.8。7 月 30 日降价 80%，从「便宜」变成了「近乎免费」。",
    },
    facts: {
      en: [
        { title: "$0.20 / $1.20", desc: "Ultra-cheap input and output per million tokens." },
        { title: "80% price cut", desc: "The July 30, 2026 cut turned Luna into the budget champion." },
        { title: "$0.02 cached input", desc: "Cached input is effectively free at two cents per million tokens." },
      ],
      zh: [
        { title: "$0.20 / $1.20", desc: "百万 token 的超低价输入与输出。" },
        { title: "降价 80%", desc: "2026 年 7 月 30 日的降价让 Luna 成为低价冠军。" },
        { title: "$0.02 缓存输入", desc: "缓存命中输入每百万仅 2 美分，几乎免费。" },
      ],
    },
    bestForTitle: { en: "Best for", zh: "适合场景" },
    bestFor: {
      en: "High-volume traffic with mostly uncached input: default interactive workhorses, bulk summarization, and budget-sensitive startups. Combined with DeepSeek V4 Flash off-peak, it forms the embarrassingly cheap 2026 stack.",
      zh: "以未缓存输入为主的高并发流量：默认交互主力、批量摘要和预算敏感型创业团队。搭配 DeepSeek V4 Flash 闲时价，共同构成「便宜到不好意思」的 2026 组合。",
    },
    pricingNoteTitle: { en: "Billing notes", zh: "计费说明" },
    pricingNote: {
      en: "Published API pricing as of August 2026, standard tier, USD per million tokens. Also qualifies for the 50% Batch API discount — Luna at $0.60 output per million tokens is nearly free for offline jobs.",
      zh: "2026 年 8 月发布的标准档 API 价格，USD/百万 token。同样适用 50% Batch 折扣——Luna 离线任务输出仅 $0.60/百万，近乎免费。",
    },
    vsTitle: { en: "Luna vs the competition", zh: "Luna 与竞品对比" },
    vs: {
      en: "Luna's $1.20 output undercuts DeepSeek V4 Flash's ¥9.00 peak ($1.30), but loses to V4 Flash's ¥4.50 off-peak ($0.65). The winner depends on your schedule — Luna assumes mostly uncached input, Flash assumes cache hits and off-peak scheduling.",
      zh: "Luna 的 $1.20 输出价低于 DeepSeek V4 Flash 高峰 ¥9.00（约 $1.30），但高于 V4 Flash 闲时 ¥4.50（约 $0.65）。胜负取决于你的调度——Luna 假设多为未缓存输入，Flash 假设缓存命中与闲时运行。",
    },
    faq: FAQ.gpt56Luna,
  },
  claudeOpus5: {
    seoTitle: {
      en: "Claude Opus 5 API Pricing (2026) — Per Million Tokens",
      zh: "Claude Opus 5 API 价格 (2026) — 每百万 Token 单价",
    },
    description: {
      en: "Claude Opus 5 API pricing as of 2026: $5.00 input / $25.00 output per million tokens, $0.50 cached input, 50% Batch discount. Anthropic's flagship.",
      zh: "Claude Opus 5 API 价格（2026 最新）：输入 $5.00/百万、输出 $25.00/百万，缓存命中输入 $0.50/百万，支持 50% Batch 折扣。Anthropic 旗舰模型。",
    },
    keywords: {
      en: ["Claude Opus 5 price", "Claude Opus 5 pricing", "Claude Opus 5 cost", "Claude Opus 5 per million tokens", "Anthropic pricing"],
      zh: ["Claude Opus 5 价格", "Claude Opus 5 定价", "Claude Opus 5 费用", "Claude Opus 5 每百万 token 价格", "Anthropic 定价"],
    },
    heroTitle: { en: "Claude Opus 5 API Pricing", zh: "Claude Opus 5 API 定价" },
    heroSubtitle: {
      en: "$5.00 input · $25.00 output per 1M tokens — Anthropic's flagship for the hardest requests.",
      zh: "$5.00 输入 · $25.00 输出/百万 token — Anthropic 旗舰，面向最难请求。",
    },
    intro: {
      en: "Claude Opus 5 is Anthropic's flagship: $5.00 input and $25.00 output per million tokens, with cached input at $0.50. It's the top-tier choice for the hard 10% of requests where mid-tier or budget models fall short — the other 90% of traffic is usually better served by Sonnet 5 or Haiku 4.5.",
      zh: "Claude Opus 5 是 Anthropic 的旗舰：输入 $5.00、输出 $25.00/百万 token，缓存命中输入 $0.50。它是中档或廉价模型无法胜任的「最难 10% 请求」的顶级选择——其余 90% 的流量通常更适合 Sonnet 5 或 Haiku 4.5。",
    },
    facts: {
      en: [
        { title: "$5.00 / $25.00", desc: "Flagship list price for input and output per million tokens." },
        { title: "$0.50 cached input", desc: "Cached input at one-tenth of the uncached rate." },
        { title: "50% Batch discount", desc: "Anthropic's Batch API halves the cost of offline workloads." },
      ],
      zh: [
        { title: "$5.00 / $25.00", desc: "旗舰级输入与输出的百万 token 列表价。" },
        { title: "$0.50 缓存输入", desc: "缓存命中输入为未命中价的十分之一。" },
        { title: "50% Batch 折扣", desc: "Anthropic 的 Batch API 让离线负载成本减半。" },
      ],
    },
    bestForTitle: { en: "Best for", zh: "适合场景" },
    bestFor: {
      en: "High-stakes, complex reasoning and generation where output quality is the binding constraint — and where Sonnet 5 or Haiku 4.5 demonstrably doesn't meet the bar.",
      zh: "输出质量是硬约束的高风险复杂推理与生成场景——且 Sonnet 5 或 Haiku 4.5 确实达不到要求。",
    },
    pricingNoteTitle: { en: "Billing notes", zh: "计费说明" },
    pricingNote: {
      en: "Published API pricing as of August 2026, standard tier, USD per million tokens. Anthropic offers a 50% Batch API discount for offline workloads, bringing output to $12.50.",
      zh: "2026 年 8 月发布的标准档 API 价格，USD/百万 token。Anthropic 对离线负载提供 50% 的 Batch API 折扣，输出可降至 $12.50。",
    },
    vsTitle: { en: "Opus 5 vs the competition", zh: "Opus 5 与竞品对比" },
    vs: {
      en: "Against GPT-5.6 Sol ($5/$30), Opus 5 undercuts Sol's output by ~17% ($25 vs $30) at the same input price; against DeepSeek V4 Pro, it loses badly on price — V4 Pro's ¥4.50 off-peak output is a fraction of Opus 5's $25.00.",
      zh: "对比 GPT-5.6 Sol（$5/$30），Opus 5 在相同输入价下输出便宜约 17%（$25 vs $30）；对比 DeepSeek V4 Pro 则价格完败——V4 Pro 闲时输出 ¥4.50 仅是 Opus 5 的 $25.00 的零头。",
    },
    faq: FAQ.claudeOpus5,
  },
  claudeSonnet5: {
    seoTitle: {
      en: "Claude Sonnet 5 API Pricing (2026) — Per Million Tokens",
      zh: "Claude Sonnet 5 API 价格 (2026) — 每百万 Token 单价",
    },
    description: {
      en: "Claude Sonnet 5 API pricing as of 2026: $2.00 input / $10.00 output per million tokens, $0.20 cached input, 50% Batch discount. The mid-tier workhorse.",
      zh: "Claude Sonnet 5 API 价格（2026 最新）：输入 $2.00/百万、输出 $10.00/百万，缓存命中输入 $0.20/百万，支持 50% Batch 折扣。中档主力。",
    },
    keywords: {
      en: ["Claude Sonnet 5 price", "Claude Sonnet 5 pricing", "Claude Sonnet 5 cost", "Claude Sonnet 5 per million tokens", "Anthropic mid-tier pricing"],
      zh: ["Claude Sonnet 5 价格", "Claude Sonnet 5 定价", "Claude Sonnet 5 费用", "Claude Sonnet 5 每百万 token 价格", "Anthropic 中档定价"],
    },
    heroTitle: { en: "Claude Sonnet 5 API Pricing", zh: "Claude Sonnet 5 API 定价" },
    heroSubtitle: {
      en: "$2.00 input · $10.00 output per 1M tokens — the mid-tier workhorse between Haiku 4.5 and Opus 5.",
      zh: "$2.00 输入 · $10.00 输出/百万 token — 介于 Haiku 4.5 与 Opus 5 之间的中档主力。",
    },
    intro: {
      en: "Claude Sonnet 5 is Anthropic's mid-tier workhorse: $2.00 input and $10.00 output per million tokens, with cached input at $0.20. It costs 60% less than Opus 5 on output while covering the majority of production coding and agent workloads.",
      zh: "Claude Sonnet 5 是 Anthropic 的中档主力：输入 $2.00、输出 $10.00/百万 token，缓存命中输入 $0.20。输出价比 Opus 5 便宜 60%，却能覆盖绝大多数生产级编程和 agent 负载。",
    },
    facts: {
      en: [
        { title: "$2.00 / $10.00", desc: "Mid-tier list price for input and output per million tokens." },
        { title: "$0.20 cached input", desc: "Cached input at one-tenth of the uncached rate." },
        { title: "60% cheaper than Opus", desc: "Sonnet 5's output costs 60% less than Opus 5's for the majority of workloads." },
      ],
      zh: [
        { title: "$2.00 / $10.00", desc: "中档输入与输出的百万 token 列表价。" },
        { title: "$0.20 缓存输入", desc: "缓存命中输入为未命中价的十分之一。" },
        { title: "比 Opus 便宜 60%", desc: "对绝大多数负载，Sonnet 5 输出价仅为 Opus 5 的六成。" },
      ],
    },
    bestForTitle: { en: "Best for", zh: "适合场景" },
    bestFor: {
      en: "Production coding and agent loops that need more reasoning headroom than Haiku 4.5 but don't require Opus 5's ceiling — the default mid-tier default.",
      zh: "需要比 Haiku 4.5 更强推理余量、又不需要 Opus 5 天花板的代理循环与生产级编程——中档的默认选择。",
    },
    pricingNoteTitle: { en: "Billing notes", zh: "计费说明" },
    pricingNote: {
      en: "Published API pricing as of August 2026, standard tier, USD per million tokens. Anthropic offers a 50% Batch API discount for offline workloads.",
      zh: "2026 年 8 月发布的标准档 API 价格，USD/百万 token。Anthropic 对离线负载提供 50% 的 Batch API 折扣。",
    },
    vsTitle: { en: "Sonnet 5 vs the competition", zh: "Sonnet 5 与竞品对比" },
    vs: {
      en: "Priced head-to-head with GPT-5.6 Terra ($2/$12), Sonnet 5 is slightly cheaper on output ($10 vs $12). DeepSeek V4 Flash remains far cheaper per token but without Anthropic's long-context product ecosystem.",
      zh: "与 GPT-5.6 Terra（$2/$12）正面竞争，Sonnet 5 输出价略低（$10 vs $12）。DeepSeek V4 Flash 每 token 仍便宜得多，但没有 Anthropic 的长上下文产品生态。",
    },
    faq: FAQ.claudeSonnet5,
  },
  claudeHaiku45: {
    seoTitle: {
      en: "Claude Haiku 4.5 API Pricing (2026) — Per Million Tokens",
      zh: "Claude Haiku 4.5 API 价格 (2026) — 每百万 Token 单价",
    },
    description: {
      en: "Claude Haiku 4.5 API pricing as of 2026: $1.00 input / $5.00 output per million tokens, $0.10 cached input, 50% Batch discount. Anthropic's budget tier.",
      zh: "Claude Haiku 4.5 API 价格（2026 最新）：输入 $1.00/百万、输出 $5.00/百万，缓存命中输入 $0.10/百万，支持 50% Batch 折扣。Anthropic 廉价档。",
    },
    keywords: {
      en: ["Claude Haiku 4.5 price", "Claude Haiku 4.5 pricing", "Claude Haiku 4.5 cost", "Claude Haiku 4.5 per million tokens", "cheap Claude model"],
      zh: ["Claude Haiku 4.5 价格", "Claude Haiku 4.5 定价", "Claude Haiku 4.5 费用", "Claude Haiku 4.5 每百万 token 价格", "便宜的 Claude 模型"],
    },
    heroTitle: { en: "Claude Haiku 4.5 API Pricing", zh: "Claude Haiku 4.5 API 定价" },
    heroSubtitle: {
      en: "$1.00 input · $5.00 output per 1M tokens — Anthropic's budget tier for high-volume, low-latency work.",
      zh: "$1.00 输入 · $5.00 输出/百万 token — Anthropic 面向高并发、低延迟任务的廉价档。",
    },
    intro: {
      en: "Claude Haiku 4.5 is Anthropic's budget tier: $1.00 input and $5.00 output per million tokens, with cached input at $0.10. It's the right call for high-volume, simpler tasks — classification, extraction, summarization, and straightforward tool calls.",
      zh: "Claude Haiku 4.5 是 Anthropic 的廉价档：输入 $1.00、输出 $5.00/百万 token，缓存命中输入 $0.10。它适合高并发、更简单的任务——分类、抽取、摘要和直接的工具调用。",
    },
    facts: {
      en: [
        { title: "$1.00 / $5.00", desc: "Budget-tier list price for input and output per million tokens." },
        { title: "$0.10 cached input", desc: "Cached input at one-tenth of the uncached rate." },
        { title: "Low-latency", desc: "Designed for high-volume, latency-sensitive workloads like classification and extraction." },
      ],
      zh: [
        { title: "$1.00 / $5.00", desc: "廉价档输入与输出的百万 token 列表价。" },
        { title: "$0.10 缓存输入", desc: "缓存命中输入为未命中价的十分之一。" },
        { title: "低延迟", desc: "为分类、抽取等高并发、延迟敏感负载设计。" },
      ],
    },
    bestForTitle: { en: "Best for", zh: "适合场景" },
    bestFor: {
      en: "High-volume classification, extraction, summarization, and straightforward tool calls where the extra reasoning headroom of Sonnet 5 isn't needed.",
      zh: "高并发分类、抽取、摘要和直接的工具调用，这类场景不需要 Sonnet 5 的额外推理余量。",
    },
    pricingNoteTitle: { en: "Billing notes", zh: "计费说明" },
    pricingNote: {
      en: "Published API pricing as of August 2026, standard tier, USD per million tokens. Also qualifies for Anthropic's 50% Batch API discount on offline workloads.",
      zh: "2026 年 8 月发布的标准档 API 价格，USD/百万 token。同样适用 Anthropic 离线负载的 50% Batch API 折扣。",
    },
    vsTitle: { en: "Haiku 4.5 vs the competition", zh: "Haiku 4.5 与竞品对比" },
    vs: {
      en: "At $1.00/$5.00, Haiku 4.5 is more expensive than GPT-5.6 Luna ($0.20/$1.20) and DeepSeek V4 Flash off-peak (¥1.50/¥4.50) — Anthropic's budget tier still carries a premium over the cheapest models on the market.",
      zh: "在 $1.00/$5.00 的价位上，Haiku 4.5 比 GPT-5.6 Luna（$0.20/$1.20）和 DeepSeek V4 Flash 闲时（¥1.50/¥4.50）更贵——Anthropic 的廉价档仍比市场上最便宜的模型贵一截。",
    },
    faq: FAQ.claudeHaiku45,
  },
};

/** 按模型 key 读取双语内容。 */
export function getModelPricingContent(key: ModelKey) {
  return MODEL_PRICING_CONTENT[key];
}
