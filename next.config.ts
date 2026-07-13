import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
});

const getHostnameFromEnv = (value?: string) => {
  if (!value) return null;

  try {
    return new URL(value).hostname;
  } catch {
    return value.replace(/^https?:\/\//, "").replace(/\/$/, "") || null;
  }
};

const apiProxyHostname = getHostnameFromEnv(process.env.API_PROXY_TARGET);
const siteHostname = getHostnameFromEnv(process.env.NEXT_PUBLIC_SITE_URL);
const allowedDevOrigins = Array.from(
  new Set(
    [siteHostname, apiProxyHostname]
      .filter((hostname): hostname is string => Boolean(hostname))
      .flatMap((hostname) => [hostname, `https://${hostname}`])
  )
);

// 이미지가 서빙되는 호스트 목록.
// - 운영에서는 NEXT_PUBLIC_CDN_URL(예: CloudFront/커스텀 도메인)로 주입되는 호스트를 우선 사용
// - MinIO 형태(algoga-bucket.kro.kr)와 AWS 형태(cdn.algoga.kro.kr) 둘 다 폴백으로 허용
// 경로는 MinIO(.../버킷/디렉토리/...)와 AWS(.../디렉토리/...) 모양이 달라 "/**" 로 통합 허용한다.
const imageHostnames = Array.from(
  new Set(
    [
      getHostnameFromEnv(process.env.NEXT_PUBLIC_CDN_URL),
      "cdn.algoga.kro.kr", // AWS(CloudFront/커스텀 도메인) 형태
      "algoga-bucket.kro.kr", // MinIO 형태
    ].filter((hostname): hostname is string => Boolean(hostname))
  )
);

const nextConfig: NextConfig = {
  // Docker(ECS) 배포용: 최소 실행 파일만 담긴 standalone 서버 출력
  output: "standalone",

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 1. 외부 이미지 도메인 허용 (MinIO/AWS 형태 URL 모두 허용)
  images: {
    remotePatterns: imageHostnames.map((hostname) => ({
      protocol: "https" as const,
      hostname,
      pathname: "/**",
    })),
  },

  // 2. 로컬 개발 시 외부 도메인 접속 허용 (기존 설정 유지)
  allowedDevOrigins,

  // /public/data 아래 정적 파일을 30일 동안 브라우저에 캐시
  async headers() {
    return [
      {
        source: "/data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);