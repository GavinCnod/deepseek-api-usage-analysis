"use client";

/**
 * 分享按钮组件
 *
 * 显示在 Dashboard tab 导航栏右侧，点击后打开 ShareModal 弹窗。
 * SVG 分享图标 + 可选文字标签，最小化存在感。
 */

import { useState } from "react";
import dynamic from "next/dynamic";
import type { ShareTab } from "@/lib/shareCardData";

/** ShareModal 依赖 ECharts 生成分享卡片，仅在用户打开分享弹窗时按需加载。 */
const ShareModal = dynamic(() => import("./ShareModal"), { ssr: false });

// ============================================================================
// Props
// ============================================================================

export interface ShareButtonProps {
  /** 当前激活的 tab */
  tab: ShareTab;
  /** 按钮提示文字 */
  label: string;
}

// ============================================================================
// 主组件
// ============================================================================

export default function ShareButton({ tab, label }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-200"
        style={{ color: "var(--text-tertiary)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; }}
        title={label}
      >
        {/* 分享图标 SVG */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span className="hidden sm:inline">{label}</span>
      </button>

      {/* 分享弹窗 */}
      {showModal && (
        <ShareModal tab={tab} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
