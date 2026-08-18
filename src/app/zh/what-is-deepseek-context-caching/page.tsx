/** 文件说明：什么是 DeepSeek 上下文缓存 SEO 落地页中文镜像路由。 */
export { default } from "../../(site)/what-is-deepseek-context-caching/page";
import type { Metadata } from "next";
import { buildGlossaryMetadata } from "@/lib/routeMetadata";

export function generateMetadata(): Metadata {
  return buildGlossaryMetadata("what-is-deepseek-context-caching", "zh");
}
