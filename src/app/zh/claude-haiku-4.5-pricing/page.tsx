/** 文件说明：Claude Haiku 4.5 定价 SEO 落地页中文镜像路由。 */
export { default } from "../../(site)/claude-haiku-4.5-pricing/page";
import type { Metadata } from "next";
import { buildModelPricingMetadata } from "@/lib/routeMetadata";

export function generateMetadata(): Metadata {
  return buildModelPricingMetadata("claudeHaiku45", "zh");
}
