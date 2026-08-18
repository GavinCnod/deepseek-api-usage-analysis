/** 文件说明：Claude Sonnet 5 定价 SEO 落地页路由与元数据。 */
import type { Metadata } from "next";
import { ModelPricingPage } from "@/components/ModelPricingPage";
import ModelPricingContent from "@/components/ModelPricingContent";
import { buildModelPricingMetadata } from "@/lib/routeMetadata";

export function generateMetadata(): Metadata {
  return buildModelPricingMetadata("claudeSonnet5", "en");
}

export default function ModelPricingRoute() {
  return (
    <>
      <ModelPricingPage modelKey="claudeSonnet5" />
      <ModelPricingContent modelKey="claudeSonnet5" />
    </>
  );
}
