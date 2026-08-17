/**
 * 文件说明：验证 sitemap 双语条目与基础 SEO 属性。
 */
import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("返回完整的双语条目集合", () => {
    const entries = sitemap();
    expect(entries.length).toBe(30);
  });

  it("包含英文无前缀与中文 /zh 路由", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toContain("https://deepseek-usage.xyz");
    expect(urls).toContain("https://deepseek-usage.xyz/zh");
    expect(urls.some((u) => u.endsWith("/guideline"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/zh/guideline"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/privacy"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/zh/privacy"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/terms"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/zh/terms"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/changelog"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/zh/changelog"))).toBe(true);
  });

  it("has differentiated lastModified dates", () => {
    const entries = sitemap();

    // home and changelog use buildDate (today), privacy/terms use 2026-06-08
    const privacyEntry = entries.find((e) => e.url.endsWith("/privacy"))!;
    const changelogEntry = entries.find((e) => e.url.endsWith("/changelog"))!;

    // Privacy should have an older date than changelog
    expect(
      new Date(privacyEntry.lastModified!).getTime()
    ).toBeLessThan(
      new Date(changelogEntry.lastModified!).getTime()
    );
  });

  it("为双语镜像条目保留相同优先级", () => {
    const entries = sitemap();

    const home = entries.find((e) => e.url === "https://deepseek-usage.xyz");
    expect(home?.priority).toBe(1);

    const guideline = entries.find((e) => e.url === "https://deepseek-usage.xyz/guideline");
    expect(guideline?.priority).toBe(0.8);

    const zhGuideline = entries.find((e) => e.url === "https://deepseek-usage.xyz/zh/guideline");
    expect(zhGuideline?.priority).toBe(0.8);

    const privacy = entries.find((e) => e.url === "https://deepseek-usage.xyz/privacy");
    expect(privacy?.priority).toBe(0.5);
  });

  it("sets yearly changeFrequency for static pages", () => {
    const entries = sitemap();

    const privacy = entries.find((e) => e.url.endsWith("/privacy"))!;
    expect(privacy.changeFrequency).toBe("yearly");

    const terms = entries.find((e) => e.url.endsWith("/terms"))!;
    expect(terms.changeFrequency).toBe("yearly");
  });

  it("为英文与中文条目输出完整 hreflang 映射", () => {
    const entries = sitemap();

    const englishBlog = entries.find(
      (e) => e.url === "https://deepseek-usage.xyz/blog"
    )!;
    const chineseBlog = entries.find(
      (e) => e.url === "https://deepseek-usage.xyz/zh/blog"
    )!;

    expect(englishBlog.alternates?.languages).toEqual({
      en: "https://deepseek-usage.xyz/blog",
      zh: "https://deepseek-usage.xyz/zh/blog",
    });
    expect(chineseBlog.alternates?.languages).toEqual({
      en: "https://deepseek-usage.xyz/blog",
      zh: "https://deepseek-usage.xyz/zh/blog",
    });
  });
});
