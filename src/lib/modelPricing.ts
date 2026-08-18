/**
 * 文件说明：模型定价数据统一配置模块。
 *
 * 该模块是全部模型价格的唯一事实来源：
 * - PricingCalculator 落地页
 * - 每个模型的独立定价 SEO 落地页（/deepseek-v4-flash-pricing 等）
 * 共用同一份 PRICING 数据，避免多处维护后发生漂移。
 */

/** 单个计价单元：固定价（竞品）或 高峰/闲时 双价（DeepSeek 新定价） */
export type PriceCell = number | { peak: number; offpeak: number };

/** 单模型的完整计价结构。 */
export type ModelPricing = {
  input: PriceCell;
  output: PriceCell;
  cacheHit: PriceCell;
  /** 价格基准货币：DeepSeek 官方价按 CNY 维护，竞品按 USD 维护 */
  currency: "CNY" | "USD";
};

/** 支持独立定价页的模型 key。 */
export type ModelKey =
  | "v4Flash"
  | "v4Pro"
  | "gpt56Sol"
  | "gpt56Terra"
  | "gpt56Luna"
  | "claudeOpus5"
  | "claudeSonnet5"
  | "claudeHaiku45";

/** 人民币兑美元参考汇率。 */
export const CNY_PER_USD = 6.9;

/** 模型所属厂商与其官方定价页（JSON-LD 归因使用）。 */
export const MODEL_VENDOR: Record<
  ModelKey,
  { name: string; pricingUrl: string }
> = {
  v4Flash: {
    name: "DeepSeek",
    pricingUrl: "https://api-docs.deepseek.com/quick_start/pricing",
  },
  v4Pro: {
    name: "DeepSeek",
    pricingUrl: "https://api-docs.deepseek.com/quick_start/pricing",
  },
  gpt56Sol: { name: "OpenAI", pricingUrl: "https://openai.com/api/pricing/" },
  gpt56Terra: { name: "OpenAI", pricingUrl: "https://openai.com/api/pricing/" },
  gpt56Luna: { name: "OpenAI", pricingUrl: "https://openai.com/api/pricing/" },
  claudeOpus5: {
    name: "Anthropic",
    pricingUrl: "https://www.anthropic.com/pricing",
  },
  claudeSonnet5: {
    name: "Anthropic",
    pricingUrl: "https://www.anthropic.com/pricing",
  },
  claudeHaiku45: {
    name: "Anthropic",
    pricingUrl: "https://www.anthropic.com/pricing",
  },
};

/**
 * DeepSeek 定价 (CNY/百万 tokens，按高峰/闲时) + 竞品定价 (USD/百万 tokens)
 *
 * 高峰时段：北京时间 9:00–12:00、14:00–18:00；其余为闲时，价格减半。
 */
export const MODEL_PRICING: Record<ModelKey, ModelPricing> = {
  v4Flash: {
    input: { peak: 3.0, offpeak: 1.5 },
    output: { peak: 9.0, offpeak: 4.5 },
    cacheHit: { peak: 0.1, offpeak: 0.05 },
    currency: "CNY",
  },
  v4Pro: {
    input: { peak: 9.0, offpeak: 4.5 },
    output: { peak: 27.0, offpeak: 13.5 },
    cacheHit: { peak: 0.3, offpeak: 0.15 },
    currency: "CNY",
  },
  gpt56Sol: { input: 5.0, output: 30.0, cacheHit: 0.5, currency: "USD" },
  gpt56Terra: { input: 2.0, output: 12.0, cacheHit: 0.2, currency: "USD" },
  gpt56Luna: { input: 0.2, output: 1.2, cacheHit: 0.02, currency: "USD" },
  claudeOpus5: { input: 5.0, output: 25.0, cacheHit: 0.5, currency: "USD" },
  claudeSonnet5: { input: 2.0, output: 10.0, cacheHit: 0.2, currency: "USD" },
  claudeHaiku45: { input: 1.0, output: 5.0, cacheHit: 0.1, currency: "USD" },
};

/** 是否 DeepSeek 自有模型（使用高峰/闲时双价）。 */
export function isDeepSeekModel(key: ModelKey): boolean {
  return key === "v4Flash" || key === "v4Pro";
}

/** 模型在 EN/ZH 下的显示名称。 */
export const MODEL_NAMES: Record<ModelKey, { en: string; zh: string }> = {
  v4Flash: { en: "DeepSeek V4 Flash", zh: "DeepSeek V4 Flash" },
  v4Pro: { en: "DeepSeek V4 Pro", zh: "DeepSeek V4 Pro" },
  gpt56Sol: { en: "GPT-5.6 Sol", zh: "GPT-5.6 Sol" },
  gpt56Terra: { en: "GPT-5.6 Terra", zh: "GPT-5.6 Terra" },
  gpt56Luna: { en: "GPT-5.6 Luna", zh: "GPT-5.6 Luna" },
  claudeOpus5: { en: "Claude Opus 5", zh: "Claude Opus 5" },
  claudeSonnet5: { en: "Claude Sonnet 5", zh: "Claude Sonnet 5" },
  claudeHaiku45: { en: "Claude Haiku 4.5", zh: "Claude Haiku 4.5" },
};

/** 模型独立定价落地页路径。 */
export const MODEL_PRICING_PATHS: Record<ModelKey, string> = {
  v4Flash: "/deepseek-v4-flash-pricing",
  v4Pro: "/deepseek-v4-pro-pricing",
  gpt56Sol: "/gpt-5.6-sol-pricing",
  gpt56Terra: "/gpt-5.6-terra-pricing",
  gpt56Luna: "/gpt-5.6-luna-pricing",
  claudeOpus5: "/claude-opus-5-pricing",
  claudeSonnet5: "/claude-sonnet-5-pricing",
  claudeHaiku45: "/claude-haiku-4.5-pricing",
};

/** 全部模型 key 的有序列表（用于循环生成）。 */
export const MODEL_KEYS: ModelKey[] = [
  "v4Flash",
  "v4Pro",
  "gpt56Sol",
  "gpt56Terra",
  "gpt56Luna",
  "claudeOpus5",
  "claudeSonnet5",
  "claudeHaiku45",
];

/**
 * 高峰/闲时混合后的有效单价 (忙时占比为 0–1)
 */
export function effectivePrice(cell: PriceCell, share: number): number {
  return typeof cell === "number" ? cell : cell.offpeak + (cell.peak - cell.offpeak) * share;
}
