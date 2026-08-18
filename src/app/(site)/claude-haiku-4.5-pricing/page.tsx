/** 文件说明：Claude Haiku 4.5 定价 SEO 落地页路由与元数据。 */
import type { Metadata } from "next";
import { ModelPricingPage } from "@/components/ModelPricingPage";
import ModelPricingContent from "@/components/ModelPricingContent";
import { buildModelPricingMetadata } from "@/lib/routeMetadata";

export function generateMetadata(): Metadata {
  return buildModelPricingMetadata("claudeHaiku45", "en");
}

export default function ModelPricingRoute() {
  return (
    <>
      <ModelPricingPage modelKey="claudeHaiku45" />
      <ModelPricingContent modelKey="claudeHaiku45" />
    </>
  );
}
