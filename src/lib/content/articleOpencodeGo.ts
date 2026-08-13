import type { ArticleContent } from "@/lib/content";

export const en: ArticleContent = {
  sections: [
    {
      heading: "Introduction",
      blocks: [
        {
          type: "p",
          content:
            'If you are hunting for the single most cost-effective model for AI coding agents in 2026, look no further than <strong>DeepSeek V4 Flash</strong> — and the best place to get it is <strong>OpenCode Go</strong>. It is the model that quietly became the <strong>most-used coding model on Earth</strong>: on OpenCode Go it holds a <strong>69% token share</strong> and ranked <strong>#01</strong> in the latest week of usage. And here is the kicker: you can run it through OpenCode Go for a flat <strong>$10/month</strong> (first month just <strong>$5</strong>), bundled with about <strong>$60 of usage</strong> every single month.',
        },
        {
          type: "p",
          content:
            "Even better — right now there is a one-way door. DeepSeek's official docs just announced they <em>plan to raise overall API pricing in the near future, with a significant increase expected</em>. A Go subscription locks your cost today, before the hike. Let's do the math.",
        },
      ],
    },
    {
      heading: "Why DeepSeek V4 Flash Became the World's Most-Used Coding Model",
      blocks: [
        {
          type: "p",
          content:
            "The OpenCode Go data page publishes real usage telemetry, and the picture is unambiguous. Over the Jun 19 → Aug 13 window, V4 Flash burned through <strong>155 trillion tokens — up 389%</strong> — from <strong>2.2 million unique users</strong> across <strong>12.2 million completed sessions</strong>. The DeepSeek family alone accounts for <strong>66.3% of all token share</strong> on the platform.",
        },
        {
          type: "ul",
          items: [
            "<strong>Reasoning score: 100/100</strong> (normalized) — it reasons like a flagship model.",
            "<strong>1M-token context window</strong> with <strong>384K max output</strong> and an optional thinking mode.",
            "<strong>96% cache-hit rate</strong> in real usage — most input tokens are billed at near-zero cost.",
            "<strong>$0.12 average cost per session</strong> in observed Go usage.",
          ],
        },
      ],
    },
    {
      heading: "The Prices, Side by Side",
      blocks: [
        {
          type: "p",
          content: "Official per-1M-token rates (DeepSeek API docs + OpenCode Go), August 2026:",
        },
        {
          type: "compare_note",
          content:
            "Sources: DeepSeek API Docs — Models & Pricing (Aug 2026), OpenCode Go pricing table (Aug 12, 2026), OpenCode data comparisons. Prices per 1M tokens.",
        },
      ],
    },
    {
      heading: "The Math: Why a $10 Subscription Beats Pay-As-You-Go",
      blocks: [
        {
          type: "p",
          content:
            "Here is the trick that makes OpenCode Go so compelling. A typical agent request on V4 Flash is about <strong>790 input + 68,000 cached + 280 output tokens</strong>. At official rates that works out to roughly <strong>$0.0004 per request</strong> — so an entire month of serious agentic work stays well under budget.",
        },
        {
          type: "p",
          content:
            "Pay-as-you-go on the raw DeepSeek API means your traffic costs whatever you burn. With OpenCode Go you pay a <strong>flat $10/month</strong> and get <strong>$60 of V4 Flash usage included</strong> — a <strong>6× multiplier</strong> on your money. In request terms, that is around <strong>31,650 requests per 5-hour window, 79,050 per week, and 158,150 per month</strong>.",
        },
        {
          type: "p",
          content:
            "And because real-world cache-hit rates on Go sit at <strong>96%</strong>, the effective cost is even lower than the sticker price suggests — most of your input rides the <code>$0.0028 / 1M</code> cached lane.",
        },
      ],
    },
    {
      heading: "Flash or Pro? The Agent Workflow Rule of Thumb",
      blocks: [
        {
          type: "p",
          content:
            "V4 Flash and V4 Pro are siblings with the same 1M context, but very different economics. Flash is <strong>~3× cheaper</strong> on both input and output ($0.14 vs $0.435, $0.28 vs $0.87), and it scores <strong>82/100 on cost-efficiency</strong> versus the Pro's <strong>40/100</strong>. Pro's edge is raw coding ability (87 vs 74).",
        },
        {
          type: "p",
          content:
            "On OpenCode Go the split is even clearer: Flash gets <strong>$60/month</strong> of included usage, while Pro only gets <strong>$15</strong>. Our rule of thumb: <strong>default every agent loop to Flash</strong> — file edits, test runs, refactors, docs — and escalate to Pro only for the hardest reasoning problems where you genuinely need the extra capability.",
        },
      ],
    },
    {
      heading: "DeepSeek Just Announced a Price Hike — Subscribe Before It Lands",
      blocks: [
        {
          type: "p",
          content:
            "Straight from DeepSeek's official pricing page: <em>'We plan to raise the overall pricing for DeepSeek API services in the near future, with a significant increase expected.'</em> For pay-as-you-go users, that means your unit costs are about to jump.",
        },
        {
          type: "p",
          content:
            "A Go subscription is a hedge against exactly this. You are not buying tokens at a floating rate — you are buying a <strong>fixed monthly allotment</strong>. Whatever DeepSeek prices go to, your $10/month buys the same $60 of V4 Flash usage until limits change. If you have been meaning to standardize your tooling on Flash, the window is now.",
        },
        {
          type: "p",
          content:
            "Privacy is solid too: DeepSeek on Go runs under a <strong>zero-data-retention (ZDR) agreement</strong> — prompts are not used for training and retention is 0 days (currently renewed through Aug 31, 2026).",
        },
      ],
    },
    {
      heading: "How to Start Using DeepSeek V4 Flash via OpenCode Go",
      blocks: [
        {
          type: "p",
          content:
            "OpenCode Go works like any other model provider inside OpenCode — no lock-in, and you can keep using other providers alongside it.",
        },
        {
          type: "ol",
          items: [
            'Sign in at <a href="https://opencode.ai/go?ref=NS60V8HH6Q">opencode.ai/go</a> and subscribe — <strong>$5 for the first month</strong>, then $10/month. (One member per workspace.)',
            "Copy your API key from the Go console.",
            "In the OpenCode TUI, run <code>/connect</code>, choose <strong>OpenCode Go</strong>, and paste your key.",
            "Run <code>/models</code> and select <code>opencode-go/deepseek-v4-flash</code> — or configure it in your <code>opencode.json</code>.",
          ],
        },
        {
          type: "p",
          content:
            'Track your current usage anytime in the Go console at opencode.ai/auth. Need to see your DeepSeek spend across your whole estate? Our free <a href="/">DeepSeek usage dashboard</a> turns billing CSVs into per-day, per-model, per-key breakdowns — 100% in your browser.',
        },
      ],
    },
    {
      heading: "The Bottom Line",
      blocks: [
        {
          type: "p",
          content:
            "<strong>The cheapest frontier reasoning model in the world is DeepSeek V4 Flash — and OpenCode Go packages it as the best-value deal in AI coding right now:</strong> a $10/month flat fee for ~$60 of monthly usage, a 96% cache-hit rate that keeps real costs microscopic, and a subscription that shields you from the announced DeepSeek price hike.",
        },
        {
          type: "p",
          content:
            'Whether you are a solo dev burning tokens on agent loops or a team standardizing on one model, this is the highest-value setup we have seen in 2026. <a href="https://opencode.ai/go?ref=NS60V8HH6Q">Grab the $5 first month →</a>',
        },
      ],
    },
  ],
  pricingTable: {
    headers: ["Model", "Input / 1M", "Output / 1M", "Cache Hit / 1M"],
    rows: [
      { model: "DeepSeek V4 Flash", modelColor: "var(--positive)", input: "$0.14", inputColor: "var(--positive)", output: "$0.28", outputColor: "var(--positive)", cacheHit: "$0.0028", cacheHitColor: "var(--positive)", notes: "Cheapest frontier reasoning" },
      { model: "DeepSeek V4 Pro", input: "$0.435", output: "$0.87", cacheHit: "$0.003625", notes: "~3× Flash" },
      { model: "GPT-5.6 Luna", input: "$0.20", output: "$1.20", outputColor: "var(--danger)", cacheHit: "$0.02", notes: "4.3× Flash output" },
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
            "如果你在寻找 2026 年对 AI 编程 Agent 来说性价比最高的模型，答案非 <strong>DeepSeek V4 Flash</strong> 莫属——而获取它的最佳入口是 <strong>OpenCode Go</strong>。这款模型已经悄然成为<strong>全球使用量最大的编程模型</strong>：在 OpenCode Go 上，它占据 <strong>69% 的 Token 份额</strong>，在最近一周的用量榜上位列 <strong>第 01 名</strong>。更妙的是，通过 OpenCode Go 使用它只需 <strong>每月 $10</strong>（首月仅 <strong>$5</strong>），每月还附带约 <strong>$60 的用量额度</strong>。",
        },
        {
          type: "p",
          content:
            "而且，现在还有一扇单向门：DeepSeek 官方文档刚刚宣布，<em>计划在不久的将来整体上调 API 定价，且涨幅预计相当显著</em>。Go 订阅可以把今天的成本锁定下来，赶在涨价之前。我们一起来算这笔账。",
        },
      ],
    },
    {
      heading: "为什么 DeepSeek V4 Flash 成了全球使用量最大的编程模型",
      blocks: [
        {
          type: "p",
          content:
            "OpenCode Go 的数据页公开了真实的用量遥测，图景一目了然。在 6 月 19 日 → 8 月 13 日的时间窗内，V4 Flash 消耗了 <strong>155 万亿 Token，增长 389%</strong>，来自 <strong>220 万独立用户</strong>的 <strong>1224 万次会话</strong>。仅 DeepSeek 一家就占了平台全部 Token 份额的 <strong>66.3%</strong>。",
        },
        {
          type: "ul",
          items: [
            "<strong>推理得分 100/100</strong>（归一化）——推理能力与旗舰模型相当。",
            "<strong>1M Token 上下文窗口</strong>、<strong>384K 最大输出</strong>，支持思考模式。",
            "真实使用中 <strong>缓存命中率 96%</strong>——大部分输入 Token 按近乎为零的成本计费。",
            "Go 上的平均单次会话成本仅 <strong>$0.12</strong>。",
          ],
        },
      ],
    },
    {
      heading: "价格横评",
      blocks: [
        {
          type: "p",
          content: "以下为每百万 Token 的官方定价（DeepSeek API 文档 + OpenCode Go），数据截至 2026 年 8 月：",
        },
        {
          type: "compare_note",
          content:
            "数据来源：DeepSeek API 文档 Models & Pricing（2026 年 8 月）、OpenCode Go 定价表（2026 年 8 月 12 日）、OpenCode 数据对比页。均为每百万 Token 价格。",
        },
      ],
    },
    {
      heading: "算一笔账：为什么 $10 订阅优于按量付费",
      blocks: [
        {
          type: "p",
          content:
            "这正是 OpenCode Go 最有吸引力的地方。V4 Flash 上的一次典型 Agent 请求大约是 <strong>790 输入 + 68,000 缓存 + 280 输出 Token</strong>。按官方定价折算，单次请求成本约 <strong>$0.0004</strong>——即使整月高强度跑 Agent 工作流，也远在预算之内。",
        },
        {
          type: "p",
          content:
            "在 DeepSeek 官方 API 上按量付费，同样的流量烧多少钱就是多少钱。而 OpenCode Go 只需 <strong>固定每月 $10</strong>，就包含 <strong>$60 的 V4 Flash 用量</strong>——<strong>6 倍杠杆</strong>。换算成请求数大约是：<strong>每 5 小时 31,650 次、每周 79,050 次、每月 158,150 次</strong>。",
        },
        {
          type: "p",
          content:
            "再叠加 Go 上真实 <strong>96% 的缓存命中率</strong>，实际单次成本比标价还要低——绝大多数输入走的是 <code>$0.0028 / 1M</code> 的缓存通道。",
        },
      ],
    },
    {
      heading: "Flash 还是 Pro？Agent 工作流的黄金法则",
      blocks: [
        {
          type: "p",
          content:
            "V4 Flash 和 V4 Pro 同出一门，都有 1M 上下文，但经济性天差地别。Flash 在输入和输出上都要便宜 <strong>约 3 倍</strong>（$0.14 vs $0.435，$0.28 vs $0.87），成本效率得分 <strong>82/100</strong>，而 Pro 只有 <strong>40/100</strong>。Pro 的优势在于纯粹的编码能力（87 vs 74）。",
        },
        {
          type: "p",
          content:
            "在 OpenCode Go 上，这个分野更加明显：Flash 每月有 <strong>$60</strong> 的包含用量，而 Pro 只有 <strong>$15</strong>。我们的经验法则：<strong>所有 Agent 循环默认用 Flash</strong>——改文件、跑测试、重构、写文档——只有遇到真正需要极限能力的硬核推理问题时，才升级到 Pro。",
        },
      ],
    },
    {
      heading: "DeepSeek 已官宣涨价——趁涨之前订阅",
      blocks: [
        {
          type: "p",
          content:
            "DeepSeek 官方定价页原话：<em>「我们计划在不久的将来整体上调 DeepSeek API 服务的定价，且涨幅预计显著。」</em>对按量付费用户来说，单位成本即将跳涨。",
        },
        {
          type: "p",
          content:
            "Go 订阅正是对冲这件事的保险。你不是在按浮动价格买 Token，而是在买一个<strong>固定的月度额度</strong>。无论 DeepSeek 涨到多少，你的 $10 都能买到同样的 $60 V4 Flash 用量。如果你一直在考虑把工具链统一到 Flash 上，现在就是窗口期。",
        },
        {
          type: "p",
          content:
            "隐私也有保障：Go 上的 DeepSeek 采用<strong>零数据留存（ZDR）协议</strong>——Prompt 不用于训练，留存 0 天（当前续签至 2026 年 8 月 31 日）。",
        },
      ],
    },
    {
      heading: "如何通过 OpenCode Go 用上 DeepSeek V4 Flash",
      blocks: [
        {
          type: "p",
          content:
            "OpenCode Go 在 OpenCode 里和任何其他模型供应商一样工作——没有锁定，也可以和其他供应商并行使用。",
        },
        {
          type: "ol",
          items: [
            "在 <a href=\"https://opencode.ai/go?ref=NS60V8HH6Q\">opencode.ai/go</a> 注册订阅——<strong>首月 $5</strong>，之后每月 $10。（每个工作区限一位成员订阅。）",
            "从 Go 控制台复制你的 API Key。",
            "在 OpenCode 终端里运行 <code>/connect</code>，选择 <strong>OpenCode Go</strong>，粘贴 Key。",
            "运行 <code>/models</code> 选择 <code>opencode-go/deepseek-v4-flash</code>，或在 <code>opencode.json</code> 中配置。",
          ],
        },
        {
          type: "p",
          content:
            "随时可以在 opencode.ai/auth 的 Go 控制台查看当前用量。想掌握整套 DeepSeek 花销？用我们免费的<a href=\"/\">DeepSeek 用量分析仪表盘</a>，把账单 CSV 拖进浏览器，即可按日、按模型、按 Key 查看明细——100% 本地处理。",
        },
      ],
    },
    {
      heading: "总结",
      blocks: [
        {
          type: "p",
          content:
            "<strong>全球最便宜的前沿推理模型就是 DeepSeek V4 Flash——而 OpenCode Go 把它打包成了当下 AI 编程领域最具价值的交易：</strong>每月 $10 固定费用换取约 $60 的月度用量、96% 的缓存命中率让真实成本趋近于零，订阅制还能让你免受已官宣的 DeepSeek 涨价影响。",
        },
        {
          type: "p",
          content:
            "无论你是在 Agent 循环里狂烧 Token 的独立开发者，还是想统一模型选型的团队，这都是我们见过 2026 年性价比最高的方案。<a href=\"https://opencode.ai/go?ref=NS60V8HH6Q\">立即抢 $5 首月 →</a>",
        },
      ],
    },
  ],
  pricingTable: {
    headers: ["模型", "输入 / 1M", "输出 / 1M", "缓存命中 / 1M"],
    rows: [
      { model: "DeepSeek V4 Flash", modelColor: "var(--positive)", input: "$0.14", inputColor: "var(--positive)", output: "$0.28", outputColor: "var(--positive)", cacheHit: "$0.0028", cacheHitColor: "var(--positive)", notes: "最便宜的前沿推理模型" },
      { model: "DeepSeek V4 Pro", input: "$0.435", output: "$0.87", cacheHit: "$0.003625", notes: "约为 Flash 的 3 倍" },
      { model: "GPT-5.6 Luna", input: "$0.20", output: "$1.20", outputColor: "var(--danger)", cacheHit: "$0.02", notes: "输出为 Flash 的 4.3 倍" },
    ],
  },
};
