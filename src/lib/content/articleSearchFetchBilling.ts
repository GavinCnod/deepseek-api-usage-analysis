import type { ArticleContent } from "@/lib/content";

export const en: ArticleContent = {
  sections: [
    {
      heading: "Search & Fetch: What DeepSeek Launched",
      blocks: [
        {
          type: "p",
          content:
            "On <strong>October 17, 2026</strong>, DeepSeek opened two standalone APIs alongside DeepSeek-V4.1-Flash-1017: <strong>Search</strong> and <strong>Fetch</strong>. Both are raw JSON APIs powered by DeepSeek's in-house search engine, which the company says serves hundreds of millions of requests per day worldwide.",
        },
        {
          type: "p",
          content:
            "They solve different halves of the same problem. <strong>Search</strong> finds pages for a query and returns structured results — title, URL, snippet, summary, publication date, relevance score, and an authority tier. <strong>Fetch</strong> takes a known URL and returns the page content as Markdown. Most production agents use both: Search to discover, Fetch to read.",
        },
        {
          type: "table",
          headers: ["API", "Endpoint", "What it returns"],
          rows: [
            ["Search", "<code>POST /v1/tools/search</code>", "Ranked results with title, URL, snippet, summary, date, authority"],
            ["Fetch", "<code>POST /v1/tools/fetch</code>", "Page title and body as Markdown"],
          ],
        },
        {
          type: "p",
          content:
            "Search supports operators such as <code>site:</code>, <code>-site:</code>, <code>\"exact phrase\"</code>, <code>lang:</code>, <code>after:</code>, and <code>before:</code>. That makes it useful for site-restricted research, fresh-news queries, and multi-language monitoring. Fetch is read-only and subject to the target site's availability and access policy.",
        },
      ],
    },
    {
      heading: "How Billing Works",
      blocks: [
        {
          type: "p",
          content:
            "Search and Fetch are billed <strong>per successful request</strong>, not by tokens and not by the number of returned results. The official price is <strong>$0.75 per 1,000 successful requests</strong> in USD and <strong>¥5 per 1,000 successful requests</strong> in CNY — roughly <strong>$0.00075 / ¥0.005 per call</strong>.",
        },
        {
          type: "p",
          content:
            "A request is billable only when it returns HTTP 200 and produces a result: Search must return a non-empty <code>results</code> array, and Fetch must return page content. Failed requests, empty search results, and timeouts are free. The <code>count</code> parameter (1–50, default 10) changes how many results you receive but <strong>not</strong> the price.",
        },
        {
          type: "table",
          headers: ["Item", "Rule"],
          rows: [
            ["Search price", "¥5 / $0.75 per 1,000 successful requests"],
            ["Fetch price", "¥5 / $0.75 per 1,000 successful requests"],
            ["Billing trigger", "HTTP 200 + non-empty result"],
            ["Failures / empty results", "Not billed"],
            ["count parameter", "Does not change the per-request price"],
            ["Peak / off-peak", "Does not apply to Search / Fetch"],
          ],
        },
        {
          type: "p",
          content:
            "There was one important transition. Calls made through server-side tools in <strong>DeepSeek Harness, Claude Code, and Codex</strong> were free until <strong>October 31, 2026 at 16:00 UTC</strong> — <strong>November 1, 2026 at 00:00 Beijing time</strong>. Standalone API calls were billed from launch. If you use a coding agent with web search, that free window is already over.",
        },
      ],
    },
    {
      heading: "What function_call Looks Like in Your CSV",
      blocks: [
        {
          type: "p",
          content:
            "DeepSeek records Web tool charges as <code>type=function_call</code> rows in the usage export. The new export also adds a <code>name</code> column. For normal token rows, <code>name</code> equals <code>model</code>; for tool rows, <code>model</code> is empty and <code>name</code> identifies the tool.",
        },
        {
          type: "inline_code",
          content:
            "user_id,start_time_iso,end_time_iso,model,name,api_key_name,api_key,type,price,amount",
        },
        {
          type: "p",
          content: "A typical tool row looks like this (keys masked):",
        },
        {
          type: "inline_code",
          content:
            "...,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-search,Key A,sk-***,function_call,0.005,1",
        },
        {
          type: "p",
          content:
            "The cost CSV mirrors the same charge with an empty <code>model</code> and the same <code>name</code>:",
        },
        {
          type: "inline_code",
          content:
            "user_id,start_time_iso,end_time_iso,model,name,wallet_type,cost,currency",
        },
        {
          type: "inline_code",
          content:
            "...,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-search,Granted,0.005,CNY",
        },
        {
          type: "ul",
          items: [
            "<code>model</code> is empty because a tool charge does not belong to a model.",
            "<code>name</code> is the billing item: <code>tool-search</code>, <code>tool-fetch</code>, or a variant such as <code>server-tool-search</code> depending on the export/call path.",
            "<code>price</code> is the per-call price (currently 0.005 CNY) and <code>amount</code> is the number of calls.",
            "<code>wallet_type</code> can be <code>Paid</code> or <code>Granted</code>; granted balance still produces a cost row.",
          ],
        },
      ],
    },
    {
      heading: "How to Reconcile Tool Charges",
      blocks: [
        {
          type: "p",
          content:
            "The cost CSV is the authoritative bill. Its tool rows already contain the final charge, so do not add the amount CSV estimate on top of them — that would double count. Use the amount row's <code>price × amount</code> as a cross-check, not as a second charge.",
        },
        {
          type: "p",
          content:
            "A simple reconciliation looks like this:",
        },
        {
          type: "ol",
          items: [
            "Sum all cost CSV rows: this is your actual bill.",
            "Split them into token rows (non-empty <code>model</code>) and tool rows (empty <code>model</code>).",
            "For tool rows, group by <code>date</code> and <code>name</code>; allocate to API keys by their tool-call counts if your cost file does not include keys.",
            "Compare the tool-row total with <code>Σ price × amount</code> from the amount CSV. If they match, the export is internally consistent.",
            "If they differ, trust the cost CSV and investigate missing usage rows or a platform revision.",
          ],
        },
        {
          type: "p",
          content:
            "Our browser-side dashboard does this automatically: it parses <code>function_call</code> rows into a synthetic Web Tools dimension, attributes them to the right API key, and includes them in total cost exactly once. If cost and amount disagree, it shows a warning rather than silently picking one.",
        },
      ],
    },
    {
      heading: "7 Practical Use Cases",
      blocks: [
        {
          type: "h3",
          content: "1. Real-time research and fact-checking",
        },
        {
          type: "p",
          content:
            "Run Search for a question, prefer results with a recent <code>date</code> and high <code>authority</code>, then Fetch the primary source and ask the model to answer with citations. This is the classic research loop: Search narrows the candidate set, Fetch gives the model the actual text, and the citation fields keep the answer auditable.",
        },
        {
          type: "h3",
          content: "2. Competitive pricing and product monitoring",
        },
        {
          type: "p",
          content:
            "A daily job can run <code>site:competitor.com after:2026-10-01</code>, fetch the pricing page, and diff the Markdown against yesterday's snapshot. Search finds the change; Fetch gives you the full page. The same pattern works for product launches, changelogs, and packaging changes.",
        },
        {
          type: "h3",
          content: "3. Agentic RAG over live documentation",
        },
        {
          type: "p",
          content:
            "Internal knowledge bases go stale. Combine your internal retrieval with a web Search for the latest docs, release notes, or API reference, then Fetch the most relevant page. The model gets both company context and current external facts — without pretending the internal index is up to date.",
        },
        {
          type: "h3",
          content: "4. News and industry briefings",
        },
        {
          type: "p",
          content:
            "Use <code>after:</code> to restrict results to the last day or week, <code>lang:</code> to control language, and <code>authority</code> to filter low-quality sources. Fetch the top few articles and generate a short briefing with links. This is a natural fit for a scheduled agent that posts to Slack, Feishu, or email.",
        },
        {
          type: "h3",
          content: "5. E-commerce, travel, and local discovery",
        },
        {
          type: "p",
          content:
            "Search supports a <code>localization</code> hint and returns publication dates, which helps with local recommendations, opening hours, prices, and recent reviews. Fetch the merchant or listing page for details. The same flow powers product research, travel planning, and local-service comparisons.",
        },
        {
          type: "h3",
          content: "6. Coding agents that read the docs",
        },
        {
          type: "p",
          content:
            "Claude Code, Codex, and DeepSeek Harness can call server-side web search while working on a repository. A good pattern is: search the exact error message, fetch the official release notes or GitHub issue, then patch the code. This reduces hallucinated APIs and outdated migration advice. Remember that server-side tool calls are now billed per successful request.",
        },
        {
          type: "h3",
          content: "7. SEO / GEO visibility and due diligence",
        },
        {
          type: "p",
          content:
            "Search your brand, product, or executive name; use <code>site:reddit.com</code> or <code>site:zhihu.com</code> to see community discussion; fetch the highest-authority pages. For due diligence, combine company-site Search, recent news, and Fetch on filings or press releases. The <code>authority</code> and <code>rerank_score</code> fields help rank what is worth reading first.",
        },
      ],
    },
    {
      heading: "Cost Control Playbook",
      blocks: [
        {
          type: "ul",
          items: [
            "<strong>Cache stable queries.</strong> If the same search runs every hour, store the result and reuse it until the underlying page changes.",
            "<strong>Deduplicate and merge queries.</strong> One well-scoped Search is usually cheaper than five near-duplicates.",
            "<strong>Narrow with <code>site:</code>, <code>after:</code>, and <code>lang:</code>.</strong> Fewer irrelevant results means fewer Fetch calls and fewer tokens.",
            "<strong>Use <code>count</code> deliberately.</strong> It does not change the price, but a larger result set costs more model tokens downstream.",
            "<strong>Choose <code>need_content</code> vs Fetch.</strong> One Search with content can replace a Search plus several Fetch calls; the trade-off is a longer model context.",
            "<strong>Watch <code>function_call</code> rows.</strong> Track tool spend per API key and set a monthly budget for agent workloads.",
          ],
        },
      ],
    },
    {
      heading: "FAQ",
      blocks: [
        {
          type: "ul",
          items: [
            "<strong>Is Search billed per token?</strong> No. It is billed per successful request — ¥5 / $0.75 per 1,000.",
            "<strong>Does a larger <code>count</code> cost more?</strong> No. The per-request price is flat; only downstream model tokens may grow.",
            "<strong>Why is <code>model</code> empty in the CSV?</strong> Because the charge belongs to a tool, not a model. <code>name</code> identifies the tool.",
            "<strong>Why do I see both search and fetch rows?</strong> Search and Fetch are separate APIs and are billed independently.",
            "<strong>Are empty results billed?</strong> No. Only HTTP 200 responses with a non-empty result are billable.",
            "<strong>How do I estimate the monthly cost?</strong> <code>Search calls / 1000 × 5 + Fetch calls / 1000 × 5</code> in CNY, or the same formula with 0.75 in USD.",
            "<strong>Where can I see this in my dashboard?</strong> Upload the DeepSeek ZIP and select the Web Tools filter; the tool cost is also included in total cost and per-key breakdowns.",
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
            "Search and Fetch turn DeepSeek from a model API into a live-web platform. The billing model is simple — pay for successful requests, not tokens — but it introduces a second accounting dimension. Once you know that <code>function_call</code> rows with an empty <code>model</code> are tool charges, and that the cost CSV is the authoritative value, reconciliation becomes straightforward.",
        },
        {
          type: "p",
          content:
            "Drop your DeepSeek export into our <a href=\"/\">free browser-side dashboard</a> to see Web Tools cost, calls, and per-key attribution automatically. Use the <a href=\"/deepseek-api-pricing-calculator\">pricing calculator</a> to model Search / Fetch volume, and read the <a href=\"/blog/deepseek-csv-export-format-changed-aug-2026\">CSV format guide</a> if you are also dealing with the August schema change.",
        },
      ],
    },
  ],
};

export const zh: ArticleContent = {
  sections: [
    {
      heading: "Search & Fetch：DeepSeek 开放了什么",
      blocks: [
        {
          type: "p",
          content:
            "2026 年 10 月 17 日，DeepSeek 随 DeepSeek-V4.1-Flash-1017 一起开放了两个独立 API：<strong>Search</strong> 与 <strong>Fetch</strong>。两者都是 raw JSON API，由 DeepSeek 自研搜索引擎驱动。官方称该引擎每天在全球处理数亿次请求。",
        },
        {
          type: "p",
          content:
            "它们解决的是同一个问题的两半：<strong>Search</strong> 根据 query 找页面，返回结构化结果——标题、URL、snippet、summary、发布时间、相关性分数和权威度；<strong>Fetch</strong> 接收已知 URL，把页面正文转成 Markdown。生产级 Agent 通常两者都用：Search 负责发现，Fetch 负责阅读。",
        },
        {
          type: "table",
          headers: ["API", "端点", "返回内容"],
          rows: [
            ["Search", "<code>POST /v1/tools/search</code>", "排序后的结果：标题、URL、snippet、summary、日期、权威度"],
            ["Fetch", "<code>POST /v1/tools/fetch</code>", "页面标题与 Markdown 正文"],
          ],
        },
        {
          type: "p",
          content:
            "Search 支持 <code>site:</code>、<code>-site:</code>、<code>\"精确短语\"</code>、<code>lang:</code>、<code>after:</code>、<code>before:</code> 等操作符，适合站点限定、新闻时效过滤和多语言监测。Fetch 是只读 API，受目标站点可用性与访问策略影响。",
        },
      ],
    },
    {
      heading: "计费规则",
      blocks: [
        {
          type: "p",
          content:
            "Search 与 Fetch 都按<strong>成功请求次数</strong>计费，不按 token，也不按返回结果条数。官方价格为 <strong>每 1,000 次成功请求 $0.75</strong>（美元）或 <strong>每 1,000 次成功请求 ¥5</strong>（人民币），折合每次约 <strong>$0.00075 / ¥0.005</strong>。",
        },
        {
          type: "p",
          content:
            "只有返回 HTTP 200 且产生结果的请求才计费：Search 必须返回非空 <code>results</code>，Fetch 必须返回页面正文。失败请求、空搜索结果、超时均不收费。<code>count</code> 参数（1–50，默认 10）只影响返回条数，<strong>不影响单次价格</strong>。",
        },
        {
          type: "table",
          headers: ["项目", "规则"],
          rows: [
            ["Search 价格", "每 1,000 次成功请求 ¥5 / $0.75"],
            ["Fetch 价格", "每 1,000 次成功请求 ¥5 / $0.75"],
            ["计费条件", "HTTP 200 + 非空结果"],
            ["失败 / 空结果", "不计费"],
            ["count 参数", "不改变单次价格"],
            ["高峰 / 闲时", "不适用于 Search / Fetch"],
          ],
        },
        {
          type: "p",
          content:
            "有一个重要过渡期：通过 <strong>DeepSeek Harness、Claude Code、Codex</strong> 的服务端工具调用在 <strong>2026-10-31 16:00 UTC</strong>（<strong>北京时间 2026-11-01 00:00</strong>）之前免费。独立 API 从上线起就按次计费。如果你在用带联网搜索的编程 Agent，这个免费窗口已经结束。",
        },
      ],
    },
    {
      heading: "CSV 里的 function_call 长什么样",
      blocks: [
        {
          type: "p",
          content:
            "DeepSeek 把 Web 工具费用记录为 <code>type=function_call</code> 行。新导出还增加了 <code>name</code> 列。普通 token 行的 <code>name</code> 等于 <code>model</code>；工具行的 <code>model</code> 为空，由 <code>name</code> 标识工具。",
        },
        {
          type: "inline_code",
          content:
            "user_id,start_time_iso,end_time_iso,model,name,api_key_name,api_key,type,price,amount",
        },
        {
          type: "p",
          content: "典型的工具行如下（Key 已脱敏）：",
        },
        {
          type: "inline_code",
          content:
            "...,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-search,Key A,sk-***,function_call,0.005,1",
        },
        {
          type: "p",
          content: "cost CSV 会镜像同一笔费用，<code>model</code> 同样为空，<code>name</code> 相同：",
        },
        {
          type: "inline_code",
          content:
            "user_id,start_time_iso,end_time_iso,model,name,wallet_type,cost,currency",
        },
        {
          type: "inline_code",
          content:
            "...,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-search,Granted,0.005,CNY",
        },
        {
          type: "ul",
          items: [
            "<code>model</code> 为空，因为工具费用不属于任何模型。",
            "<code>name</code> 是计费项：<code>tool-search</code>、<code>tool-fetch</code>，也可能是 <code>server-tool-search</code> 等变体，取决于导出/调用路径。",
            "<code>price</code> 是单次价格（当前 0.005 CNY），<code>amount</code> 是调用次数。",
            "<code>wallet_type</code> 可能是 <code>Paid</code> 或 <code>Granted</code>；赠送余额同样会产生费用行。",
          ],
        },
      ],
    },
    {
      heading: "如何核对工具费用",
      blocks: [
        {
          type: "p",
          content:
            "cost CSV 是权威账单。工具行的 cost 已经是最终扣费，不要再把 amount CSV 的估算加一遍，否则会重复计算。amount 的 <code>price × amount</code> 只用于交叉校验，不作为第二笔费用。",
        },
        {
          type: "p",
          content: "一个简单的对账流程：",
        },
        {
          type: "ol",
          items: [
            "汇总 cost CSV 所有行：这是实际账单。",
            "分成 token 行（<code>model</code> 非空）和工具行（<code>model</code> 为空）。",
            "工具行按 <code>date</code> 与 <code>name</code> 分组；如果 cost 文件没有 Key 维度，按各 Key 的调用次数分摊。",
            "把工具行总额与 amount CSV 的 <code>Σ price × amount</code> 对比；一致说明导出内部自洽。",
            "如果不一致，以 cost CSV 为准，并排查缺失的 usage 行或平台账单修订。",
          ],
        },
        {
          type: "p",
          content:
            "我们的浏览器端仪表盘会自动完成这些步骤：把 <code>function_call</code> 行解析为独立的 Web Tools 维度，归属到对应 API Key，并且只计入一次总费用。如果 cost 与 amount 不一致，会显示警告，而不是静默选择其中一个。",
        },
      ],
    },
    {
      heading: "7 个真实使用场景",
      blocks: [
        {
          type: "h3",
          content: "1. 实时研究与事实核查",
        },
        {
          type: "p",
          content:
            "先 Search 找候选结果，优先选择 <code>date</code> 较新、<code>authority</code> 较高的页面，再 Fetch 原文，让模型带引用回答。Search 缩小范围，Fetch 提供原文，引用字段让答案可审计。",
        },
        {
          type: "h3",
          content: "2. 竞品价格与产品监控",
        },
        {
          type: "p",
          content:
            "每天跑一次 <code>site:competitor.com after:2026-10-01</code>，Fetch 定价页，把 Markdown 与昨天快照做 diff。Search 发现变化，Fetch 拿到完整页面。同样的模式适用于产品发布、更新日志和套餐变更。",
        },
        {
          type: "h3",
          content: "3. Agentic RAG：实时文档",
        },
        {
          type: "p",
          content:
            "内部知识库会过期。把内部检索与 Web Search 结合，搜索最新文档、Release Notes 或 API Reference，再 Fetch 最相关页面。模型同时获得公司上下文和最新外部事实，而不是假装内部索引永远最新。",
        },
        {
          type: "h3",
          content: "4. 新闻与行业简报",
        },
        {
          type: "p",
          content:
            "用 <code>after:</code> 限定最近一天/一周，用 <code>lang:</code> 控制语言，用 <code>authority</code> 过滤低质来源。Fetch 前几篇文章，生成带链接的简报。这很适合定时 Agent 推送到 Slack、飞书或邮箱。",
        },
        {
          type: "h3",
          content: "5. 电商、旅行与本地生活",
        },
        {
          type: "p",
          content:
            "Search 支持 <code>localization</code> 提示，并返回发布时间，适合本地推荐、营业时间、价格和近期评价。Fetch 商家或商品页面获取细节。同样的流程可用于商品调研、旅行规划和本地服务比较。",
        },
        {
          type: "h3",
          content: "6. 会读文档的编程 Agent",
        },
        {
          type: "p",
          content:
            "Claude Code、Codex、DeepSeek Harness 可以在改代码时调用服务端搜索。一个好模式是：搜索完整报错，Fetch 官方 Release Notes 或 GitHub Issue，再打补丁。这能减少模型编造 API 和使用过时迁移建议。注意服务端工具调用现在按成功请求计费。",
        },
        {
          type: "h3",
          content: "7. SEO / GEO 品牌可见性与尽调",
        },
        {
          type: "p",
          content:
            "搜索品牌、产品或高管姓名；用 <code>site:reddit.com</code> 或 <code>site:zhihu.com</code> 看社区讨论；Fetch 权威度最高的页面。做尽调时，可以组合公司官网搜索、近期新闻，以及 Fetch 公告/财报页面。<code>authority</code> 与 <code>rerank_score</code> 能帮助判断先读什么。",
        },
      ],
    },
    {
      heading: "成本控制清单",
      blocks: [
        {
          type: "ul",
          items: [
            "<strong>缓存稳定 query。</strong> 同样的搜索每小时跑一次，可以在页面变化前复用结果。",
            "<strong>去重、合并 query。</strong> 一次范围清晰的 Search 通常比五次近似搜索更便宜。",
            "<strong>用 <code>site:</code>、<code>after:</code>、<code>lang:</code> 收窄范围。</strong> 无关结果越少，后续 Fetch 和 token 越少。",
            "<strong>有意识地使用 <code>count</code>。</strong> 它不影响单次价格，但结果越多，模型上下文 token 越多。",
            "<strong>在 <code>need_content</code> 与 Fetch 之间取舍。</strong> 一次带正文的 Search 可能替代一次 Search 加多次 Fetch，代价是更长的上下文。",
            "<strong>监控 <code>function_call</code> 行。</strong> 按 Key 跟踪工具费用，并给 Agent 设置月度预算。",
          ],
        },
      ],
    },
    {
      heading: "常见问题",
      blocks: [
        {
          type: "ul",
          items: [
            "<strong>Search 按 token 计费吗？</strong> 不。按成功请求计费——每 1,000 次 ¥5 / $0.75。",
            "<strong><code>count</code> 越大越贵吗？</strong> 不。单次价格固定，只有下游模型 token 可能增加。",
            "<strong>为什么 CSV 里 <code>model</code> 为空？</strong> 因为费用属于工具而不是模型，<code>name</code> 才是工具名。",
            "<strong>为什么同时有 search 和 fetch 两行？</strong> 两个 API 独立计费，同一天可能各调用一次。",
            "<strong>空结果收费吗？</strong> 不。只有 HTTP 200 且结果非空才计费。",
            "<strong>怎么估算月度费用？</strong> <code>Search 次数 / 1000 × 5 + Fetch 次数 / 1000 × 5</code>（人民币），美元把 5 换成 0.75。",
            "<strong>在仪表盘哪里看？</strong> 上传 DeepSeek ZIP 后选择 Web Tools 筛选；工具费用也计入总费用和各 Key 明细。",
          ],
        },
      ],
    },
    {
      heading: "写在最后",
      blocks: [
        {
          type: "p",
          content:
            "Search 与 Fetch 让 DeepSeek 从“模型 API”变成“实时 Web 平台”。计费模型很简单——按成功请求付费，而不是按 token——但它引入了第二个记账维度。只要记住：<code>model</code> 为空的 <code>function_call</code> 行就是工具费用，cost CSV 是权威值，对账就很直接。",
        },
        {
          type: "p",
          content:
            "把 DeepSeek 导出 ZIP 拖进我们的<a href=\"/\">免费浏览器端仪表盘</a>，即可自动查看 Web Tools 费用、调用次数和各 Key 归属。用<a href=\"/deepseek-api-pricing-calculator\">价格计算器</a>估算 Search / Fetch 用量；如果你还在处理 8 月的 schema 变更，可以读<a href=\"/blog/deepseek-csv-export-format-changed-aug-2026\">CSV 格式指南</a>。",
        },
      ],
    },
  ],
};
