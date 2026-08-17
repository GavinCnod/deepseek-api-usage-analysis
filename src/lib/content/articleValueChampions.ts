import type { ArticleContent } from "@/lib/content";

export const en: ArticleContent = {
  sections: [
    {
      heading: "The Cost Curve Just Bent",
      blocks: [
        {
          type: "p",
          content:
            "For years, the mental model was simple: <strong>cheap models were a compromise</strong> — fine for throwaway tasks, never for real work. In 2026 that rule is dead. The budget tier stopped being a downgrade and became the sensible default, and two models sit at the center of the shift: <strong>GPT-5.6 Luna</strong> and <strong>DeepSeek V4 Flash</strong>. Together they define what 'good enough, at a fraction of the price' actually means — and they are changing how teams budget for AI.",
        },
        {
          type: "p",
          content:
            "This is not a ranking post. It is a buying framework: <strong>why price stopped being a proxy for quality</strong>, <strong>how to use time-of-day pricing as a cost lever</strong>, and <strong>which model is the best value in every price band</strong>.",
        },
      ],
    },
    {
      heading: "The Numbers",
      blocks: [
        {
          type: "p",
          content:
            "Standard API rates, per 1 million tokens, as of August 2026. DeepSeek prices are listed in CNY and USD (≈ 6.9); the two lines per cell are peak and off-peak:",
        },
        {
          type: "compare_note",
          content:
            "Based on published API pricing as of August 2026. DeepSeek peak hours are Beijing time 09:00–12:00 and 14:00–18:00; off-peak is 50% off. GPT-5.6 Luna was cut 80% and Terra 20% on July 30, 2026. OpenAI and Anthropic both offer a 50% Batch API discount for offline workloads. Actual costs depend on cache hit rate and input/output mix.",
        },
      ],
    },
    {
      heading: "Pillar 1: Price Is No Longer a Proxy for Quality",
      blocks: [
        {
          type: "p",
          content:
            "Here is the uncomfortable fact that most budgets are still priced around: <strong>Luna charges $0.20 input / $1.20 output</strong> — one-eleventh of Sol's output price — yet OpenAI's own benchmarks show Luna nearly matching GPT-5.5's peak performance at less than half the cost, and outperforming Claude Opus 4.8 on coding. The July 30 price cut (80% off) turned it from 'cheap' into 'almost free'.",
        },
        {
          type: "p",
          content:
            "DeepSeek V4 Flash makes the same argument from the other side of the price curve. It carries a <strong>1M-token context window, a 96% real-world cache-hit rate, and a reasoning score that rivals flagship models</strong> — and it has become the most-used coding model on Earth (69% of OpenCode Go's token share). At off-peak rates, output costs <strong>¥4.50 / $0.65 per million tokens</strong>: lower than Luna's $1.20.",
        },
        {
          type: "p",
          content:
            "The takeaway is a mindset shift: <strong>cheap no longer means limited</strong>. It means 'good enough for the 90% of requests where the flagship's extra reasoning simply does not change the answer.'",
        },
      ],
    },
    {
      heading: "Pillar 2: Off-Peak Arbitrage — Scheduling Is a Cost Lever",
      blocks: [
        {
          type: "p",
          content:
            "DeepSeek's new pricing splits the day in half: peak hours (Beijing 09:00–12:00 and 14:00–18:00) bill at full price; <strong>everything else is 50% off</strong>. That is not a footnote — it is the single biggest price difference in the industry right now, and it is free money for anyone with a cron job.",
        },
        {
          type: "p",
          content:
            "OpenAI and Anthropic offer the same discount in a different dimension: their <strong>Batch API bills 50% off both input and output</strong> for workloads that tolerate a delay. The playbook: <strong>schedule DeepSeek jobs to off-peak hours, and route OpenAI/Claude bulk work through Batch</strong>. Either way you cut the line item in half without touching a single prompt.",
        },
        {
          type: "p",
          content:
            "Concrete example: a nightly summarization pipeline generating 100M output tokens on V4 Flash costs <strong>¥900 at peak — or ¥450 after 8 PM</strong>. Same tokens, same model, zero code changes, one cron tweak. Run the same volume on GPT-5.6 Sol via Batch and $3,000 becomes $1,500. Cost optimization in 2026 is partly a <em>scheduling</em> discipline.",
        },
      ],
    },
    {
      heading: "Pillar 3: The Best Value in Every Price Band",
      blocks: [
        {
          type: "p",
          content:
            "A tier-by-tier map for where your money is actually best spent, assuming you need to optimize cost-per-useful-token rather than maximum intelligence:",
        },
        {
          type: "ul",
          items: [
            "<strong>Ultra-cheap bulk / extraction / classification</strong> → <strong>GPT-5.6 Luna</strong> ($0.20 / $1.20) for flat, predictable volume — or <strong>DeepSeek V4 Flash off-peak</strong> if you already cache heavily and can batch.",
            "<strong>Default interactive workhorse</strong> → <strong>DeepSeek V4 Flash</strong>. Still ~3× cheaper than V4 Pro at every hour, 1M context, near-free cached input — the best everyday agent model on the market.",
            "<strong>Mid-tier reasoning / complex agents</strong> → <strong>GPT-5.6 Terra</strong> ($2 / $12) or <strong>Claude Sonnet 5</strong> ($2 / $10), with <strong>DeepSeek V4 Pro off-peak</strong> as the budget alternative when you can defer.",
            "<strong>Flagship, quality-first</strong> → <strong>GPT-5.6 Sol</strong> ($5 / $30) or <strong>Claude Opus 5</strong> ($5 / $25). Use them like an emergency tool, not a default.",
          ],
        },
        {
          type: "p",
          content:
            "Notice the shape of the list: <strong>the value winner in every band except the very top is a mid-tier or budget model</strong>. The flagship tier exists for the hard 10% of requests; the other 90% should never pay for it.",
        },
      ],
    },
    {
      heading: "Stability, and the Fine Print",
      blocks: [
        {
          type: "p",
          content:
            "The 'cheapest' label is a snapshot, and snapshots move. Three things to budget around:",
        },
        {
          type: "ol",
          items: [
            "<strong>Price volatility is now a feature of the market.</strong> OpenAI cut Luna 80% and Terra 20% in one day; DeepSeek raised peak rates 4.5× while keeping off-peak at half. A subscription or a fixed allotment can hedge the spikes; a pure pay-as-you-go dependency cannot.",
            "<strong>'Cheapest' is a workload property, not a model property.</strong> Luna's edge assumes mostly uncached input; Flash's edge assumes cache hits and off-peak scheduling; output-heavy agent loops flip the ranking. Measure your real mix before locking anything in.",
            "<strong>Operational stability differs by vendor.</strong> Managed APIs (OpenAI/Anthropic) offer regional data residency and enterprise SLAs; DeepSeek's economics come with China-hosted infrastructure and different rate-limit and support profiles. Match the vendor to the compliance and latency budget of the workload.",
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
            "For most teams, the optimal 2026 stack is embarrassingly cheap: <strong>DeepSeek V4 Flash (off-peak) or GPT-5.6 Luna for the bulk of traffic, one mid-tier model for the hard stuff, and a flagship on tap for the rare request that justifies it.</strong> The models that used to feel like compromises are now the ones paying your infrastructure bills.",
        },
        {
          type: "p",
          content:
            'Want to see the math against your own usage? Drag your DeepSeek billing CSVs into our free <a href="/">usage analytics dashboard</a> (100% in your browser), or run your mix through the <a href="/deepseek-api-pricing-calculator">pricing calculator</a> with the peak-hour share slider to see exactly what off-peak scheduling saves you.',
        },
      ],
    },
  ],
  pricingTable: {
    headers: ["Model", "Input / 1M (¥ / $)", "Output / 1M (¥ / $)", "Cache Hit / 1M (¥ / $)"],
    rows: [
      {
        model: "DeepSeek V4 Flash", modelColor: "var(--positive)",
        input: ["Peak ¥3.00 / $0.43", "Off-peak ¥1.50 / $0.22"],
        output: ["Peak ¥9.00 / $1.30", "Off-peak ¥4.50 / $0.65"],
        cacheHit: ["Peak ¥0.10 / $0.014", "Off-peak ¥0.05 / $0.007"],
        cacheHitColor: "var(--positive)", notes: "Best everyday value",
      },
      {
        model: "DeepSeek V4 Pro",
        input: ["Peak ¥9.00 / $1.30", "Off-peak ¥4.50 / $0.65"],
        output: ["Peak ¥27.00 / $3.91", "Off-peak ¥13.50 / $1.96"],
        cacheHit: ["Peak ¥0.30 / $0.043", "Off-peak ¥0.15 / $0.022"],
        notes: "~3× Flash at every tier",
      },
      { model: "GPT-5.6 Sol", input: "$5.00", inputColor: "var(--danger)", output: "$30.00", outputColor: "var(--danger)", cacheHit: "$0.50", notes: "Flagship" },
      { model: "GPT-5.6 Terra", input: "$2.00", inputColor: "var(--danger)", output: "$12.00", outputColor: "var(--danger)", cacheHit: "$0.20", notes: "Mid-tier" },
      { model: "GPT-5.6 Luna", input: "$0.20", output: "$1.20", cacheHit: "$0.02", notes: "Ultra-cheap champion" },
      { model: "Claude Opus 5", input: "$5.00", inputColor: "var(--danger)", output: "$25.00", outputColor: "var(--danger)", cacheHit: "$0.50", notes: "Flagship" },
      { model: "Claude Sonnet 5", input: "$2.00", inputColor: "var(--danger)", output: "$10.00", outputColor: "var(--danger)", cacheHit: "$0.20", notes: "Mid-tier" },
      { model: "Claude Haiku 4.5", input: "$1.00", output: "$5.00", cacheHit: "$0.10", notes: "—" },
    ],
  },
};

export const zh: ArticleContent = {
  sections: [
    {
      heading: "成本曲线刚刚弯了",
      blocks: [
        {
          type: "p",
          content:
            "多年来，大家的思维定式很简单：<strong>便宜模型=妥协</strong>——应付杂活可以，正经工作不行。2026 年这条定律失效了。入门档不再意味着降级，反而成了理性的默认选择。而站在这场变化中心的，正是 <strong>GPT-5.6 Luna</strong> 与 <strong>DeepSeek V4 Flash</strong>——它们重新定义了「够用就好、价格却低一大截」，也正在改变团队对 AI 的预算方式。",
        },
        {
          type: "p",
          content:
            "这不是一篇排行榜，而是一套采购框架：<strong>为什么价格不再是质量的代理指标</strong>、<strong>如何把分时段定价变成成本杠杆</strong>，以及<strong>每个价格档位里到底该选谁</strong>。",
        },
      ],
    },
    {
      heading: "数据对比",
      blocks: [
        {
          type: "p",
          content:
            "标准 API 定价，每百万 Token，数据截至 2026 年 8 月。DeepSeek 同时列出人民币与美元（≈ 6.9）；每个单元格两行分别为高峰价与闲时价：",
        },
        {
          type: "compare_note",
          content:
            "基于 2026 年 8 月公开发布的 API 定价。DeepSeek 高峰时段为北京时间 9:00–12:00、14:00–18:00，闲时半价。GPT-5.6 Luna 于 2026 年 7 月 30 日降价 80%、Terra 降价 20%。OpenAI 与 Anthropic 的 Batch API 均为离线任务提供五折优惠。实际费用取决于缓存命中率与输入/输出结构。",
        },
      ],
    },
    {
      heading: "支柱一：价格不再是质量的代理指标",
      blocks: [
        {
          type: "p",
          content:
            "大多数预算还是按旧思维制定的，但一个让人不太舒服的事实摆在眼前：<strong>Luna 输入 $0.20 / 输出 $1.20</strong>——输出价只有 Sol 的十一分之一——然而 OpenAI 自己的基准显示，Luna 以不到一半的成本接近 GPT-5.5 的峰值表现，编码能力甚至超过 Claude Opus 4.8。7 月 30 日的 80% 降价，把它从「便宜」变成了「近乎免费」。",
        },
        {
          type: "p",
          content:
            "DeepSeek V4 Flash 从价格曲线的另一头讲着同一个故事。它有 <strong>1M Token 上下文窗口、96% 的真实缓存命中率、媲美旗舰模型的推理得分</strong>——并且已经成为全球使用量最大的编程模型（占 OpenCode Go 69% 的 Token 份额）。闲时输出价 <strong>¥4.50 / $0.65 每百万 Token</strong>，比 Luna 的 $1.20 还低。",
        },
        {
          type: "p",
          content:
            "真正的转变在于心智：<strong>便宜不再等于受限</strong>。它意味着「对九成请求来说，旗舰模型多出来的推理能力根本改变不了答案」。",
        },
      ],
    },
    {
      heading: "支柱二：闲时套利——调度本身就是成本杠杆",
      blocks: [
        {
          type: "p",
          content:
            "DeepSeek 的新定价把一天劈成两半：高峰时段（北京 9:00–12:00、14:00–18:00）全价计费，<strong>其余时间一律半价</strong>。这可不是脚注——这是当下业内最大的价格差，也是每个有定时任务的人白捡的钱。",
        },
        {
          type: "p",
          content:
            "OpenAI 和 Anthropic 用另一个维度给出同样的折扣：<strong>Batch API 输入输出一律五折</strong>，只要任务能接受延迟。打法很明确：<strong>DeepSeek 任务排到闲时，OpenAI/Claude 的批量任务走 Batch</strong>——两条路都能在不改一行 Prompt 的情况下，把账单砍掉一半。",
        },
        {
          type: "p",
          content:
            "举一个具体例子：每晚跑一次的摘要流水线，V4 Flash 生成 1 亿输出 Token，高峰价 <strong>¥900——晚上 8 点后只要 ¥450</strong>。同样的 Token、同样的模型、零代码改动，只改一条 cron。换成 GPT-5.6 Sol 走 Batch，$3,000 变 $1,500。2026 年的成本优化，有一部分其实是<em>排班纪律</em>。",
        },
      ],
    },
    {
      heading: "支柱三：每个价格档位的最优选择",
      blocks: [
        {
          type: "p",
          content:
            "如果你追求的是每单位有效 Token 的成本最优，而不是无上限的智商，各档位的地图大致如下：",
        },
        {
          type: "ul",
          items: [
            "<strong>极致便宜的批量/抽取/分类</strong> → <strong>GPT-5.6 Luna</strong>（$0.20 / $1.20），适合平稳、可预测的大体量；如果缓存命中率高且能批量，<strong>DeepSeek V4 Flash 闲时</strong>更划算。",
            "<strong>默认的交互工作马</strong> → <strong>DeepSeek V4 Flash</strong>。任何时段都比 V4 Pro 便宜约 3 倍，1M 上下文，缓存输入近乎免费——市面上最好的日常 Agent 模型。",
            "<strong>中档推理 / 复杂 Agent</strong> → <strong>GPT-5.6 Terra</strong>（$2 / $12）或 <strong>Claude Sonnet 5</strong>（$2 / $10）；能接受延时的场景，<strong>DeepSeek V4 Pro 闲时</strong>是最省钱的替代。",
            "<strong>旗舰、质量优先</strong> → <strong>GPT-5.6 Sol</strong>（$5 / $30）或 <strong>Claude Opus 5</strong>（$5 / $25）。当紧急工具用，别当默认选项。",
          ],
        },
        {
          type: "p",
          content:
            "注意这张清单的形状：<strong>除了最高档，每一档的性价比冠军都是中档或入门模型</strong>。旗舰档只服务于那 10% 真正需要它的请求——另外 90% 永远不该为它付费。",
        },
      ],
    },
    {
      heading: "稳定性，以及那些小字条款",
      blocks: [
        {
          type: "p",
          content:
            "「最便宜」是快照，而快照会动。做预算时请留出三个变量：",
        },
        {
          type: "ol",
          items: [
            "<strong>价格波动已经是市场常态。</strong>OpenAI 一天之内给 Luna 砍 80%、Terra 砍 20%；DeepSeek 把高峰价提到旧平价的 4.5 倍，同时把闲时压到一半。订阅或固定额度能对冲尖峰，纯按量付费则完全暴露在波动里。",
            "<strong>「最便宜」是工作负载属性，不是模型属性。</strong>Luna 的优势建立在大量未命中输入上；Flash 的优势依赖缓存命中与闲时调度；输出密集的 Agent 循环会改写排名。先量好你的真实配比，再锁定选型。",
            "<strong>各家运维稳定性不同。</strong>托管 API（OpenAI/Anthropic）提供区域数据驻留与企业级 SLA；DeepSeek 的经济性来自中国本地化基础设施，限流与支持模型也不同。让供应商匹配工作负载的合规与延迟预算。",
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
            "对大多数团队来说，2026 年最优的技术栈出奇地便宜：<strong>大部分流量交给 DeepSeek V4 Flash（闲时）或 GPT-5.6 Luna，硬骨头交给一个中档模型，旗舰模型放在手边备用，只伺候那极少数的请求。</strong>那些曾经让人觉得「将就」的模型，如今正在替你付基础设施账单。",
        },
        {
          type: "p",
          content:
            '想用你自己的数据验证这笔账？把 DeepSeek 账单 CSV 拖进我们的免费<a href="/zh">用量分析仪表盘</a>（100% 本地处理），或到<a href="/zh/deepseek-api-pricing-calculator">定价计算器</a>里用「忙时占比」滑块，看看闲时调度到底能省多少。',
        },
      ],
    },
  ],
  pricingTable: {
    headers: ["模型", "输入 / 1M（¥ / $）", "输出 / 1M（¥ / $）", "缓存命中 / 1M（¥ / $）"],
    rows: [
      {
        model: "DeepSeek V4 Flash", modelColor: "var(--positive)",
        input: ["高峰 ¥3.00 / $0.43", "闲时 ¥1.50 / $0.22"],
        output: ["高峰 ¥9.00 / $1.30", "闲时 ¥4.50 / $0.65"],
        cacheHit: ["高峰 ¥0.10 / $0.014", "闲时 ¥0.05 / $0.007"],
        cacheHitColor: "var(--positive)", notes: "日常性价比之王",
      },
      {
        model: "DeepSeek V4 Pro",
        input: ["高峰 ¥9.00 / $1.30", "闲时 ¥4.50 / $0.65"],
        output: ["高峰 ¥27.00 / $3.91", "闲时 ¥13.50 / $1.96"],
        cacheHit: ["高峰 ¥0.30 / $0.043", "闲时 ¥0.15 / $0.022"],
        notes: "任何时段均为 Flash 的约 3 倍",
      },
      { model: "GPT-5.6 Sol", input: "$5.00", inputColor: "var(--danger)", output: "$30.00", outputColor: "var(--danger)", cacheHit: "$0.50", notes: "旗舰" },
      { model: "GPT-5.6 Terra", input: "$2.00", inputColor: "var(--danger)", output: "$12.00", outputColor: "var(--danger)", cacheHit: "$0.20", notes: "中档" },
      { model: "GPT-5.6 Luna", input: "$0.20", output: "$1.20", cacheHit: "$0.02", notes: "极致便宜冠军" },
      { model: "Claude Opus 5", input: "$5.00", inputColor: "var(--danger)", output: "$25.00", outputColor: "var(--danger)", cacheHit: "$0.50", notes: "旗舰" },
      { model: "Claude Sonnet 5", input: "$2.00", inputColor: "var(--danger)", output: "$10.00", outputColor: "var(--danger)", cacheHit: "$0.20", notes: "中档" },
      { model: "Claude Haiku 4.5", input: "$1.00", output: "$5.00", cacheHit: "$0.10", notes: "—" },
    ],
  },
};