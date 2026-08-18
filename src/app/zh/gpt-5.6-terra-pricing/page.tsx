/** 文件说明：GPT-5.6 Terra 定价 SEO 落地页中文镜像路由。 */
export { default } from "../../(site)/gpt-5.6-terra-pricing/page";
import type { Metadata } from "next";
import { buildModelPricingMetadata } from "@/lib/routeMetadata";

export function generateMetadata(): Metadata {
  return buildModelPricingMetadata("gpt56Terra", "zh");
}
