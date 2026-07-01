import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/features/seo/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api",
          "/auth",
          "/mypage",
          "/contentadmin",
          "/csadmin",
          "/moneyadmin",
          "/statisticadmin",
          "/superadmin",
          "/forbidden",
          "/error",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
