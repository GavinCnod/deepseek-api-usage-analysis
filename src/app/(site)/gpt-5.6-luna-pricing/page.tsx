/** 文件说明：GPT-5.6 Luna 定价 SEO 落地页路由与元数据。 */
import type { Metadata } from "next";
import { ModelPricingPage } from "@/components/ModelPricingPage";
import ModelPricingContent from "@/components/ModelPricingContent";
import { buildModelPricingMetadata } from "@/lib/routeMetadata";

export function generateMetadata(): Metadata {
  return buildModelPricingMetadata("gpt56Luna", "en");
}

export default function ModelPricingRoute() {
  return (
    <>
      <ModelPricingPage modelKey="gpt56Luna" />
      <ModelPricingContent modelKey="gpt56Luna" />
    </>
  );
}
