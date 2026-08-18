import type { ArticleContent } from "@/lib/content";

export const en: ArticleContent = {
  sections: [
    {
      heading: "Why Your DeepSeek API Bill Is Higher Than Expected",
      blocks: [
        {
          type: "p",
          content:
            "If you've been using the DeepSeek API for more than a few weeks, you've probably noticed something: your bill doesn't always match your mental math. You send what feels like a reasonable number of requests, yet the costs climb faster than expected. You're not alone — developers across Reddit, GitHub, and the NVIDIA forums have reported the same issue.",
        },
        {
          type: "p",
          content:
            "The culprit is almost always the same: <strong>low cache hit rates</strong>. DeepSeek's Context Caching (also called Disk Caching or KV Cache) can reduce your input token costs by up to 87.5%, but only if your requests are structured to take advantage of it. In this guide, we'll break down exactly how DeepSeek's caching works, why your hit rate might be suffering, and five concrete techniques to fix it.",
        },
      ],
    },
    {
      heading: "How DeepSeek Context Caching Actually Works",
      blocks: [
        {
          type: "p",
          content:
            'DeepSeek uses a <strong>prefix-matching</strong> approach to disk caching. Here\'s the key insight: DeepSeek caches the computation results for prompts starting from the <em>first token</em>. When you send a new request, the system checks whether the beginning of your prompt matches a previously cached prefix. If it does, the cached computation is reused — and you\'re charged the much lower cache-hit price instead of the full input price.',
        },
        {
          type: "p",
          content:
            "The pricing difference is dramatic. As of August 2026, DeepSeek V4 Flash charges <strong>¥3.00 per million input tokens</strong> for cache misses at peak (¥1.50 off-peak), but only <strong>¥0.10 per million for cache hits</strong> (¥0.05 off-peak) — that's a 96.7% discount (cached input is billed at 1/30 of the uncached rate). For V4 Pro, the ratio is identical: ¥9.00 miss vs ¥0.30 hit at peak.",
        },
        {
          type: "p",
          content:
            "But here's the critical detail: <strong>the matching is prefix-based and it starts from token 1.</strong> If you change anything at the beginning of your prompt — even a single character — the entire cache is invalidated. This is why prompt structure matters so much.",
        },
      ],
    },
    {
      heading: "5 Prompt Engineering Techniques to Maximize Cache Hits",
      blocks: [
        {
          type: "h3",
          content: "1. Keep System Prompts Absolutely Fixed",
        },
        {
          type: "p",
          content:
            "Your system prompt should be treated as immutable infrastructure. Place all static instructions — role definitions, formatting rules, output constraints — at the very beginning of every request. Any change to the system prompt, no matter how small, resets the cache. Version your system prompts and only update them when absolutely necessary.",
        },
        {
          type: "h3",
          content: "2. Put Dynamic Content at the End",
        },
        {
          type: "p",
          content:
            "Structure your prompts so that variable content — user questions, timestamps, conversation history, document contents — appears <em>after</em> the fixed system prompt and any shared context. This maximizes the length of the reusable prefix. The longer the cached prefix relative to your total input, the more you save.",
        },
        {
          type: "p",
          content:
            "Bad: <code>[User question] + [System prompt] + [Context]</code><br/>Good: <code>[System prompt] + [Context] + [User question]</code>",
        },
        {
          type: "h3",
          content: "3. Batch Similar Requests Together",
        },
        {
          type: "p",
          content:
            "When processing multiple documents or questions, group requests that share the same prefix. If you're analyzing multiple documents with the same system prompt, send them sequentially rather than interleaving with different prompt structures. Each prefix switch invalidates the cache.",
        },
        {
          type: "h3",
          content: "4. Use Fixed Conversation Templates",
        },
        {
          type: "p",
          content:
            "For chat applications, use a consistent conversation template where the system prompt and formatting wrappers are identical across all sessions. Variable content (user messages, assistant responses) should be appended after the fixed template. This way, every new conversation still benefits from the cached prefix.",
        },
        {
          type: "h3",
          content: "5. Monitor with a Dedicated Cache Analytics Tool",
        },
        {
          type: "p",
          content:
            "You can't improve what you don't measure. Our free <a href=\"/deepseek-cache-hit-rate-analyzer\">DeepSeek Cache Hit Rate Analyzer</a> shows your cache hit rate over time, broken down by API key. A hit rate above 40% (green) means your caching strategy is working well. Below 20% (red) is a strong signal that your prompt structure needs attention.",
        },
      ],
    },
    {
      heading: "How to Measure Your Cache Hit Rate",
      blocks: [
        {
          type: "p",
          content:
            'Upload your DeepSeek billing CSVs to our <a href="/">free dashboard</a> and switch to the Cache tab. You\'ll see:',
        },
        {
          type: "ul",
          items: [
            "A large-format cache hit rate percentage (your overall score)",
            "A daily cache hit rate trend line — spot the exact date a prompt change tanked your rate",
            "Per-key stacked bar charts showing hits (green) vs misses (gray) with exact percentages",
          ],
        },
        {
          type: "p",
          content:
            "If your hit rate is consistently below 20%, revisit techniques 1–4 above. If it's above 40%, you're in good shape — the remaining optimization headroom is smaller and may not be worth the engineering effort.",
        },
      ],
    },
    {
      heading: "The Bottom Line",
      blocks: [
        {
          type: "p",
          content:
            "DeepSeek's context caching is one of the most impactful cost-saving mechanisms available to API users, but it requires deliberate prompt engineering. The 5 techniques above — fixed system prompts, dynamic content at the end, request batching, consistent templates, and active monitoring — can easily push your cache hit rate from below 20% to above 50%, cutting your input costs by more than half.",
        },
        {
          type: "p",
          content:
            '<strong>Need help redesigning your LLM architecture for maximum cache efficiency?</strong> The MindRose team specializes in prompt engineering and AI system design. <a href="mailto:hello@mindrose.xyz">Let\'s talk →</a>',
        },
      ],
    },
  ],
};

export const zh: ArticleContent = {
  sections: [
    {
      heading: "为什么你的 DeepSeek API 账单比预期高？",
      blocks: [
        {
          type: "p",
          content:
            "如果你使用 DeepSeek API 超过几周，你可能已经注意到一个问题：账单并不总是和你心里预估的数字对得上。你觉得自己发送的请求数量合理，但费用却涨得比预期快。你并不孤单——Reddit、GitHub 和 NVIDIA 论坛上的开发者都报告过同样的问题。",
        },
        {
          type: "p",
          content:
            "罪魁祸首几乎总是同一个：<strong>过低的缓存命中率</strong>。DeepSeek 的上下文缓存（也叫 Disk Caching 或 KV Cache）可以将输入 Token 成本最高降低 87.5%，但前提是你的请求结构要能利用它。本指南将详细解释 DeepSeek 缓存的机制、为什么你的命中率可能偏低，以及五个具体的技术方案。",
        },
      ],
    },
    {
      heading: "DeepSeek 上下文缓存如何运作",
      blocks: [
        {
          type: "p",
          content:
            "DeepSeek 采用<strong>前缀匹配</strong>的磁盘缓存策略。核心要点：DeepSeek 从<em>第一个 token</em>开始缓存计算过程中的 Prompt。当你发送新请求时，系统会检查你的请求前缀是否匹配已缓存的前缀。如果匹配，这部分计算将被复用——你只需要支付远低于全价的缓存命中价格。",
        },
        {
          type: "p",
          content:
            "价格差异相当显著。截至 2026 年 8 月，DeepSeek V4 Flash 的缓存未命中价格是高峰时段<strong>每百万输入 Token ¥3.00</strong>（闲时 ¥1.50），而缓存命中只需 <strong>每百万 ¥0.10</strong>（闲时 ¥0.05）——折扣高达 96.7%（缓存命中输入按未命中价的 1/30 计费）。V4 Pro 的比例完全相同：高峰 ¥9.00 未命中 vs ¥0.30 命中。",
        },
        {
          type: "p",
          content:
            "但关键细节在于：<strong>匹配是从第一个 token 开始的前缀匹配。</strong>如果你修改了 Prompt 开头任何内容——哪怕只是一个字符——整个缓存都会失效。这就是 Prompt 结构如此重要的原因。",
        },
      ],
    },
    {
      heading: "5 个最大化缓存命中的 Prompt 工程技巧",
      blocks: [
        {
          type: "h3",
          content: "1. 确保系统提示词彻底固定",
        },
        {
          type: "p",
          content:
            "你的系统提示词（System Prompt）应该像基础设施一样不可变。把所有静态指令——角色定义、格式要求、输出约束——放在每次请求的最开头。系统提示词的任何修改，哪怕再小，都会重置缓存。给你的系统提示词做版本管理，只在必要时更新。",
        },
        {
          type: "h3",
          content: "2. 将动态内容放在末尾",
        },
        {
          type: "p",
          content:
            "设计 Prompt 结构时，将可变内容——用户问题、时间戳、对话历史、文档内容——放在<em>固定系统提示词和共享上下文之后</em>。这能最大化可复用前缀的长度。可缓存的稳态前缀越长，节省越多。",
        },
        {
          type: "p",
          content:
            "坏示例：<code>[用户问题] + [系统提示词] + [上文]</code><br/>好示例：<code>[系统提示词] + [上文] + [用户问题]</code>",
        },
        {
          type: "h3",
          content: "3. 把结构相同的请求放在一起发送",
        },
        {
          type: "p",
          content:
            "处理多个文档或问题时，将共享相同前缀的请求放在一起。如果你用同样的系统提示词分析多个文档，连续发送它们，不要穿插其他结构的 Prompt。每次前缀切换都会使缓存失效。",
        },
        {
          type: "h3",
          content: "4. 使用固定的对话模板",
        },
        {
          type: "p",
          content:
            "对于聊天类应用，使用一致的对话模板，确保不同会话之间的系统提示词和格式包装完全一致。可变内容（用户消息、助手响应）应追加在固定模板之后。这样，每次新对话仍能受益于缓存前缀。",
        },
        {
          type: "h3",
          content: "5. 用专用工具监控缓存命中率",
        },
        {
          type: "p",
          content:
            "无法度量就无法优化。我们的免费<a href=\"/deepseek-cache-hit-rate-analyzer\">DeepSeek 缓存命中率分析器</a>可以按 API Key 展示缓存命中率的长期趋势。命中率 > 40%（绿色）说明你的缓存策略运作良好；< 20%（红色）则强烈提示 Prompt 结构需要优化。",
        },
      ],
    },
    {
      heading: "如何测量你的缓存命中率",
      blocks: [
        {
          type: "p",
          content:
            '把 DeepSeek 账单 CSV 拖入我们的<a href="/">免费仪表盘</a>，切换到「缓存」标签页，你将看到：',
        },
        {
          type: "ul",
          items: [
            "大字号缓存命中率百分比（你的总体评分）",
            "每日缓存命中率趋势线——一眼看出哪次 Prompt 变动拖累了命中率",
            "按 Key 的堆叠柱状图（绿色 = 命中，灰色 = 未命中），附带精确百分比",
          ],
        },
        {
          type: "p",
          content:
            "如果命中率持续低于 20%，回到上面的技巧 1–4。如果已经超过 40%，恭喜——剩下的优化空间较小，可能不值得投入更多工程量。",
        },
      ],
    },
    {
      heading: "总结",
      blocks: [
        {
          type: "p",
          content:
            "DeepSeek 的上下文缓存是 API 用户可用的最高性价比成本节约机制之一，但它需要刻意的 Prompt 工程设计。上述五个技巧——固定系统提示词、动态内容放尾部、相似请求归组、统一模板和主动监控——可以轻松将缓存命中率从 20% 以下提升到 50% 以上，输入成本削减过半。",
        },
        {
          type: "p",
          content:
            '<strong>需要帮助重新设计 LLM 架构以获得最佳缓存效率？</strong> MindRose 团队专注于 Prompt 工程和 AI 系统设计。<a href="mailto:hello@mindrose.xyz">联系我们 →</a>',
        },
      ],
    },
  ],
};
