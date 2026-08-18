/** 文件说明：英文首页路由。 */
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
 * 输出英文首页 metadata。
 */
export function generateMetadata(): Metadata {
  return buildHomeMetadata("en");
}

/**
 * 渲染英文首页，并输出当前 locale 对应的结构化数据。
 */
export default function Home() {
  return (
    <>
      <JsonLd data={buildSoftwareAppJsonLd("en")} />
      <JsonLd data={buildFaqJsonLd("en")} />
      <JsonLd data={buildOrganizationJsonLd("en")} />
      <Dashboard />
    </>
  );
}
