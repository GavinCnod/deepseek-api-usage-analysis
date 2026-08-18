/** 文件说明：什么是 DeepSeek 上下文缓存 SEO 落地页路由与元数据。 */
import type { Metadata } from "next";
import { GlossaryPage } from "@/components/GlossaryPage";
import GlossaryContent from "@/components/GlossaryContent";
import { buildGlossaryMetadata } from "@/lib/routeMetadata";

export function generateMetadata(): Metadata {
  return buildGlossaryMetadata("what-is-deepseek-context-caching", "en");
}

export default function GlossaryRoute() {
  return (
    <>
      <GlossaryPage slug="what-is-deepseek-context-caching" />
      <GlossaryContent slug="what-is-deepseek-context-caching" />
    </>
  );
}
