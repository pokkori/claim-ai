import { MetadataRoute } from "next";

const KEYWORD_SLUGS = [
  "claim-taiou-bun-rei",
  "customer-complaint-mail",
  "insyokuten-claim-taiou",
  "ec-claim-taiou",
  "hotel-claim-taiou",
  "kujou-taiou-manual",
  "claim-denwa-script",
  "monster-customer-taiou",
  "claim-taiou-kenshu",
  "ayamari-mail-template",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://claim-ai-beryl.vercel.app",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://claim-ai-beryl.vercel.app/tool",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://claim-ai-beryl.vercel.app/btob",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://claim-ai-beryl.vercel.app/guide/kasuhara",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://claim-ai-beryl.vercel.app/business",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://claim-ai-beryl.vercel.app/contact",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://claim-ai-beryl.vercel.app/legal",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://claim-ai-beryl.vercel.app/terms",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://claim-ai-beryl.vercel.app/privacy",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const keywordPages: MetadataRoute.Sitemap = KEYWORD_SLUGS.map((slug) => ({
    url: `https://claim-ai-beryl.vercel.app/keywords/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...keywordPages];
}
