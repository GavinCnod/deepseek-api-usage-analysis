/** 文件说明：DeepSeek V4 Flash 定价 SEO 落地页中文镜像路由。 */
export { default } from "../../(site)/deepseek-v4-flash-pricing/page";
import type { Metadata } from "next";
import { buildModelPricingMetadata } from "@/lib/routeMetadata";

export function generateMetadata(): Metadata {
  return buildModelPricingMetadata("v4Flash", "zh");
}
