/** 文件说明：什么是 DeepSeek 缓存命中率 SEO 落地页路由与元数据。 */
import type { Metadata } from "next";
import { GlossaryPage } from "@/components/GlossaryPage";
import GlossaryContent from "@/components/GlossaryContent";
import { buildGlossaryMetadata } from "@/lib/routeMetadata";

export function generateMetadata(): Metadata {
  return buildGlossaryMetadata("what-is-deepseek-cache-hit-rate", "en");
}

export default function GlossaryRoute() {
  return (
    <>
      <GlossaryPage slug="what-is-deepseek-cache-hit-rate" />
      <GlossaryContent slug="what-is-deepseek-cache-hit-rate" />
    </>
  );
}
