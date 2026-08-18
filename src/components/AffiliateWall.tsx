"use client";

import { useTranslation } from "@/i18n";
import { trackOutboundClick } from "@/lib/analytics";
import { getAffiliatesByIds } from "@/lib/affiliates";

interface AffiliateWallProps {
  ids: string[];
  /** 卡片内文字是否居中（默认靠左）。首页推荐墙使用居中。 */
  centered?: boolean;
}

/**
 * 商业化推荐模块组件
 * 
 * 采用卡片式布局，展示联盟计划或推荐工具。
 * 包含名称、双语描述、佣金/条件信息，并处理出站链接追踪。
 */
export default function AffiliateWall({ ids, centered = false }: AffiliateWallProps) {
  const { locale } = useTranslation();
  const affiliates = getAffiliatesByIds(ids);

  if (affiliates.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {affiliates.map((item) => {
        const desc = item.description?.[locale as "en" | "zh"] || item.description?.en;
        const commission = item.commission?.[locale as "en" | "zh"] || item.commission?.en;
        const condition = item.condition?.[locale as "en" | "zh"] || item.condition?.en;

        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel={item.rel}
            onClick={() => trackOutboundClick("affiliate_wall", item.id)}
            className={`flex flex-col p-4 rounded-subtle transition-colors duration-200 group ${
              centered ? "text-center" : ""
            }`}
            style={{
              border: "1px solid var(--border)",
              background: "var(--bg)",
            }}
          >
            <div
              className={`flex items-center mb-2 ${
                centered ? "justify-center" : "justify-between"
              }`}
            >
              <h3
                className="text-sm font-semibold group-hover:underline"
                style={{ color: "var(--text-primary)" }}
              >
                {item.name}
              </h3>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--text-secondary)" }}
              >
                <path
                  d="M7 17L17 7M17 7H7m10 0v10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            {desc && (
              <p
                className="text-xs leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {desc}
              </p>
            )}

            {(commission || condition) && (
              <div
                className="mt-auto pt-3 flex flex-col gap-1.5"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                {commission && (
                  <p className="text-[11px] font-medium" style={{ color: "var(--accent)" }}>
                    {commission}
                  </p>
                )}
                {condition && (
                  <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                    {condition}
                  </p>
                )}
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
}
