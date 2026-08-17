"use client";

import { useTranslation } from "@/i18n";
import AffiliateWall from "./AffiliateWall";

/** 推荐工具墙的固定联盟 ID 列表（与全站一致） */
const RECOMMENDED_IDS = ["opencode-go", "vultr", "railway", "tencent-cloud", "silicon-flow", "warp"];

type RecommendedToolsSectionProps = {
  /**
   * 最大内容宽度，对应页面正文容器宽度（Tailwind 需要静态类名，故用映射表）。
   * 默认 "6xl"，与首页/仪表盘容器一致。
   */
  maxWidth?: "2xl" | "3xl" | "6xl";
};

/** 静态类名映射，避免 Tailwind JIT 无法扫描动态类名 */
const MAX_WIDTH_CLASS: Record<NonNullable<RecommendedToolsSectionProps["maxWidth"]>, string> = {
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "6xl": "max-w-6xl",
};

/**
 * 底部推荐工具（商业化模块）
 *
 * 全站统一复用：展示 AffiliateWall「我们正在使用的好工具」区段。
 * 每个页面在 FooterBar 之前渲染一次，并用 maxWidth 对齐所在页面的正文容器宽度。
 */
export default function RecommendedToolsSection({
  maxWidth = "6xl",
}: RecommendedToolsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className={`mt-16 mb-4 ${MAX_WIDTH_CLASS[maxWidth]} mx-auto px-6`}>
      <h2
        className="text-sm font-semibold mb-3"
        style={{
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
        }}
      >
        {t.costTracker.recommendedUsingTools}
      </h2>
      <p
        className="text-xs leading-relaxed text-pretty mb-4"
        style={{ color: "var(--text-tertiary)" }}
      >
        {t.costTracker.recommendedUsingDes}
      </p>
      <AffiliateWall ids={RECOMMENDED_IDS} />
    </section>
  );
}