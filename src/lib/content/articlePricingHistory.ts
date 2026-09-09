import type { ArticleContent } from "@/lib/content";

export const en: ArticleContent = {
  sections: [
    {
      heading: "The September 10 Reprice",
      blocks: [
        {
          type: "p",
          content:
            "On <strong>September 10, 2026 at 12:00 Beijing time</strong>, DeepSeek cut V4 Flash prices again. Off-peak now bills <strong>¥1.00 per million input tokens (cache miss), ¥4.00 per million output tokens, and ¥0.02 per million cached input tokens</strong>; peak is exactly double that (¥2.00 / ¥8.00 / ¥0.04). It is the second pricing change in under a month — and the latest chapter in a pricing story that has swung wildly since DeepSeek first opened its API.",
        },
        {
          type: "p",
          content:
            "That story is worth understanding, because the numbers that are “cheap” today have been cut, raised, and restructured repeatedly — and each change reshapes which model is the value champion. Here is the full arc, from the 2024 V2 era to today's Flash/Pro line.",
        },
      ],
    },
    {
      heading: "The Price History, At a Glance",
      blocks: [
        {
          type: "p",
          content:
            "A condensed timeline of DeepSeek's headline pricing changes. Unless noted, prices are per 1M tokens; DeepSeek's own models are in CNY with a peak/off-peak pair since August 2026.",
        },
      ],
    },
    {
      heading: "2024: Context Caching Arrives",
      blocks: [
        {
          type: "p",
          content:
            "In <strong>August 2024</strong>, DeepSeek launched disk-based context caching, default-on for everyone: <strong>$0.014/M cache-hit input</strong> versus <strong>$0.14/M cache-miss input</strong>. The mechanism — caching the computation for prompt prefixes and reusing it on matching requests — is the same idea that still powers today's cache-hit pricing, and it established caching as a first-class cost lever from the very beginning.",
        },
        {
          type: "p",
          content:
            "That December, <strong>V3</strong> set the 2025 baseline: <strong>$0.27/M input (miss), $0.07/M (hit), $1.10/M output</strong> from February 8, 2025.",
        },
      ],
    },
    {
      heading: "2025: The R1 Era and Time-of-Day Discounts",
      blocks: [
        {
          type: "p",
          content:
            "January 2025 brought <strong>R1</strong>, a dedicated reasoning model billed separately from the general model, at <strong>$0.55/M input and $2.19/M output</strong>. In <strong>February 2025</strong>, DeepSeek introduced its first verifiable off-peak discount: R1 cost up to <strong>75% less</strong> and V3 <strong>50% less</strong> during off-peak windows (16:30–00:30 UTC).",
        },
        {
          type: "p",
          content:
            "That off-peak discount ended on <strong>September 5, 2025</strong>, when V3.1 unified the general and reasoning models into one model with two modes. On <strong>September 29, 2025</strong>, the experimental V3.2-Exp used a new sparse-attention architecture to cut prices <strong>50%+ immediately</strong> — cache-hit input fell to <strong>$0.028/M</strong>, cache-miss to <strong>$0.28/M</strong>, and output to <strong>$0.42/M</strong>.",
        },
      ],
    },
    {
      heading: "2026: V4, Flash/Pro Layering, and Peak/Off-Peak",
      blocks: [
        {
          type: "p",
          content:
            "In <strong>April 2026</strong>, DeepSeek previewed <strong>V4</strong> and replaced the old chat/reasoner split with a <strong>Flash/Pro capability tier</strong> (both 1M context, both thinking and non-thinking modes). A <strong>75% launch discount</strong> on Pro ran through early May, and cache-hit pricing across the API was cut to a tenth.",
        },
        {
          type: "p",
          content:
            "On <strong>August 16, 2026 at 16:00 UTC</strong>, DeepSeek introduced formal <strong>peak/off-peak pricing</strong>: off-peak is exactly half of peak, with peak windows at 09:00–12:00 and 14:00–18:00 Beijing time (Mon–Fri). This was a <em>raise</em> relative to the spring's flat pricing — Reuters reported increases of 50% to over 1,100% depending on the model and token type — even though off-peak remained cheaper than peak.",
        },
        {
          type: "p",
          content:
            "Now, <strong>September 10, 2026</strong> reverses direction for Flash: the new off-peak input (¥1.00), output (¥4.00), and cached input (¥0.02) are each lower than the August off-peak rates, and the cache-hit discount widened from 1/30 to <strong>1/50</strong>. Pro's pricing is unchanged.",
        },
      ],
    },
    {
      heading: "What Drives the Price: Three Levers",
      blocks: [
        {
          type: "ul",
          items: [
            "<strong>Caching</strong> — DeepSeek has priced cached input at a fraction of uncached input since 2024. Today that gap is ~50× on Flash. It rewards stable prompt prefixes and heavily reused context.",
            "<strong>Flash/Pro + thinking effort</strong> — the old “two models” became one family with a capability tier and a thinking-effort dial. Flash is the throughput/value layer; Pro is the ceiling for the hard requests.",
            "<strong>Time-of-day pricing</strong> — DeepSeek has repeatedly used peak/off-peak windows (2025 discount, then the 2026 peak/off-peak system) to move deferrable load off the busy windows. Off-peak has always been the cheap lane.",
          ],
        },
        {
          type: "p",
          content:
            "The net signal across two years: DeepSeek is managing <strong>per-unit economics</strong> with cache pricing, <strong>demand shape</strong> with time-of-day pricing, and <strong>product fit</strong> with Flash/Pro layering — rather than one flat number.",
        },
      ],
    },
    {
      heading: "How to Read Today's Prices",
      blocks: [
        {
          type: "p",
          content:
            "For V4 Flash today: <strong>off-peak ¥1.00 input / ¥4.00 output / ¥0.02 cached input per 1M tokens</strong>; peak is double. Compare that to V4 Pro (¥4.50 / ¥13.50 off-peak, ¥9.00 / ¥27.00 peak) and the July-30-cut GPT-5.6 Luna ($0.20 / $1.20). Flash's output is now below Luna's at every hour of the day, and its cached input economics are the cheapest of any model on the market.",
        },
        {
          type: "p",
          content:
            "The practical playbook has not changed: keep a stable prompt prefix to ride the cache lane, schedule batch and cron work off-peak, and default to Flash non-thinking for high-volume work — upgrading to Pro or higher thinking effort only where output quality pays for itself. See the current <a href=\"/deepseek-v4-flash-pricing\">DeepSeek V4 Flash pricing</a> for the live numbers.",
        },
      ],
    },
    {
      heading: "The Bottom Line",
      blocks: [
        {
          type: "p",
          content:
            "DeepSeek's pricing has moved from a flat V2/V3 model, through R1's separate reasoning SKU and 2025's off-peak discounts, to today's Flash/Pro peak-off-peak system. The September 2026 Flash cut is the latest swing of that pendulum — and a reminder that <strong>any single price is a snapshot, not a promise</strong>. The strategy that survives these changes is the one that treats caching, scheduling, and model routing as design inputs rather than fixed assumptions.",
        },
      ],
    },
  ],
  pricingTable: {
    headers: ["Event", "Input (miss)", "Output", "Cache hit"],
    rows: [
      {
        model: "Aug 2024 · Disk caching",
        input: "$0.14",
        output: "—",
        cacheHit: "$0.014",
        notes: "Context caching introduced",
      },
      {
        model: "Feb 2025 · V3",
        input: "$0.27",
        output: "$1.10",
        cacheHit: "$0.07",
        notes: "V3 baseline",
      },
      {
        model: "Jan 2025 · R1",
        input: "$0.55",
        output: "$2.19",
        cacheHit: "—",
        notes: "Separate reasoning model",
      },
      {
        model: "Sep 2025 · V3.2-Exp",
        input: "$0.28",
        output: "$0.42",
        cacheHit: "$0.028",
        notes: "50%+ cut via sparse attention",
      },
      {
        model: "Aug 2026 · V4 Flash off-peak",
        input: "¥1.50",
        output: "¥4.50",
        cacheHit: "¥0.05",
        notes: "Peak/off-peak launched",
      },
      {
        model: "Sep 2026 · V4 Flash off-peak",
        input: "¥1.00",
        output: "¥4.00",
        cacheHit: "¥0.02",
        notes: "Sep 10 repricing (peak = 2×)",
      },
    ],
  },
};

export const zh: ArticleContent = {
  sections: [
    {
      heading: "9 月 10 日的再次调价",
      blocks: [
        {
          type: "p",
          content:
            "2026 年 9 月 10 日北京时间 12:00，DeepSeek 再次下调了 V4 Flash 价格。闲时现为<strong>输入 ¥1.00/百万（缓存未命中）、输出 ¥4.00/百万、缓存命中输入 ¥0.02/百万</strong>；高峰为其整整两倍（¥2.00 / ¥8.00 / ¥0.04）。这是不到一个月内的第二次调价——也是 DeepSeek 自开放 API 以来一路剧烈波动定价故事的最新一章。",
        },
        {
          type: "p",
          content:
            "这段历史值得读懂，因为今天「便宜」的数字，是被一次次下调、上调、再重构出来的——而每一次变化都重塑着「谁才是性价比之王」。下面从 2024 年的 V2 时代一路讲到今天的 Flash/Pro 产品线。",
        },
      ],
    },
    {
      heading: "价格史一览",
      blocks: [
        {
          type: "p",
          content:
            "下面是最关键的定价变更时间线。除非另有说明，价格均为每百万 token；自 2026 年 8 月起，DeepSeek 自有模型采用高峰/闲时价格对。",
        },
      ],
    },
    {
      heading: "2024：上下文缓存登场",
      blocks: [
        {
          type: "p",
          content:
            "2024 年 8 月，DeepSeek 上线磁盘上下文缓存，默认对所有人开启：<strong>缓存命中输入 $0.014/M</strong>，<strong>未命中 $0.14/M</strong>。这一机制——缓存 prompt 前缀的计算并在匹配请求时复用——正是今天缓存命中定价的原型，也从一开始就把缓存确立为最核心的成本杠杆。",
        },
        {
          type: "p",
          content:
            "当年 12 月，<strong>V3</strong> 奠定了 2025 年的基线：自 2025 年 2 月 8 日起，<strong>输入未命中 $0.27/M、命中 $0.07/M、输出 $1.10/M</strong>。",
        },
      ],
    },
    {
      heading: "2025：R1 时代与分时折扣",
      blocks: [
        {
          type: "p",
          content:
            "2025 年 1 月，<strong>R1</strong> 作为独立推理模型上线，与通用模型分开计费，<strong>输入 $0.55/M、输出 $2.19/M</strong>。2025 年 2 月，DeepSeek 推出第一次可核验的闲时优惠：R1 在闲时窗口（16:30–00:30 UTC）成本最多<strong>低 75%</strong>，V3 <strong>低 50%</strong>。",
        },
        {
          type: "p",
          content:
            "这轮闲时折扣于 2025 年 9 月 5 日随 V3.1 结束，V3.1 把通用与推理模型合并为一个模型、两种模式。2025 年 9 月 29 日，实验版 V3.2-Exp 用新的稀疏注意力架构把价格<strong>立即下调 50%+</strong>——缓存命中输入降至 <strong>$0.028/M</strong>、未命中 <strong>$0.28/M</strong>、输出 <strong>$0.42/M</strong>。",
        },
      ],
    },
    {
      heading: "2026：V4、Flash/Pro 分层与高峰/闲时",
      blocks: [
        {
          type: "p",
          content:
            "2026 年 4 月，DeepSeek 预览 <strong>V4</strong>，用 <strong>Flash/Pro 能力分层</strong>取代了旧的 chat/reasoner 双模型（两者均 1M 上下文、均支持思考与非思考模式）。Pro 上市期至 5 月初有 <strong>75% 折扣</strong>，全线缓存命中价也降至原来的十分之一。",
        },
        {
          type: "p",
          content:
            "2026 年 8 月 16 日 16:00 UTC，DeepSeek 正式推出<strong>高峰/闲时定价</strong>：闲时恰好是高峰的一半，高峰窗口为北京时间 09:00–12:00 与 14:00–18:00（周一至周五）。相对春夏的平价，这是一次<em>上调</em>——路透社报道不同模型与 token 类型的涨幅在 50% 到 1100% 以上——尽管闲时仍比高峰便宜。",
        },
        {
          type: "p",
          content:
            "如今，<strong>2026 年 9 月 10 日</strong>对 Flash 而言再次转向下行：新的闲时输入（¥1.00）、输出（¥4.00）与缓存命中输入（¥0.02）都比 8 月的闲时价更低，缓存命中折扣也从 1/30 扩大到 <strong>1/50</strong>。Pro 价格保持不变。",
        },
      ],
    },
    {
      heading: "驱动价格的三大杠杆",
      blocks: [
        {
          type: "ul",
          items: [
            "<strong>缓存</strong>——自 2024 年起，DeepSeek 就把缓存命中输入按未命中的零头计费。今天 Flash 上这一差距约为 50 倍，奖励稳定的 prompt 前缀与高频复用的上下文。",
            "<strong>Flash/Pro + 思考 effort</strong>——「两个模型」变成同一家族的「能力层 + 思考力度」旋钮。Flash 是吞吐与性价比层，Pro 是处理最难请求的天花板。",
            "<strong>分时定价</strong>——DeepSeek 反复用高峰/闲时窗口（2025 折扣、2026 峰谷制）把可延后负载从繁忙时段挪开。闲时一直是便宜的通道。",
          ],
        },
        {
          type: "p",
          content:
            "两年间的总体信号：DeepSeek 在用<strong>缓存定价管理单位成本</strong>、用<strong>分时定价管理需求形状</strong>、用<strong>Flash/Pro 分层管理产品适配</strong>——而不是一个固定数字一以贯之。",
        },
      ],
    },
    {
      heading: "如何读懂今天的价格",
      blocks: [
        {
          type: "p",
          content:
            "以今天的 V4 Flash 为例：<strong>闲时输入 ¥1.00 / 输出 ¥4.00 / 缓存命中输入 ¥0.02 每百万 token</strong>，高峰为两倍。对比 V4 Pro（闲时 ¥4.50 / ¥13.50，高峰 ¥9.00 / ¥27.00）与 7 月 30 日降价后的 GPT-5.6 Luna（$0.20 / $1.20）。现在 Flash 的输出价在一天每个时段都低于 Luna，其缓存输入经济更是全市场最低。",
        },
        {
          type: "p",
          content:
            "实操打法没有变：保持稳定的 prompt 前缀以走缓存通道、把批处理与 cron 任务排到闲时、高并发常规工作默认 Flash 非思考模式——只在输出质量值得买单时才升级到 Pro 或更高思考力度。当前实时价格见 <a href=\"/deepseek-v4-flash-pricing\">DeepSeek V4 Flash 定价</a>。",
        },
      ],
    },
    {
      heading: "总结",
      blocks: [
        {
          type: "p",
          content:
            "DeepSeek 的定价已从平价的 V2/V3 模型，走过 R1 独立推理 SKU 与 2025 年闲时折扣，演进到今天 Flash/Pro 的高峰/闲时体系。2026 年 9 月的 Flash 下调是这口钟摆的最新一次摆动——也提醒我们<strong>任何单一价格都只是快照，而非承诺</strong>。能穿越这些变化的策略，是把缓存、调度与模型路由当作设计输入，而不是固定的假设。",
        },
      ],
    },
  ],
  pricingTable: {
    headers: ["事件", "输入（未命中）", "输出", "缓存命中"],
    rows: [
      {
        model: "2024-08 · 磁盘缓存",
        input: "$0.14",
        output: "—",
        cacheHit: "$0.014",
        notes: "上下文缓存引入",
      },
      {
        model: "2025-02 · V3",
        input: "$0.27",
        output: "$1.10",
        cacheHit: "$0.07",
        notes: "V3 基线",
      },
      {
        model: "2025-01 · R1",
        input: "$0.55",
        output: "$2.19",
        cacheHit: "—",
        notes: "独立推理模型",
      },
      {
        model: "2025-09 · V3.2-Exp",
        input: "$0.28",
        output: "$0.42",
        cacheHit: "$0.028",
        notes: "稀疏注意力降价 50%+",
      },
      {
        model: "2026-08 · V4 Flash 闲时",
        input: "¥1.50",
        output: "¥4.50",
        cacheHit: "¥0.05",
        notes: "高峰/闲时制度上线",
      },
      {
        model: "2026-09 · V4 Flash 闲时",
        input: "¥1.00",
        output: "¥4.00",
        cacheHit: "¥0.02",
        notes: "9 月 10 日调价（高峰=2 倍）",
      },
    ],
  },
};
