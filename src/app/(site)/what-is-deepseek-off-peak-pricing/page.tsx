/** 文件说明：什么是 DeepSeek 闲时定价 SEO 落地页路由与元数据。 */
import type { Metadata } from "next";
import { GlossaryPage } from "@/components/GlossaryPage";
import GlossaryContent from "@/components/GlossaryContent";
import { buildGlossaryMetadata } from "@/lib/routeMetadata";

export function generateMetadata(): Metadata {
  return buildGlossaryMetadata("what-is-deepseek-off-peak-pricing", "en");
}

export default function GlossaryRoute() {
  return (
    <>
      <GlossaryPage slug="what-is-deepseek-off-peak-pricing" />
      <GlossaryContent slug="what-is-deepseek-off-peak-pricing" />
    </>
  );
}
