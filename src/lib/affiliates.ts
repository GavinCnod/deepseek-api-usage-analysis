/**
 * 联盟营销链接统一管理
 *
 * 集中管理所有联盟和推荐计划的链接、佣金信息。
 * 仿照 `sisterProjects.ts` 的集中化配置模式，便于后续添加新联盟计划。
 *
 * 所有出站联盟链接必须添加 rel="sponsored nofollow" 以遵守 Google SEO 指南。
 * 所有赞助内容标注 "Sponsored" 或 "Affiliate link" 透明标识。
 */

export interface AffiliateItem {
  id: string;
  name: string;
  url: string;
  description?: {
    en: string;
    zh: string;
  };
  commission?: {
    en: string;
    zh: string;
  };
  condition?: {
    en: string;
    zh: string;
  };
  category?: string;
  isActive: boolean;
  rel: "sponsored nofollow" | "noopener noreferrer";
  platform?: string;
  notes?: {
    en: string;
    zh: string;
  };
  cookieDays?: number;
}

export const affiliatesRegistry: AffiliateItem[] = [
  {
    id: "opencode-go",
    name: "Opencode Go",
    url: "https://opencode.ai/go?ref=NS60V8HH6Q",
    commission: {
      en: "You will receive $5 when subscribed, which directly offsets the 1st month's Go fee.",
      zh: "订阅时，您可获得 $5，直接抵消首月 go 费用。",
    },
    condition: {
      en: "Could be the cheapest option for calling DeepSeek V4 Flash model in the world.",
      zh: "可能是全球最便宜的 deepseek v4 flash 模型调用。",
    },
    isActive: true,
    rel: "sponsored nofollow",
  },
  {
    id: "aliyun-bailian",
    name: "阿里云百炼",
    url: "https://www.aliyun.com/minisite/goods?userCode=9yd8ilcf",
    commission: {
      en: "We gift you an extra 20% off coupon, exclusive discounts on 120+ cloud products.",
      zh: "赠送您一张额外八折优惠券，120+款云产品专属折扣",
    },
    condition: {
      en: "Recommending large models/Agent products extends attribution period to 365 days; withdrawable after 30 days.",
      zh: "推荐大模型/Agent产品，关联周期延长至 365 天；订单 30 天后可提现。",
    },
    isActive: true,
    rel: "sponsored nofollow",
  },
  {
    id: "tencent-cloud",
    name: "腾讯云 Tencent Cloud",
    url: "https://curl.qcloud.com/mJQjoF6K",
    commission: {
      en: "Cloud servers, cloud databases, COS, CDN, SMS and other cloud products are on special offer now.",
      zh: "云服务器、云数据库、COS、CDN、短信等云产品特惠热卖中",
    },
    condition: {
      en: "AWS high-quality alternative, we use COS as a replacement for S3",
      zh: "AWS的优质替代品，我们应用COS替代S3",
    },
    isActive: true,
    rel: "sponsored nofollow",
  },
  {
    id: "tencent-cloud-global",
    name: "腾讯云国际站 Tencent Cloud Global",
    url: "https://curl.qcloud.com/yWOyshuD",
    commission: {
      en: "Cloud servers, cloud databases, COS, CDN, SMS and other cloud products are on special offer now.",
      zh: "云服务器、云数据库、COS、CDN、短信等云产品特惠热卖中",
    },
    condition: {
      en: "AWS high-quality alternative, we use COS as a replacement for S3",
      zh: "AWS的优质替代品，我们应用COS替代S3",
    },
    isActive: true,
    rel: "sponsored nofollow",
  },
  {
    id: "silicon-flow",
    name: "硅基流动 SiliconFlow",
    url: "https://cloud.siliconflow.cn/i/oEWYkQgZ",
    commission: {
      en: "¥16 universal voucher for all platforms, valid for 180 days from the date of receipt",
      zh: "¥16 元全平台通用代金券，领取之日起 180 天内有效",
    },
    condition: {
      en: "A comprehensive product matrix supporting the full-process implementation of AI applications.",
      zh: "全场景产品矩阵，支撑 AI 应用全流程落地",
    },
    isActive: true,
    rel: "sponsored nofollow",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    url: "https://openrouter.ai/affiliates",
    commission: {
      en: "20% recurring commission",
      zh: "20% 循环佣金",
    },
    notes: {
      en: "Affiliate page may show 404; login to dashboard for link",
      zh: "联盟页面可能显示 404；请登录控制台获取链接",
    },
    isActive: false,
    rel: "sponsored nofollow",
  },
  {
    id: "replicate",
    name: "Replicate",
    url: "https://replicate.com",
    commission: {
      en: "One-time, usage-based referral credits",
      zh: "一次性，基于使用量的推荐积分",
    },
    platform: "Direct",
    condition: {
      en: "60-day cookie; min withdrawal $50; paid monthly",
      zh: "60 天 Cookie；最低提现 $50；月结",
    },
    isActive: false,
    rel: "sponsored nofollow",
  },
  {
    id: "groq",
    name: "Groq",
    url: "https://groq.com/partner-opportunity",
    commission: {
      en: "Undisclosed (Partnership model)",
      zh: "未公开（合作伙伴模式）",
    },
    platform: "Direct",
    condition: {
      en: "Geared towards enterprise partnerships; requires application and review",
      zh: "偏向企业合作，需提交申请后审核",
    },
    isActive: false,
    rel: "sponsored nofollow",
  },
  {
    id: "vultr",
    name: "Vultr",
    url: "https://www.vultr.com/?ref=9911428-9J",
    commission: {
      en: "RReceive $300 to test out VVultr platform",
      zh: "获得 $300 测试 Vultr 云平台",
    },
    condition: {
      en: "Referred user must be active 30+ days and spend $10–$25",
      zh: "被推荐用户需活跃 30 天以上且消费 $10–$25",
    },
    isActive: true,
    rel: "sponsored nofollow",
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    url: "https://www.digitalocean.com/affiliates",
    commission: {
      en: "10% recurring commission for 12 months",
      zh: "10% 循环佣金，持续 12 个月",
    },
    platform: "Awin",
    isActive: false,
    rel: "sponsored nofollow",
  },
  {
    id: "railway",
    name: "Railway",
    url: "https://railway.com?referralCode=4BEzda",
    commission: {
      en: "Deploy anything without the complexity",
      zh: "无需复杂性即可部署任何内容（我们的各种前/后端服务和容器）",
    },
    platform: "Direct",
    condition: {
      en: "Connect your repo, Railway handles the rest. ",
      zh: "连接您的代码仓库，Railway 会处理其余部分",
    },
    isActive: true,
    rel: "sponsored nofollow",
  },
  {
    id: "cloudways",
    name: "Cloudways",
    url: "https://platform.cloudways.com/signup",
    commission: {
      en: "Up to $125 per sale, or lifetime recurring commission",
      zh: "最高 $125/次，或终身循环佣金",
    },
    platform: "Direct",
    condition: {
      en: "Offers Slab/Hybrid/Custom models; 90-day cookie; supports sub-affiliates",
      zh: "提供 Slab/Hybrid/Custom 三种佣金模式；90 天 Cookie；支持二级佣金",
    },
    isActive: false,
    rel: "sponsored nofollow",
  },
  {
    id: "hetzner",
    name: "Hetzner Cloud",
    url: "https://console.hetzner.com/refer",
    commission: {
      en: "Referrer gets €11.90 credit after referred user spends €11.90",
      zh: "被推荐人消费 €11.90 后推荐人获 €11.90 积分",
    },
    platform: "Direct",
    condition: {
      en: "New link generation method required after June 2026",
      zh: "2026 年 6 月后需用新方式获取链接",
    },
    isActive: false,
    rel: "sponsored nofollow",
  },
  {
    id: "akamai",
    name: "Akamai Cloud",
    url: "https://www.akamai.com/cloud/referral-program",
    commission: {
      en: "Referrer gets $25 credit after referred user spends $25 and is active for 90 days",
      zh: "被推荐人消费 $25 且活跃 90 天后，推荐人获 $25 积分",
    },
    platform: "Direct",
    condition: {
      en: "Referred user gets $100 free credit, high conversion rate",
      zh: "被推荐人可获 $100 免费额度，转化率高",
    },
    isActive: false,
    rel: "sponsored nofollow",
  },
  {
    id: "namecheap",
    name: "Namecheap",
    url: "https://www.namecheap.com/affiliates/",
    commission: {
      en: "Domains 20%, Hosting/SSL 35%, VPN up to 100% first purchase",
      zh: "域名 20%，主机/SSL 35%，VPN 首单最高 100%",
    },
    platform: "Impact / Commission Junction",
    cookieDays: 30,
    isActive: false,
    rel: "sponsored nofollow",
  },
  {
    id: "cursor",
    name: "Cursor",
    url: "https://www.cursor.com",
    commission: {
      en: "20% recurring for 12 months",
      zh: "20% 循环，持续 12 个月",
    },
    platform: "Direct",
    condition: {
      en: "Applies to Pro and Business subscriptions; 60-day cookie; min withdrawal $50; paid monthly, supports PayPal",
      zh: "适用于 Pro 和 Business 订阅；Cookie 60 天；最低提现 $50；月结，支持 PayPal",
    },
    isActive: false,
    rel: "sponsored nofollow",
  },
  {
    id: "raycast",
    name: "Raycast",
    url: "https://affiliates.raycast.com/signup",
    commission: {
      en: "30% recurring (no time limit)",
      zh: "30% 循环（无期限限制）",
    },
    platform: "Rewardful",
    condition: {
      en: "Requires a Raycast account; paid via Wise; min withdrawal £50; 30-day pending period",
      zh: "需有 Raycast 账户；通过 Wise 支付；最低提现 £50；30 天待处理期",
    },
    isActive: false,
    rel: "sponsored nofollow",
  },
  {
    id: "windsurf",
    name: "Windsurf / Codeium",
    url: "https://codeium.com/partners",
    commission: {
      en: "Enterprise referral reward (percentage undisclosed)",
      zh: "企业客户引荐奖励（比例未公开）",
    },
    platform: "Direct",
    condition: {
      en: "Manual review takes 1–5 business days; min withdrawal $50",
      zh: "人工审核 1–5 个工作日；最低提现 $50",
    },
    isActive: false,
    rel: "sponsored nofollow",
  },
  {
    id: "vercel-v0",
    name: "Vercel v0",
    url: "https://partners.dub.co/v0",
    commission: {
      en: "$10 per Premium user, $30 per Team user (one-time)",
      zh: "每推荐 Premium 用户 $10，每推荐 Team 用户 $30（一次性）",
    },
    platform: "Dub",
    condition: {
      en: "Requires Vercel account to apply, manual review",
      zh: "只需 Vercel 账号即可申请，人工审核",
    },
    isActive: false,
    rel: "sponsored nofollow",
  },
  {
    id: "netlify",
    name: "Netlify",
    url: "https://dash.partnerstack.com/application?company=netlify&group=ecosystempartners",
    commission: {
      en: "20% recurring",
      zh: "20% 循环",
    },
    platform: "PartnerStack",
    condition: {
      en: "Must provide website URL and audience info when applying",
      zh: "申请时需填写网站 URL 和受众信息",
    },
    isActive: false,
    rel: "sponsored nofollow",
  },
  {
    id: "warp",
    name: "Warp",
    url: "https://app.warp.dev/referral/3RYED4",
    commission: {
      en: "One of the best AI terminal tools in the world",
      zh: "世界上最好用的 AI 终端工具之一",
    },
    platform: "Direct",
    condition: {
      en: "Interestingly, we can directly use various top-tier models in Warp without leaving the terminal.",
      zh: "我们可以直接在 Warp 中使用各种顶级模型，而不离开终端",
    },
    isActive: true,
    rel: "sponsored nofollow",
  },
  {
    id: "portkey",
    name: "Portkey",
    description: {
      en: "AI Gateway & Observability — enterprise-grade guardrails for production LLM deployments.",
      zh: "AI 网关与可观测性平台 — 为生产环境的 LLM 部署提供企业级防护。",
    },
    url: "https://portkey.ai",
    isActive: false,
    rel: "noopener noreferrer",
  },
  {
    id: "helicone",
    name: "Helicone",
    description: {
      en: "LLM Monitoring — fastest real-time observability with one-line integration.",
      zh: "LLM 监控平台 — 极速的实时可观测性工具，单行代码即可集成。",
    },
    url: "https://www.helicone.ai",
    isActive: false,
    rel: "noopener noreferrer",
  },
  {
    id: "langfuse",
    name: "LangFuse",
    description: {
      en: "Open Source LLM Tracing — detailed tracing, cost attribution, and evaluation pipelines.",
      zh: "开源 LLM 追踪工具 — 提供详细的追踪记录、成本归因和评估流水线。",
    },
    url: "https://langfuse.com",
    isActive: false,
    rel: "noopener noreferrer",
  },
];

/**
 * 辅助函数：根据 ID 数组快速筛选活跃的推荐项目
 */
export function getAffiliatesByIds(ids: string[]): AffiliateItem[] {
  return ids
    .map(id => affiliatesRegistry.find(a => a.id === id && a.isActive))
    .filter((a): a is AffiliateItem => a !== undefined);
}

