/** 文件说明：中文首页镜像路由。 */
import type { Metadata } from "next";
import Dashboard from "@/components/Dashboard";
import JsonLd from "@/components/JsonLd";
import { buildHomeMetadata } from "@/lib/routeMetadata";
import {
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  buildSoftwareAppJsonLd,
} from "@/lib/schema";

/**
 * 输出中文首页 metadata。
 */
export function generateMetadata(): Metadata {
  return buildHomeMetadata("zh");
}

/**
 * 渲染中文首页，并输出当前 locale 对应的结构化数据。
 */
export default function ZhHomePage() {
  return (
    <>
      <JsonLd data={buildSoftwareAppJsonLd("zh")} />
      <JsonLd data={buildFaqJsonLd("zh")} />
      <JsonLd data={buildOrganizationJsonLd("zh")} />
      <Dashboard />
    </>
  );
}
