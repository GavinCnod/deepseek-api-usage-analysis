import type { ArticleContent } from "@/lib/content";

export const en: ArticleContent = {
  sections: [
    {
      heading: "DeepSeek Changed Its Usage Export Format",
      blocks: [
        {
          type: "p",
          content:
            "If you export usage or billing data from the DeepSeek platform, you may have noticed something different recently: the <strong>amount</strong> and <strong>cost</strong> CSV files no longer carry the <code>utc_date</code> column you were used to. They now ship ISO timestamps instead — and the filenames themselves changed shape.",
        },
        {
          type: "p",
          content:
            "That is not cosmetic. Any tool or script that hardcoded the old columns will now fail on the new exports. Here is exactly what changed, how to read the new format, and how to keep your usage analytics working.",
        },
        {
          type: "ul",
          items: [
            "The date column <code>utc_date</code> was replaced by <code>start_time_iso</code> and <code>end_time_iso</code>.",
            "<code>user_id</code> and (in the cost file) <code>wallet_type</code> are now always present.",
            "Filenames changed from <code>amount-2026-8.csv</code> to date-range names like <code>amount-2026-08-01_2026-08-17.csv</code>.",
          ],
        },
      ],
    },
    {
      heading: "Amount CSV — Column by Column",
      blocks: [
        {
          type: "inline_code",
          content:
            "user_id,start_time_iso,end_time_iso,model,api_key_name,api_key,type,price,amount",
        },
        {
          type: "ul",
          items: [
            "<code>utc_date</code> → replaced by <code>start_time_iso</code> / <code>end_time_iso</code> (ISO 8601 timestamps).",
            "<code>user_id</code> — now always present (previously optional).",
            "<code>model</code>, <code>api_key_name</code>, <code>api_key</code>, <code>type</code>, <code>price</code>, <code>amount</code> — unchanged.",
          ],
        },
        {
          type: "p",
          content:
            "A sample row looks like this (keys masked for privacy):",
        },
        {
          type: "inline_code",
          content:
            "u-****,2026-08-02T00:00:00+08:00,2026-08-03T00:00:00+08:00,deepseek-v4-pro,Key A,sk-****,output_tokens,0.000006,1890",
        },
      ],
    },
    {
      heading: "Cost CSV — Column by Column",
      blocks: [
        {
          type: "inline_code",
          content:
            "user_id,start_time_iso,end_time_iso,model,wallet_type,cost,currency",
        },
        {
          type: "ul",
          items: [
            "<code>utc_date</code> → replaced by <code>start_time_iso</code> / <code>end_time_iso</code>.",
            "<code>wallet_type</code> — now always present (e.g. <code>Paid</code>), previously optional.",
            "<code>cost</code> and <code>currency</code> — unchanged.",
          ],
        },
        {
          type: "p",
          content:
            "Note that the cost file still has no per-key breakdown: it is keyed by date and model only, which is why cost attribution to individual API keys still has to be done by token share.",
        },
      ],
    },
    {
      heading: "What Stayed the Same",
      blocks: [
        {
          type: "ul",
          items: [
            "The four <code>type</code> values are unchanged: <code>request_count</code>, <code>output_tokens</code>, <code>input_cache_hit_tokens</code>, <code>input_cache_miss_tokens</code>.",
            "<code>request_count</code> rows still leave <code>price</code> empty.",
            "<code>cost</code> semantics are unchanged (negative values still mean a charge).",
            "<code>price</code> and <code>amount</code> units are unchanged (per-token CNY prices, token / request counts).",
          ],
        },
      ],
    },
    {
      heading: "The Date Semantics — Read This Carefully",
      blocks: [
        {
          type: "p",
          content:
            "Every row's <code>start_time_iso</code> is midnight of a day in China Standard Time, e.g. <code>2026-08-02T00:00:00+08:00</code>, with <code>end_time_iso</code> at the next midnight. The <strong>billing day is simply the date part of <code>start_time_iso</code></strong> — <code>2026-08-02</code>.",
        },
        {
          type: "p",
          content:
            "Do not convert these timestamps to UTC when bucketing by day. <code>2026-08-02T00:00:00+08:00</code> converts to <code>2026-08-01T16:00:00Z</code>, which would shift every day back by one. Since the timestamps are already localized to <code>+08:00</code>, just take the first 10 characters of <code>start_time_iso</code> and you get the correct Beijing-local day.",
        },
      ],
    },
    {
      heading: "Filenames Changed Too",
      blocks: [
        {
          type: "ul",
          items: [
            "Old: <code>amount-2026-8.csv</code> / <code>cost-2026-8.csv</code> (month-based).",
            "New: <code>amount-2026-08-01_2026-08-17.csv</code> / <code>cost-2026-08-01_2026-08-17.csv</code> (date-range based).",
          ],
        },
        {
          type: "p",
          content:
            "If you merge multiple exports, pairing logic that only matches <code>amount-{year}-{month}.csv</code> will silently ignore the new names — update your filename pattern to also accept the date-range form, deriving the month from the start date.",
        },
      ],
    },
    {
      heading: "What It Means for Your Existing Tools",
      blocks: [
        {
          type: "p",
          content:
            "Scripts that read <code>raw['utc_date']</code> will now throw a <em>missing column</em> error on new exports. A quick compatibility fix is to prefer <code>start_time_iso</code> and fall back to <code>utc_date</code> when present, so both old and new files keep working.",
        },
        {
          type: "p",
          content:
            "Also double-check any logic that slices the date out of a timestamp — if it converts to UTC first, every daily total will be misaligned by one day.",
        },
      ],
    },
    {
      heading: "Our Dashboard Already Supports It",
      blocks: [
        {
          type: "p",
          content:
            "Version <strong>0.8.0</strong> of our free <a href=\"/deepseek-api-cost-tracker\">DeepSeek API Cost Tracker</a> parses the new export format out of the box: it derives the billing day from <code>start_time_iso</code>, pairs the new date-range filenames, and still fully supports legacy <code>utc_date</code> exports. Just drag the ZIP from the platform onto the page — everything runs locally in your browser, no upload, no signup.",
        },
        {
          type: "p",
          content:
            "See the <a href=\"/changelog\">changelog</a> for the full v0.8.0 notes.",
        },
      ],
    },
    {
      heading: "The Bottom Line",
      blocks: [
        {
          type: "p",
          content:
            "DeepSeek's export format change is easy to miss but easy to trip over: <strong>the date column is now an ISO timestamp, and filenames are date-range based.</strong> Treat the <code>start_time_iso</code> date part as the billing day, keep accepting legacy <code>utc_date</code> exports, and update your filename pairing. If you would rather not think about any of this, our dashboard already handles both formats for you.",
        },
      ],
    },
  ],
};

export const zh: ArticleContent = {
  sections: [
    {
      heading: "DeepSeek 改了用量导出格式",
      blocks: [
        {
          type: "p",
          content:
            "如果你从 DeepSeek 平台导出用量或账单数据，最近可能会发现一些不同：<strong>amount</strong> 和 <strong>cost</strong> 两个 CSV 文件不再包含你熟悉的 <code>utc_date</code> 列，取而代之的是 ISO 时间戳——连文件名本身也变了。",
        },
        {
          type: "p",
          content:
            "这可不是表面改动。任何硬编码旧列名的工具或脚本，都会在新导出文件上直接报错。下面我们逐条说明：到底改了哪些列、如何阅读新格式、以及如何让你的用量分析继续正常工作。",
        },
        {
          type: "ul",
          items: [
            "日期列 <code>utc_date</code> 被 <code>start_time_iso</code> 和 <code>end_time_iso</code> 取代。",
            "<code>user_id</code> 和（cost 文件中的）<code>wallet_type</code> 现在必带。",
            "文件名从 <code>amount-2026-8.csv</code> 变成日期区间式，如 <code>amount-2026-08-01_2026-08-17.csv</code>。",
          ],
        },
      ],
    },
    {
      heading: "amount CSV — 逐列拆解",
      blocks: [
        {
          type: "inline_code",
          content:
            "user_id,start_time_iso,end_time_iso,model,api_key_name,api_key,type,price,amount",
        },
        {
          type: "ul",
          items: [
            "<code>utc_date</code> → 由 <code>start_time_iso</code> / <code>end_time_iso</code>（ISO 8601 时间戳）取代。",
            "<code>user_id</code> — 现在必带（此前可选）。",
            "<code>model</code>、<code>api_key_name</code>、<code>api_key</code>、<code>type</code>、<code>price</code>、<code>amount</code> — 保持不变。",
          ],
        },
        {
          type: "p",
          content: "示例数据行（Key 已脱敏）：",
        },
        {
          type: "inline_code",
          content:
            "u-****,2026-08-02T00:00:00+08:00,2026-08-03T00:00:00+08:00,deepseek-v4-pro,Key A,sk-****,output_tokens,0.000006,1890",
        },
      ],
    },
    {
      heading: "cost CSV — 逐列拆解",
      blocks: [
        {
          type: "inline_code",
          content:
            "user_id,start_time_iso,end_time_iso,model,wallet_type,cost,currency",
        },
        {
          type: "ul",
          items: [
            "<code>utc_date</code> → 由 <code>start_time_iso</code> / <code>end_time_iso</code> 取代。",
            "<code>wallet_type</code> — 现在必带（如 <code>Paid</code>），此前可选。",
            "<code>cost</code> 与 <code>currency</code> — 保持不变。",
          ],
        },
        {
          type: "p",
          content:
            "注意：cost 文件仍然没有按 Key 拆分——它只按日期和模型聚合，所以把费用归因到各个 API Key，仍需要按 token 占比分摊。",
        },
      ],
    },
    {
      heading: "哪些保持不变",
      blocks: [
        {
          type: "ul",
          items: [
            "四种 <code>type</code> 值不变：<code>request_count</code>、<code>output_tokens</code>、<code>input_cache_hit_tokens</code>、<code>input_cache_miss_tokens</code>。",
            "<code>request_count</code> 行的 <code>price</code> 仍为空。",
            "<code>cost</code> 语义不变（负数仍表示扣费）。",
            "<code>price</code> 与 <code>amount</code> 的单位不变（每 token 的人民币单价、token/请求数量）。",
          ],
        },
      ],
    },
    {
      heading: "日期语义 — 务必看仔细",
      blocks: [
        {
          type: "p",
          content:
            "每行的 <code>start_time_iso</code> 都是北京时间当天零点，例如 <code>2026-08-02T00:00:00+08:00</code>，而 <code>end_time_iso</code> 是次日零点。<strong>账单日就是取 <code>start_time_iso</code> 的日期部分</strong>——即 <code>2026-08-02</code>。",
        },
        {
          type: "p",
          content:
            "按天分桶时，<strong>不要</strong>把这些时间戳转成 UTC。<code>2026-08-02T00:00:00+08:00</code> 转 UTC 后是 <code>2026-08-01T16:00:00Z</code>，会让每天整体错位一天。因为时间戳本身已经是 <code>+08:00</code> 时区，直接取 <code>start_time_iso</code> 的前 10 个字符，就能得到正确的北京时间账单日。",
        },
      ],
    },
    {
      heading: "文件名也变了",
      blocks: [
        {
          type: "ul",
          items: [
            "旧式：<code>amount-2026-8.csv</code> / <code>cost-2026-8.csv</code>（按月）。",
            "新式：<code>amount-2026-08-01_2026-08-17.csv</code> / <code>cost-2026-08-01_2026-08-17.csv</code>（按日期区间）。",
          ],
        },
        {
          type: "p",
          content:
            "如果你要合并多个月的导出，只匹配 <code>amount-{年}-{月}.csv</code> 的配对逻辑会静默忽略新文件名——请更新文件名匹配规则，同时接受日期区间式，并从起始日期推导出所属月份。",
        },
      ],
    },
    {
      heading: "对既有工具的影响",
      blocks: [
        {
          type: "p",
          content:
            "凡是读取 <code>raw['utc_date']</code> 的脚本，在新导出文件上都会抛出<em>缺少列</em>错误。一个快速兼容方案是：优先读 <code>start_time_iso</code>，若不存在再回退到 <code>utc_date</code>，这样新旧文件都能继续处理。",
        },
        {
          type: "p",
          content:
            "同时检查任何从时间戳里截取日期的逻辑——如果它先做了 UTC 转换，那么每天的汇总都会整体错位一天。",
        },
      ],
    },
    {
      heading: "我们的仪表盘已经适配",
      blocks: [
        {
          type: "p",
          content:
            "免费 <a href=\"/deepseek-api-cost-tracker\">DeepSeek API 费用追踪器</a> 的 <strong>v0.8.0</strong> 已开箱支持新导出格式：从 <code>start_time_iso</code> 派生账单日、按日期区间文件名配对月份，同时完整兼容旧的 <code>utc_date</code> 导出。把平台下载的 ZIP 直接拖进页面即可——全部在浏览器本地完成，不上传、不注册。",
        },
        {
          type: "p",
          content:
            "完整的 v0.8.0 说明见<a href=\"/changelog\">更新日志</a>。",
        },
      ],
    },
    {
      heading: "总结",
      blocks: [
        {
          type: "p",
          content:
            "DeepSeek 的导出格式变更容易被忽略，却很容易踩坑：<strong>日期列变成了 ISO 时间戳，文件名也改成了日期区间式。</strong>把 <code>start_time_iso</code> 的日期部分当作账单日、继续兼容旧 <code>utc_date</code> 导出、并更新文件名配对逻辑即可。如果你不想操心这些，我们的仪表盘已经替你处理好了两种格式。",
        },
      ],
    },
  ],
};