import type { ArticleContent } from "@/lib/content";

export const en: ArticleContent = {
  sections: [
    {
      heading: "Introduction",
      blocks: [
        {
          type: "p",
          content:
            "Choosing an LLM provider in 2026 is as much an economic decision as a technical one. With DeepSeek V4 Pro delivering flagship-level reasoning at a fraction of the cost, and OpenAI GPT and Anthropic Claude pushing the frontier of agentic capabilities, developers face a real trade-off. Here's the data to help you decide.",
        },
      ],
    },
    {
      heading: "The Numbers",
      blocks: [
        {
          type: "p",
          content:
            "Let's start with the raw pricing, as of August 2026 (per 1 million tokens):",
        },
        {
          type: "compare_note",
          content:
            "Based on published API pricing as of August 2026. DeepSeek prices shown in CNY and USD (≈ 6.9 CNY/USD); peak hours are Beijing time 09:00–12:00 and 14:00–18:00, and off-peak is 50% off. GPT-5.6 Luna was cut 80% and Terra 20% on July 30, 2026; OpenAI and Anthropic both offer a 50% Batch API discount for offline workloads. Actual costs vary with usage patterns and caching efficiency.",
        },
      ],
    },
    {
      heading: "What You Get for the Money",
      blocks: [
        {
          type: "p",
          content:
            '<strong>DeepSeek V4 Pro</strong> excels at structured reasoning, code generation, and long-context tasks (1M token context window). Its "Thinking Mode" produces Chain-of-Thought reasoning comparable to o1-level models at a price point that makes it viable for high-volume production workloads. Since DeepSeek bills off-peak hours at half the peak rate, routing batch jobs and cron workloads to Beijing evening/night windows cuts the bill further.',
        },
        {
          type: "p",
          content:
            "<strong>OpenAI GPT</strong> and <strong>Anthropic Claude</strong> push further on agentic tool use, nuanced writing, and complex multi-step reasoning. For applications where correctness and sophisticated language generation are absolutely critical — legal document analysis, medical coding, financial compliance — the premium may be justified. But for the vast majority of developer use cases (code generation, content summarization, data extraction), DeepSeek V4 Pro is more than capable.",
        },
      ],
    },
    {
      heading: "Migration Strategy: How to Switch Without Downtime",
      blocks: [
        {
          type: "p",
          content:
            "If you're considering migrating from OpenAI or Claude to DeepSeek (or running them in parallel), here's a practical approach:",
        },
        {
          type: "ol",
          items: [
            "<strong>Use an AI Gateway.</strong> Portkey and Helicone both support multi-provider routing. Configure them to send a percentage of traffic to DeepSeek while keeping OpenAI or Claude as fallback.",
            "<strong>Start with non-critical workloads.</strong> Migrate internal tools, data extraction pipelines, and summarization tasks first. Keep customer-facing chat on your current provider until you've validated DeepSeek's performance on your specific prompts.",
            'Monitor cache hit rates. DeepSeek\'s cost advantage is amplified by effective caching. Use our <a href="/deepseek-cache-hit-rate-analyzer">cache hit rate analyzer</a> to track hit rates per key and optimize your prompt structure.',
            "<strong>Compare real costs, not list prices.</strong> Your effective cost depends on your cache hit rate, input/output ratio, and thinking token usage. Model your exact workload with our <a href=\"/deepseek-api-pricing-calculator\">pricing calculator</a> — it handles DeepSeek's peak/off-peak and cache pricing alongside OpenAI and Anthropic rates.",
          ],
        },
      ],
    },
    {
      heading: "The Bottom Line",
      blocks: [
        {
          type: "p",
          content:
            "For most developers and teams, the math is clear: DeepSeek V4 Flash and Pro deliver excellent capability at a fraction of the cost. The exceptions are use cases where the highest possible reasoning accuracy justifies a premium — and those use cases are rarer than most teams think.",
        },
        {
          type: "p",
          content:
            "The smartest strategy in 2026 is <strong>provider-agnostic architecture</strong>: use an AI gateway to route requests based on task complexity, cost constraints, and latency requirements. That way, you get the best of both worlds — DeepSeek's economics for the 95% of requests where it excels, and OpenAI or Claude for the 5% where the premium pays off.",
        },
        {
          type: "p",
          content:
            '<strong>Interested in setting up a cost-optimized multi-provider AI architecture?</strong> The MindRose team helps businesses design and implement provider-agnostic LLM systems. <a href="mailto:hello@mindrose.xyz">Get in touch →</a>',
        },
      ],
    },
  ],
  pricingTable: {
    headers: ["Model", "Input / 1M tokens (¥ / $)", "Output / 1M tokens (¥ / $)", "Cache Hit / 1M tokens (¥ / $)"],
    rows: [
      {
        model: "DeepSeek V4 Flash", modelColor: "var(--positive)",
        input: ["Peak ¥3.00 / $0.43", "Off-peak ¥1.50 / $0.22"],
        output: ["Peak ¥9.00 / $1.30", "Off-peak ¥4.50 / $0.65"],
        cacheHit: ["Peak ¥0.10 / $0.014", "Off-peak ¥0.05 / $0.007"],
        cacheHitColor: "var(--positive)", notes: "Off-peak = 50% of peak",
      },
      {
        model: "DeepSeek V4 Pro",
        input: ["Peak ¥9.00 / $1.30", "Off-peak ¥4.50 / $0.65"],
        output: ["Peak ¥27.00 / $3.91", "Off-peak ¥13.50 / $1.96"],
        cacheHit: ["Peak ¥0.30 / $0.043", "Off-peak ¥0.15 / $0.022"],
        notes: "Off-peak = 50% of peak",
      },
      { model: "GPT-5.6 Sol", input: "$5.00", inputColor: "var(--danger)", output: "$30.00", outputColor: "var(--danger)", cacheHit: "$0.50", notes: "—" },
      { model: "GPT-5.6 Terra", input: "$2.00", inputColor: "var(--danger)", output: "$12.00", outputColor: "var(--danger)", cacheHit: "$0.20", notes: "—" },
      { model: "GPT-5.6 Luna", input: "$0.20", output: "$1.20", cacheHit: "$0.02", notes: "—" },
      { model: "Claude Opus 5", input: "$5.00", inputColor: "var(--danger)", output: "$25.00", outputColor: "var(--danger)", cacheHit: "$0.50", notes: "—" },
      { model: "Claude Sonnet 5", input: "$2.00", inputColor: "var(--danger)", output: "$10.00", outputColor: "var(--danger)", cacheHit: "$0.20", notes: "—" },
      { model: "Claude Haiku 4.5", input: "$1.00", output: "$5.00", cacheHit: "$0.10", notes: "—" },
    ],
  },
};

export const zh: ArticleContent = {
  sections: [
    {
      heading: "引言",
      blocks: [
        {
          type: "p",
          content:
            "在 2026 年选择 LLM 供应商，既是技术决策，也是经济决策。DeepSeek V4 Pro 以极低的成本提供媲美旗舰大模型的推理能力，而 OpenAI GPT 和 Anthropic Claude 则在 Agent 能力和复杂文本生成上更进一步——开发者面临真实的取舍。以下是帮助你决策的数据。",
        },
      ],
    },
    {
      heading: "数据对比",
      blocks: [
        {
          type: "p",
          content:
            "先看原始定价，数据截至 2026 年 8 月（每百万 Token）：",
        },
        {
          type: "compare_note",
          content:
            "基于 2026 年 8 月公开发布的 API 定价。DeepSeek 价格同时以人民币与美元（≈ 6.9 CNY/USD）列出；高峰时段为北京时间 9:00–12:00、14:00–18:00，闲时半价。GPT-5.6 Luna 于 2026 年 7 月 30 日降价 80%、Terra 降价 20%；OpenAI 与 Anthropic 的 Batch API 均为离线任务提供五折优惠。实际费用可能因使用模式和缓存效率而有所不同。",
        },
      ],
    },
    {
      heading: "一分钱一分货？",
      blocks: [
        {
          type: "p",
          content:
            "<strong>DeepSeek V4 Pro</strong> 在结构化推理、代码生成和长上下文任务（1M Token 上下文窗口）方面表现优异。其「思考模式」可产生与 o1 级别模型相当的思维链推理，且价格低廉到足以支撑大规模生产工作负载。由于 DeepSeek 对闲时（北京时间晚间至清晨）按半价计费，把批量任务和定时脚本调度到这些时段，还能再砍掉一半成本。",
        },
        {
          type: "p",
          content:
            "<strong>OpenAI GPT</strong> 与 <strong>Anthropic Claude</strong> 在工具使用、细腻的文本生成和复杂多步推理方面更进一步。对于正确性和语言表达至关重要的应用——法律文件分析、医疗编码、金融合规——这种溢价可能是值得的。但对绝大多数开发者场景（代码生成、内容摘要、数据抽取），DeepSeek V4 Pro 已绰绰有余。",
        },
      ],
    },
    {
      heading: "迁移策略：如何无缝切换",
      blocks: [
        {
          type: "p",
          content:
            "如果你正在考虑从 OpenAI 或 Claude 迁移到 DeepSeek（或多模型并行运行），以下是一个实操方案：",
        },
        {
          type: "ol",
          items: [
            "<strong>使用 AI 网关。</strong> Portkey 和 Helicone 都支持多供应商路由。将它们配置为将一部分流量发送到 DeepSeek，同时保留 OpenAI 或 Claude 作为回退方案。",
            "<strong>先从非关键负载开始。</strong>优先迁移内部工具、数据抽取流水线和摘要任务。在验证 DeepSeek 在你具体 Prompt 上的表现之前，保持面向客户的对话在现有供应商上。",
            '<strong>监控缓存命中率。</strong> DeepSeek 的成本优势在有效缓存的加持下更为显著。使用我们的<a href="/deepseek-cache-hit-rate-analyzer">缓存命中率分析器</a>追踪各 Key 的命中率并优化 Prompt 结构。',
            "<strong>对比实际成本而不是标价。</strong>你的实际成本取决于缓存命中率、输入/输出比例和思考 Token 的使用量。用我们的<a href=\"/deepseek-api-pricing-calculator\">定价计算器</a>建模你的真实工作负载——它同时覆盖 DeepSeek 的高峰/闲时、缓存定价以及 OpenAI 和 Anthropic 的费率。",
          ],
        },
      ],
    },
    {
      heading: "总结",
      blocks: [
        {
          type: "p",
          content:
            "对大多数开发者和团队来说，数据很清楚：DeepSeek V4 Flash 和 Pro 以极低的成本提供了卓越的能力。例外情况是那些需要最高推理准确度、且愿意支付溢价的场景——而这些场景比大多数人想象的要少得多。",
        },
        {
          type: "p",
          content:
            "2026 年最聪明的策略是<strong>供应商无关的架构</strong>：使用 AI 网关根据任务复杂度、成本约束和延迟要求来路由请求。这样你就能两全其美——DeepSeek 的经济性覆盖 95% 的请求，而 OpenAI 或 Claude 则服务于那 5% 值得溢价的场景。",
        },
        {
          type: "p",
          content:
            '<strong>有兴趣搭建一套成本优化的多供应商 AI 架构吗？</strong> MindRose 团队帮助各类企业设计和实现供应商无关的 LLM 系统。<a href="mailto:hello@mindrose.xyz">联系我们 →</a>',
        },
      ],
    },
  ],
  pricingTable: {
    headers: ["模型", "输入 / 百万 Token（¥ / $）", "输出 / 百万 Token（¥ / $）", "缓存命中 / 百万 Token（¥ / $）"],
    rows: [
      {
        model: "DeepSeek V4 Flash", modelColor: "var(--positive)",
        input: ["高峰 ¥3.00 / $0.43", "闲时 ¥1.50 / $0.22"],
        output: ["高峰 ¥9.00 / $1.30", "闲时 ¥4.50 / $0.65"],
        cacheHit: ["高峰 ¥0.10 / $0.014", "闲时 ¥0.05 / $0.007"],
        cacheHitColor: "var(--positive)", notes: "闲时 = 高峰价 50%",
      },
      {
        model: "DeepSeek V4 Pro",
        input: ["高峰 ¥9.00 / $1.30", "闲时 ¥4.50 / $0.65"],
        output: ["高峰 ¥27.00 / $3.91", "闲时 ¥13.50 / $1.96"],
        cacheHit: ["高峰 ¥0.30 / $0.043", "闲时 ¥0.15 / $0.022"],
        notes: "闲时 = 高峰价 50%",
      },
      { model: "GPT-5.6 Sol", input: "$5.00", inputColor: "var(--danger)", output: "$30.00", outputColor: "var(--danger)", cacheHit: "$0.50", notes: "—" },
      { model: "GPT-5.6 Terra", input: "$2.00", inputColor: "var(--danger)", output: "$12.00", outputColor: "var(--danger)", cacheHit: "$0.20", notes: "—" },
      { model: "GPT-5.6 Luna", input: "$0.20", output: "$1.20", cacheHit: "$0.02", notes: "—" },
      { model: "Claude Opus 5", input: "$5.00", inputColor: "var(--danger)", output: "$25.00", outputColor: "var(--danger)", cacheHit: "$0.50", notes: "—" },
      { model: "Claude Sonnet 5", input: "$2.00", inputColor: "var(--danger)", output: "$10.00", outputColor: "var(--danger)", cacheHit: "$0.20", notes: "—" },
      { model: "Claude Haiku 4.5", input: "$1.00", output: "$5.00", cacheHit: "$0.10", notes: "—" },
    ],
  },
};
