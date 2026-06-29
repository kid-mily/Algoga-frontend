import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kidmily.kro.kr";

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