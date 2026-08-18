/** 文件说明：Claude Opus 5 定价 SEO 落地页路由与元数据。 */
import type { Metadata } from "next";
import { ModelPricingPage } from "@/components/ModelPricingPage";
import ModelPricingContent from "@/components/ModelPricingContent";
import { buildModelPricingMetadata } from "@/lib/routeMetadata";

export function generateMetadata(): Metadata {
  return buildModelPricingMetadata("claudeOpus5", "en");
}

export default function ModelPricingRoute() {
  return (
    <>
      <ModelPricingPage modelKey="claudeOpus5" />
      <ModelPricingContent modelKey="claudeOpus5" />
    </>
  );
}
