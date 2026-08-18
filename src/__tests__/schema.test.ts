import { describe, it, expect } from "vitest";
import {
  buildArticleJsonLd,
  buildOrganizationJsonLd,
  buildFaqJsonLd,
  buildModelPricingJsonLd,
} from "@/lib/schema";
import { getBlogArticleLocaleMeta } from "@/lib/blogArticles";
import { getModelPricingContent } from "@/lib/content/modelPricingContent";
import translations from "@/i18n/translations";
import { buildLocaleUrl } from "@/lib/localeRouting";
import { MODEL_PRICING, MODEL_VENDOR } from "@/lib/modelPricing";
import { OG_IMAGE_URL } from "@/lib/site";

describe("buildOrganizationJsonLd", () => {
  it("represents the real publisher entity for English", () => {
    const result = buildOrganizationJsonLd("en");

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Organization");
    expect(result.name).toBe("MindRose Team");
    expect(result["@id"]).toBe("https://mindrose.xyz/#organization");
    expect(result.url).toBe("https://mindrose.xyz");
    expect(result.logo).toContain("ds-usage-logo.png");
    expect(result.sameAs).toEqual(
      expect.arrayContaining([
        "https://mindrose.xyz",
        "https://github.com/GavinCnod/deepseek-api-usage-analysis",
      ])
    );

    const contactPoint = result.contactPoint as Record<string, unknown>;
    expect(contactPoint["@type"]).toBe("ContactPoint");
    expect(contactPoint.email).toBe("hello@mindrose.xyz");

    const brand = result.brand as Record<string, unknown>;
    expect(brand["@type"]).toBe("Brand");
  });

  it("keeps a localized description for Chinese", () => {
    const result = buildOrganizationJsonLd("zh");

    expect(result["@type"]).toBe("Organization");
    expect(result.name).toBe("MindRose Team");
    // Chinese version should contain Chinese characters
    expect(result.description).toContain("本地");
    expect(result.inLanguage).toBe("zh");
  });
});

describe("buildFaqJsonLd", () => {
  it("reuses visible landing FAQ copy for English", () => {
    const result = buildFaqJsonLd("en");
    const items = result.mainEntity as Array<Record<string, unknown>>;

    expect(result["@type"]).toBe("FAQPage");
    expect(items).toHaveLength(9);
    expect(items[1].name).toBe(translations.en.landing.qaQ2);
    expect((items[1].acceptedAnswer as Record<string, unknown>).text).toBe(
      translations.en.landing.qaA2
    );
  });

  it("reuses visible landing FAQ copy for Chinese", () => {
    const result = buildFaqJsonLd("zh");
    const items = result.mainEntity as Array<Record<string, unknown>>;

    expect(items[2].name).toBe(translations.zh.landing.qaQ3);
    expect((items[2].acceptedAnswer as Record<string, unknown>).text).toBe(
      translations.zh.landing.qaA3
    );
  });
});

describe("buildArticleJsonLd", () => {
  it("builds Article schema that matches the shared blog metadata", () => {
    const meta = getBlogArticleLocaleMeta(
      "openai-claude-vs-deepseek-cost-comparison",
      "en"
    );
    const url = buildLocaleUrl("en", meta.pathname);
    const result = buildArticleJsonLd({
      locale: "en",
      headline: meta.title,
      description: meta.description,
      url,
      datePublished: meta.publishedTime,
      dateModified: meta.modifiedTime,
      authorName: meta.author,
      imageUrl: OG_IMAGE_URL,
    });

    expect(result["@type"]).toBe("Article");
    expect(result.headline).toBe(meta.title);
    expect(result.datePublished).toBe(meta.publishedTime);
    expect(result.dateModified).toBe(meta.modifiedTime);
    expect(result.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": url,
    });

    const author = result.author as Record<string, unknown>;
    expect(author["@id"]).toBe(buildLocaleUrl("en", "/author"));
    expect(author.name).toBe(meta.author);
  });
});

describe("buildModelPricingJsonLd", () => {
  it("keeps the visible FAQ intact and builds a full AggregateOffer for a peak/off-peak model", () => {
    const result = buildModelPricingJsonLd("v4Flash", "en");
    const items = result.mainEntity as Array<Record<string, unknown>>;
    const content = getModelPricingContent("v4Flash");

    expect(result["@type"]).toBe("FAQPage");
    expect(items).toHaveLength(content.faq.en.length);
    expect(result.url).toContain("/deepseek-v4-flash-pricing");
    expect(result.inLanguage).toBe("en");

    const product = result.about as Record<string, unknown>;
    expect(product["@type"]).toBe("Product");
    expect(product.name).toBe("DeepSeek V4 Flash");
    expect((product.brand as Record<string, unknown>).name).toBe(
      MODEL_VENDOR.v4Flash.name
    );

    const offers = product.offers as Record<string, unknown>;
    expect(offers["@type"]).toBe("AggregateOffer");
    expect(offers.priceCurrency).toBe("CNY");
    expect(offers.lowPrice).toBe("0.1");
    expect(offers.highPrice).toBe("9");
    expect(offers.offerCount).toBe(3);

    const specs = offers.priceSpecification as Array<Record<string, unknown>>;
    expect(specs).toHaveLength(3);
    expect(specs.map((s) => s.price)).toEqual(["3", "9", "0.1"]);
    expect(specs[0].description).toContain("per million input tokens");
    expect(specs[0].description).toContain("peak");

    const from = offers.availableAtOrFrom as Record<string, unknown>;
    expect(from["@type"]).toBe("Place");
    expect(from.name).toBe(MODEL_VENDOR.v4Flash.name);
    expect(from.url).toBe(MODEL_VENDOR.v4Flash.pricingUrl);
  });

  it("reflects flat list prices without off-peak notes for competitor models", () => {
    const result = buildModelPricingJsonLd("gpt56Luna", "en");
    const product = result.about as Record<string, unknown>;
    const offers = product.offers as Record<string, unknown>;
    const specs = offers.priceSpecification as Array<Record<string, unknown>>;

    expect(offers.priceCurrency).toBe("USD");
    expect(offers.lowPrice).toBe("0.02");
    expect(offers.highPrice).toBe("1.2");
    expect(specs.map((s) => s.price)).toEqual(["0.2", "1.2", "0.02"]);
    expect(specs[0].description).not.toContain("peak");
    expect((product.brand as Record<string, unknown>).name).toBe(
      MODEL_VENDOR.gpt56Luna.name
    );
    expect(MODEL_PRICING.gpt56Luna.currency).toBe("USD");
  });

  it("localizes FAQ copy and prices for Chinese", () => {
    const result = buildModelPricingJsonLd("v4Pro", "zh");
    const items = result.mainEntity as Array<Record<string, unknown>>;
    const product = result.about as Record<string, unknown>;
    const offers = product.offers as Record<string, unknown>;

    expect(result.inLanguage).toBe("zh");
    expect(items.length).toBeGreaterThan(0);
    expect(offers.priceCurrency).toBe("CNY");
    expect(offers.lowPrice).toBe("0.3");
    expect(offers.highPrice).toBe("27");
    expect(result.url).toContain("/zh/deepseek-v4-pro-pricing");
  });
});
