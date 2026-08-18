/** 文件说明：DeepSeek V4 Flash 定价 SEO 落地页路由与元数据。 */
import type { Metadata } from "next";
import { ModelPricingPage } from "@/components/ModelPricingPage";
import ModelPricingContent from "@/components/ModelPricingContent";
import { buildModelPricingMetadata } from "@/lib/routeMetadata";

export function generateMetadata(): Metadata {
  return buildModelPricingMetadata("v4Flash", "en");
}

export default function ModelPricingRoute() {
  return (
    <>
      <ModelPricingPage modelKey="v4Flash" />
      <ModelPricingContent modelKey="v4Flash" />
    </>
  );
}
