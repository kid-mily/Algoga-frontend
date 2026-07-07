import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/features/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  if (!baseUrl) {
    return [];
  }

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/classroom`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/classroom/packagelounge`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/notice`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  return staticPages;
}
